# Datenmodell — CMS (MongoDB / Mongoose)

## 0. MongoDB-Adaption (Nutzer-Vorgabe Phase 2)

Das Modell wurde ursprünglich relational entworfen; auf Wunsch läuft das CMS auf **MongoDB** (wie das Götz-Backend). Übersetzungsregeln:

| Relationales Konstrukt | MongoDB-Umsetzung |
|---|---|
| Join-Tabellen `UserRole`, `RolePermission` | eingebettet: `User.roles: [{ roleId, siteId }]`, `Role.permissions: string[]` (Keys aus `packages/permissions`, beim Speichern validiert) |
| `XxxTranslation`-Tabellen | eingebettetes Map-Feld `translations: { de: {...}, en: {...}, tr: {...} }` im Dokument |
| FK-Constraints | Service-seitige Integritätsprüfung + Indizes; Referenzen als ObjectId/String |
| Unique (siteId, slug) | zusammengesetzte Unique-Indizes in Mongoose-Schemas |
| Prisma-Migrationen | versionierte `migrate-mongo`-Skripte in `cms/migrations/` (Indizes, Seeds, Daten-Transformationen) |
| Session-Ablauf | TTL-Index auf `Session.expiresAt` |
| Transaktionen (Reorder, Publish) | MongoDB-Transaktionen (Replica-Set, ab Phase 4) oder atomare Einzeldokument-Updates |

**Konvention für alle Mongoose-Schemas:** Referenzfelder immer mit `@Prop({ type: SchemaTypes.ObjectId, ref: "..." })` deklarieren — `Types.ObjectId` als `type` registriert das Feld stillschweigend als `Mixed`, wodurch String-IDs in Queries nicht mehr gecastet werden und Abfragen leer zurückkommen (in Phase 2 als Bug gefunden und behoben).

Die folgenden Feldlisten gelten unverändert als Sollzustand; „Tabelle" ist als „Collection" zu lesen.

Konventionen:
- PK: `id` = CUID/UUID (String).
- Zeitstempel: `createdAt`, `updatedAt` auf allen Tabellen (nicht überall wiederholt).
- **Soft Delete**: `deletedAt DateTime?` auf allen inhaltstragenden Entitäten; Public-API filtert `deletedAt IS NULL`. Hard Delete nur für `Session`, `FormSubmission` (nach Aufbewahrungsfrist) und via Admin-„endgültig löschen" mit Berechtigung.
- **Mandantentrennung**: `siteId` (FK → Site, `onDelete: Restrict`) auf jeder inhaltstragenden Tabelle; Unique-Constraints immer zusammengesetzt mit `siteId`.
- **Sortierung**: `position Int` mit Lücken-System (1000, 2000, …), Umordnung transaktional, periodische Normalisierung.
- **Übersetzungsmodell**: Basisentität (sprachneutral: slugs optional sprachabhängig, Status, Medien, Relationen) + `XxxTranslation` (`locale`, übersetzbare Felder, `translationStatus: MISSING|DRAFT|COMPLETE|NEEDS_REVIEW`), Unique (`entityId`, `locale`).

## 1. Core

### Site
| Feld | Typ | Pflicht | Hinweis |
|---|---|---|---|
| id | String PK | ✓ | |
| key | String | ✓ | Unique, z. B. `yunity` |
| name | String | ✓ | |
| primaryDomain | String | ✓ | Unique; Domain→Site-Auflösung |
| cmsDomain | String? | | |
| defaultLocale | String | ✓ | `de` |
| enabledLocales | String[] | ✓ | `["de","en","tr"]` |
| timezone | String | ✓ | `Europe/Berlin` |
| status | Enum `ACTIVE\|SUSPENDED` | ✓ | |
| enabledModules | Json | ✓ | `{ pages: true, team: true, insights: false, ... }` |
| settings | Json | ✓ | nicht-sensible Defaults |

### User (global, nicht site-gebunden)
id · email (Unique) · passwordHash · firstName · lastName · status `ACTIVE|INVITED|DISABLED` · totpSecret? · lastLoginAt? · timestamps · deletedAt?

### Role
id · siteId? (null = globale Systemrolle) · name · description? · isSystem Bool — Unique (`siteId`, `name`).

### Permission
id · key (Unique, z. B. `pages.publish`) · description? — wird aus `packages/permissions` geseedet.

### UserRole
userId + roleId + siteId (Composite Unique). Site-Scope der Rollenzuweisung → ein User kann je Site andere Rollen haben.

### RolePermission
roleId + permissionId (Composite PK).

### Session
id · userId FK · tokenHash (Unique) · ipAddress · userAgent · rememberMe Bool · expiresAt · absoluteExpiresAt · revokedAt? · createdAt. Index (userId), (expiresAt).

### PasswordResetToken
id · userId · tokenHash · expiresAt · usedAt? — Einmal-Token.

### Page
| Feld | Typ | Hinweis |
|---|---|---|
| id, siteId | | |
| parentId | String? | Seitenbaum |
| internalName | String | |
| templateKey | String | `default`, `landing`, … |
| status | Enum `DRAFT\|IN_REVIEW\|APPROVED\|SCHEDULED\|PUBLISHED\|ARCHIVED` | |
| isHomepage | Bool | partieller Unique-Index je Site |
| position | Int | |
| currentDraftRevisionId / currentPublishedRevisionId | String? | Publishing-Snapshots |
| publishedAt, scheduledPublishAt | DateTime? | |
| createdBy, updatedBy | FK User | |
| deletedAt | DateTime? | |

### PageTranslation
pageId + locale (Unique) · title · navigationTitle? · **slug** (sprachabhängig, Unique je `siteId`+`locale`) · metaTitle? · metaDescription? · ogTitle? · ogDescription? · ogImageId? FK Media · canonicalUrl? · noIndex Bool · noFollow Bool · translationStatus.

### PageSection
id · pageId FK (Cascade) · blockType String · schemaVersion Int · internalLabel? · position Int · **data Json** (validiert gegen Block-Schema, je Locale verschachtelt: `{ de: {...}, en: {...} }` oder locale-neutrale Felder) · settings Json · visibility Json? · isEnabled Bool · timestamps. Index (pageId, position).

> Gleiche Sektionstabelle wird generisch auch für Detailseiten der Fachmodule genutzt: `ownerType Enum(PAGE|PRACTICE_AREA|EXPERTISE|LOCATION|TEAM_MEMBER|BLOG_ARTICLE)` + `ownerId` statt hartem `pageId` — **eine** polymorphe Tabelle `ContentSection` (Entscheidung: vereinfacht Editor-Wiederverwendung; FK-Integrität über geprüfte Service-Ebene + Composite-Index (ownerType, ownerId, position)).

### Navigation
id · siteId · key (`header|footer|legal|mobile|utility|custom`, Unique je Site) · name · timestamps.

### NavigationItem
id · navigationId FK Cascade · parentId? (Self-FK) · type Enum `PAGE|EXTERNAL|ANCHOR|GROUP|BUTTON|COLLECTION|PLACEHOLDER` · pageId? FK · url? · anchor? · target Enum `SELF|BLANK` · icon? · cssClass? · position Int · isVisible Bool · visibilityRules Json? · timestamps.
**NavigationItemTranslation**: itemId + locale → label. Warnlogik im Service: Ziel-Page gelöscht/unveröffentlicht.

### MediaFolder
id · siteId · parentId? · name · position.

### MediaAsset
id · siteId · folderId? · storageProvider · storageKey (Unique) · originalFilename · mimeType · fileSize Int · width?/height? · checksum · focalPointX?/focalPointY? Float · cropSettings Json? · dominantColor? · variants Json (erzeugte Größen/Formate) · status `PROCESSING|READY|ARCHIVED` · uploadedBy FK User · timestamps · deletedAt?.

### MediaTranslation
mediaId + locale → title? · altText? · caption? · description?.

### Setting
id · siteId · group (`general|company|header|footer|seo|integrations`) · key · value Json · isSensitive Bool (sensible Werte werden nie über Public-API ausgegeben; Secrets selbst liegen in ENV, hier nur Referenzen/Toggles). Unique (siteId, group, key).

### ContentRevision
id · siteId · entityType String · entityId String · version Int (Unique je Entität) · snapshot Json · changeSummary? · isPublishedSnapshot Bool · createdBy FK · createdAt. Index (entityType, entityId, version desc).

### AuditLog
id · siteId? · userId? · action String (`PAGE_PUBLISHED`, …) · entityType? · entityId? · before Json? · after Json? (sensible Felder redigiert) · ipAddress? · userAgent? · createdAt. Append-only, kein Update/Delete. Index (siteId, createdAt desc), (entityType, entityId).

## 2. Fachmodule

### PracticeArea
id · siteId · status (Workflow-Enum wie Page) · imageId? FK Media · icon? · position · featured Bool · publishedAt? · currentDraft/PublishedRevisionId · timestamps · deletedAt?.
**PracticeAreaTranslation**: + locale → title · subtitle? · excerpt? (Teaser) · body? (Rich Text, sanitisiert) · **slug** (Unique je siteId+locale) · note? · metaTitle? · metaDescription? · translationStatus.
Detail-Sektionen über `ContentSection(ownerType=PRACTICE_AREA)`. `focus[]` (Beratungsschwerpunkte) als Json-Feld `focusItems` in der Translation.

### Expertise
Struktur identisch zu PracticeArea (inkl. Translation, Sections). Zusatzfeld `services Json` in Translation (Liste der Leistungen).

### Location
id · siteId · status · imageId? · countryCode · street? · houseNumber? · postalCode? · city · region? · latitude?/longitude? Float · position · publishedAt? · Revision-Refs · settings Json (Öffnungszeiten-Struktur) · timestamps · deletedAt?.
**LocationTranslation**: locale → title (z. B. „Kanzleibüro Deutschland") · subtitle? · description? · directions? · slug · metaTitle? · metaDescription? · translationStatus.
Kontaktfelder über ContactField (unten); Detail-Sektionen über ContentSection.

### TeamMember
id · siteId · status · salutation? · titlePrefix? (`Dr. iur.`) · firstName · lastName · imageId? · categoryId? FK TeamCategory · position · featured Bool · publishedAt? · Revision-Refs · timestamps · deletedAt?.
**TeamMemberTranslation**: locale → jobTitle · headline? · subtitle? · shortBiography? · biography? (Rich Text) · quote? · slug · metaTitle? · metaDescription? · translationStatus.
Strukturierte Zusatzgruppen als Json-Felder (Phase 1) mit Option auf eigene Tabellen: `admissions`, `memberships`, `education`, `experience`, `publications` (jeweils übersetzbare Listen in Translation). `languages String[]` an Basisentität.

### TeamCategory
id · siteId · position · **TeamCategoryTranslation**: locale → title, description. (Abbildung von „Gründungspartner", „Partner und Rechtsanwälte", …)

### Competency
id · siteId · position · **CompetencyTranslation**: locale → title, slug.
**TeamMemberCompetency**: teamMemberId + competencyId + position.

### Relationstabellen (m:n, alle mit position für Sortierung)
`TeamMemberPracticeArea` · `TeamMemberExpertise` · `TeamMemberLocation` · `ExpertisePracticeArea` · `ExpertiseLocation` · `PracticeAreaLocation`.

### ContactField (polymorph, wiederverwendbar)
id · siteId · ownerType Enum `LOCATION|TEAM_MEMBER|SITE` · ownerId · fieldType Enum `PHONE|MOBILE|EMAIL|FAX|WEBSITE|ADDRESS|WHATSAPP|LINKEDIN|CUSTOM` · label · value · link? (z. B. `tel:` — null erlaubt für Platzhalternummern) · icon? · position · isPublic Bool · timestamps. Index (ownerType, ownerId).

## 3. Formulare

### Form
id · siteId · key (Unique je Site, z. B. `contact`) · name · status `ACTIVE|DISABLED|ARCHIVED` · successAction Enum `MESSAGE|REDIRECT` · redirectUrl? · notificationSettings Json (Empfänger, Auto-Reply-Template-Key) · spamSettings Json (honeypot, captcha?, rateLimit) · retentionDays Int? · timestamps · deletedAt?.
**FormTranslation**: locale → title? · successMessage · privacyText? · consentText?.

### FormField
id · formId FK Cascade · type Enum `TEXT|TEXTAREA|EMAIL|PHONE|NUMBER|DATE|TIME|SELECT|RADIO|CHECKBOX|CHECKBOX_GROUP|MULTISELECT|FILE|CONSENT|HIDDEN|HEADING|PARAGRAPH|DIVIDER` · name (Unique je Form) · required Bool · defaultValue? · width Enum `FULL|HALF|THIRD` · position · isEnabled Bool · validation Json (minLength, maxLength, min, max, pattern?, allowedFileTypes, maxFileSize, errorMessage?) · conditions Json? (`{action, operator, rules[]}`) · settings Json.
**FormFieldTranslation**: locale → label · placeholder? · helpText?.

### FormFieldOption
id · fieldId FK Cascade · value · position · isEnabled. **FormFieldOptionTranslation**: locale → label.

### FormSubmission
id · formId · siteId · data Json (validierte Werte; Datei-Referenzen auf privaten Storage) · status Enum `NEW|READ|IN_PROGRESS|COMPLETED|SPAM|ARCHIVED` · notes? · locale · ipHash (kein Klartext-IP) · userAgent? · referrer? · pageUrl? · spamScore? · submittedAt · processedAt? · deletedAt?. Aufbewahrung: Cron löscht hart nach `Form.retentionDays`.

## 4. Lösch- und Integritätsverhalten

| Beziehung | Verhalten |
|---|---|
| Site → alles | `Restrict` (Site-Löschung nur über expliziten Purge-Job) |
| Page → ContentSection/Translations | Cascade |
| Media referenziert in Inhalten | Löschen blockiert bei Verwendung (Verwendungsprüfung) → erst archivieren |
| User → Inhalte (createdBy) | `SetNull`-Semantik: FK bleibt, Anzeige „gelöschter Benutzer"; User nur soft-deleted |
| Collection-Eintrag in Collection-Block referenziert (`selectedIds`) | kein FK (Json) → Renderer filtert fehlende IDs, Admin warnt |
| Form → Fields/Options | Cascade; Submissions bleiben bis Retention |

## 5. Indizes (Auswahl)
- Unique: (siteId, key) auf Site-Key-Tabellen; (siteId, locale, slug) auf allen Translation-Slugs; (entityId, locale) je Translation.
- Performance: ContentSection (ownerType, ownerId, position) · AuditLog (siteId, createdAt) · FormSubmission (formId, status, submittedAt) · Session (tokenHash) · MediaAsset (siteId, folderId).

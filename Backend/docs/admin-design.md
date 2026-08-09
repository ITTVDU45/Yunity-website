# Admin-Design — Referenz: Götz & Götz Hebebühnen Backend

Vorgabe: Das Admin-Dashboard übernimmt die Designsprache des bestehenden Götz-Rental-Backends (`/Users/tolgahanvardar/Desktop/Götz/G-tzrental/src/app/admin` + `src/components/admin`), adaptiert auf die Projektmarke. **Nur das Design wird übernommen** — die dortige Technik (Next.js-API-Routes, MongoDB, MinIO-Direktzugriff, Single-User-Auth) wird bewusst nicht übernommen (siehe architecture.md).

## 1. Übernommene Designsprache (aus Götz-Analyse)

| Element | Götz-Referenz | Übernahme |
|---|---|---|
| Grundlayout | `flex`-Shell: sticky Sidebar `w-80` links, scrollender Content rechts, `bg-zinc-50 dark:bg-zinc-950` | identisch |
| Sidebar | weiß/zinc-900, `p-8`, Logo oben, Nav-Items als `rounded-2xl`-Pills, aktiv = Markenfarbe gefüllt + `shadow-lg shadow-{brand}/20` + ChevronRight mit `layoutId`-Animation; Logout unten (rot-Hover) | identisch, Icons via lucide |
| Mobile | fixed Topbar 16 h + Drawer 280 px mit framer-motion `AnimatePresence`, Backdrop `bg-black/60 backdrop-blur` | identisch |
| Typografie | Headings `font-black uppercase tracking-tight`, Labels `text-[10px]/xs font-black uppercase tracking-widest text-zinc-400` | identisch |
| Karten | `bg-white dark:bg-zinc-900 rounded-[2rem]/[2.5rem] border border-zinc-100 dark:border-zinc-800 shadow-sm hover:shadow-xl` | identisch |
| Stat-Karten | Icon-Chip `w-12 h-12 rounded-2xl bg-{color}/10 text-{color}` + `group-hover:scale-110`, Wert `text-3xl font-black` | identisch |
| Dashboard | Kopfzeile mit Titel + Datums-Pill, Stat-Grid (2/3/5 Spalten), Aktivitäten-Karte, Marken-Promokarte mit Deko-Icon | identisch, Inhalte gem. CMS-Dashboard-Spec |
| Login | Fullscreen `bg-zinc-950` mit radialem Markenfarb-Gradient, zentrierte Karte, Icon-Badge `rounded-3xl bg-{brand}/10 border`, Inputs mit Icon links + Focus-Farbwechsel, framer-motion Einblendung | identisch + Felder gem. Auth-Spec (E-Mail, Passwort, Remember, Passwort vergessen) |
| Interaktion | `transition-all duration-300`, `hover:scale-105 active:scale-95` auf Primär-Buttons, `rounded-2xl`-Buttons `font-black text-xs uppercase tracking-widest` | identisch |
| Bausteine | DataTable, ImagePicker/FilePicker (Medien-Dialog), RichTextEditor, Modals je Modul | als Vorlage für `packages/ui`, neu implementiert (shadcn/ui-Basis + dieses Styling) |

## 2. Adaption auf die Projektmarke

Frontend-Tokens der Projekt (`src/app/globals.css`): `--navy #0a1624`, `--deep-blue/charcoal #2a3749`, `--copper #bfa996`, `--background #f5f3ef`, `--warm-gray #e9e3da`; Fonts Geist Sans + Editorial Serif.

Admin-Theme-Mapping (in `cms/apps/admin/app/globals.css` als Tokens, **nicht** hardcodiert — CMS-Core bleibt projektneutral, Theme kommt aus einer Theme-Datei je Projekt):

```css
--admin-brand:        #0a1624;  /* navy — ersetzt brand-teal als Aktiv-/Primärfarbe */
--admin-brand-accent: #bfa996;  /* copper — Akzente, Fokus, Icon-Chips */
--admin-surface:      zinc-Skala wie Götz (neutral, nicht ivory — Admin bleibt Werkzeug)
--admin-danger/success/warning: rot/grün/amber wie Götz-Statusfarben
```

- Aktive Sidebar-Items: Navy-Füllung, Schatten `shadow-navy/20`; Hover-Icons copper.
- Login-Gradient: `from-copper/20 via-zinc-950 to-zinc-950`.
- Logo: Projekt-Logo (`/images/logo.png`-Pendant) statt Götz-Logo, konfigurierbar über Site-Settings (Logo hell/dunkel).
- Statusfarben (Workflow): DRAFT zinc · IN_REVIEW amber · APPROVED blue · PUBLISHED emerald · SCHEDULED violet · ARCHIVED zinc-dunkel — als Badge-Pills im Götz-Stil.

## 3. Seitenstruktur des Admin (Sidebar-Menü)

```text
Dashboard          LayoutDashboard   /
Seiten             FileText          /pages          (+ Editor /pages/:id)
Navigation         ListTree          /navigation
Medien             Image             /media
─ Inhalte ─
Tätigkeitsbereiche Scale             /practice-areas
Expertisen         BadgeCheck        /expertise
Standorte          MapPin            /locations
Team               Users             /team
Kompetenzen        Tags              /competencies
─ Interaktion ─
Formulare          FormInput         /forms
Anfragen           MessageSquare     /forms/submissions
─ System ─
Einstellungen      Settings          /settings
Benutzer & Rollen  Shield            /users
Audit-Log          ScrollText        /audit
```

Menüpunkte werden über Permissions **und** `enabledModules` gefiltert; Gruppentrenner wie oben. Site-Switcher (bei >1 Site) im Sidebar-Kopf unter dem Logo.

## 4. Seiteneditor-Layout

Dreispaltig gem. Spezifikation (Sektionen links, Formular/Vorschau Mitte, Einstellungen rechts), im Götz-Kartenstil: Spalten als `rounded-[2rem]`-Panels auf zinc-50-Grund, Sektionsliste mit dnd-kit-Drag-Handles als Pills (aktiv = Navy wie Sidebar), Header-Leiste mit Breadcrumb, Status-Badge, „Vorschau", „Entwurf speichern", „Veröffentlichen" (Primär-Button im Götz-Stil).

## 5. Technische Umsetzung

- Tailwind 4 + shadcn/ui-Primitives, überstylt mit obigen Tokens; framer-motion für Drawer/Aktiv-Indikator; lucide-react Icons; TanStack Query + React Hook Form + Zod; dnd-kit; TipTap für Rich Text.
- Alle wiederverwendbaren Bausteine (Sidebar-Shell, StatCard, DataTable, StatusBadge, MediaPickerDialog, ConfirmDialog, EmptyState, FormField-Wrapper) in `cms/packages/ui`, damit das Design in Folgeprojekten nur über Theme-Tokens angepasst wird.

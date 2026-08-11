import { getModels } from "./models"

import { AuditService } from "@cms-core/modules/audit/audit.service"
import { CollectionsService } from "@cms-core/modules/collections/collections.service"
import { ContactFieldsService } from "@cms-core/modules/collections/contact-fields.service"
import { TaxonomyService } from "@cms-core/modules/collections/taxonomy.service"
import { FormsService } from "@cms-core/modules/forms/forms.service"
import { MailService } from "@cms-core/modules/forms/mail.service"
import { SubmissionsService } from "@cms-core/modules/forms/submissions.service"
import { MediaService } from "@cms-core/modules/media/media.service"
import { NavigationService } from "@cms-core/modules/navigation/navigation.service"
import { PagesService } from "@cms-core/modules/pages/pages.service"
import { RevisionsService } from "@cms-core/modules/pages/revisions.service"
import { SectionsService } from "@cms-core/modules/pages/sections.service"
import { PublicContentService } from "@cms-core/modules/public-content/public-content.service"
import { SettingsService } from "@cms-core/modules/settings/settings.service"
import { SitesService } from "@cms-core/modules/sites/sites.service"
import { StorageService } from "@cms-core/modules/storage/storage.service"
import { UsersService } from "@cms-core/modules/users/users.service"

/**
 * Ersatz für die NestJS-Dependency-Injection: die Services sind gewöhnliche
 * Klassen, sie werden hier in Abhängigkeitsreihenfolge einmal instanziiert.
 *
 * Der Container hängt an der Verbindung — solange die Lambda-Instanz lebt,
 * bleiben Services und Modelle bestehen. Bei jedem Kaltstart wird neu gebaut.
 */
export interface Container {
  audit: AuditService
  collections: CollectionsService
  contactFields: ContactFieldsService
  forms: FormsService
  media: MediaService
  navigation: NavigationService
  pages: PagesService
  publicContent: PublicContentService
  revisions: RevisionsService
  sections: SectionsService
  settings: SettingsService
  sites: SitesService
  storage: StorageService
  submissions: SubmissionsService
  taxonomy: TaxonomyService
  users: UsersService
}

let cached: Promise<Container> | null = null

async function build(): Promise<Container> {
  const m = await getModels()

  // Ohne eigene Abhängigkeiten
  const storage = new StorageService()
  const mail = new MailService()
  const audit = new AuditService(m.AuditLog)
  const revisions = new RevisionsService(m.ContentRevision)
  const sections = new SectionsService(m.ContentSection)
  const sites = new SitesService(m.Site)
  const settings = new SettingsService(m.Setting)
  const navigation = new NavigationService(m.Navigation, m.NavigationItem)
  const contactFields = new ContactFieldsService(m.ContactField)
  const taxonomy = new TaxonomyService(m.Competency, m.TeamCategory)
  const forms = new FormsService(m.Form, m.FormSubmission)
  const users = new UsersService(m.User, m.Role)

  // Eine Ebene darüber
  const media = new MediaService(m.MediaAsset, m.MediaFolder, storage)
  const collections = new CollectionsService(m.CollectionItem, media, revisions, sections)
  const pages = new PagesService(m.Page, sections, revisions)
  // SubmissionsService typisiert dasselbe Form-Modell als Model<FormDocument>,
  // FormsService als Model<Form>. Zur Laufzeit ist es dasselbe Objekt; die
  // Generics unterscheiden sich nur in der Dokument-Huelle.
  const submissions = new SubmissionsService(
    m.FormSubmission,
    m.Form as unknown as ConstructorParameters<typeof SubmissionsService>[1],
    forms,
    mail,
  )
  const publicContent = new PublicContentService(collections, media)

  return {
    audit, collections, contactFields, forms, media, navigation, pages,
    publicContent, revisions, sections, settings, sites, storage,
    submissions, taxonomy, users,
  }
}

export function getServices(): Promise<Container> {
  cached ??= build().catch((error: unknown) => {
    // Fehlgeschlagenen Aufbau nicht festhalten, sonst bleibt die Instanz kaputt.
    cached = null
    throw error
  })
  return cached
}

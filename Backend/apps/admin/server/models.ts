import type { Connection, Model } from "mongoose"
import { getConnection } from "./db"

import { AuditLog, AuditLogSchema } from "@cms-core/modules/audit/audit-log.schema"
import { Session, SessionSchema } from "@cms-core/modules/auth/session.schema"
import {
  PasswordResetToken,
  PasswordResetTokenSchema,
} from "@cms-core/modules/auth/password-reset-token.schema"
import {
  CollectionItem,
  CollectionItemSchema,
} from "@cms-core/modules/collections/collection-item.schema"
import {
  ContactField,
  ContactFieldSchema,
} from "@cms-core/modules/collections/contact-field.schema"
import {
  Competency,
  CompetencySchema,
  TeamCategory,
  TeamCategorySchema,
} from "@cms-core/modules/collections/taxonomy.schema"
import { Form, FormSchema } from "@cms-core/modules/forms/schemas/form.schema"
import {
  FormSubmission,
  FormSubmissionSchema,
} from "@cms-core/modules/forms/schemas/form-submission.schema"
import { MediaAsset, MediaAssetSchema } from "@cms-core/modules/media/media-asset.schema"
import { MediaFolder, MediaFolderSchema } from "@cms-core/modules/media/media-folder.schema"
import { Navigation, NavigationSchema } from "@cms-core/modules/navigation/navigation.schema"
import {
  NavigationItem,
  NavigationItemSchema,
} from "@cms-core/modules/navigation/navigation-item.schema"
import {
  ContentRevision,
  ContentRevisionSchema,
} from "@cms-core/modules/pages/schemas/content-revision.schema"
import {
  ContentSection,
  ContentSectionSchema,
} from "@cms-core/modules/pages/schemas/content-section.schema"
import { Page, PageSchema } from "@cms-core/modules/pages/schemas/page.schema"
import { Setting, SettingSchema } from "@cms-core/modules/settings/setting.schema"
import { Site, SiteSchema } from "@cms-core/modules/sites/site.schema"
import { Role, RoleSchema } from "@cms-core/modules/users/role.schema"
import { User, UserSchema } from "@cms-core/modules/users/user.schema"

/**
 * Modell-Registry. In der NestJS-App übernahm das `MongooseModule.forFeature`;
 * hier werden die Modelle einmal pro Verbindung registriert.
 *
 * `connection.model(name)` wirft, wenn ein Modell zweimal registriert wird —
 * deshalb der Blick in `connection.models`, denn bei HMR und zwischen
 * Lambda-Aufrufen wird dieses Modul mehrfach ausgewertet.
 */
function register<T>(
  connection: Connection,
  name: string,
  schema: Parameters<Connection["model"]>[1],
): Model<T> {
  return (connection.models[name] ??
    connection.model(name, schema)) as unknown as Model<T>
}

export interface Models {
  AuditLog: Model<AuditLog>
  Session: Model<Session>
  PasswordResetToken: Model<PasswordResetToken>
  CollectionItem: Model<CollectionItem>
  ContactField: Model<ContactField>
  Competency: Model<Competency>
  TeamCategory: Model<TeamCategory>
  Form: Model<Form>
  FormSubmission: Model<FormSubmission>
  MediaAsset: Model<MediaAsset>
  MediaFolder: Model<MediaFolder>
  Navigation: Model<Navigation>
  NavigationItem: Model<NavigationItem>
  ContentRevision: Model<ContentRevision>
  ContentSection: Model<ContentSection>
  Page: Model<Page>
  Setting: Model<Setting>
  Site: Model<Site>
  Role: Model<Role>
  User: Model<User>
}

export async function getModels(): Promise<Models> {
  const c = await getConnection()
  return {
    AuditLog: register(c, AuditLog.name, AuditLogSchema),
    Session: register(c, Session.name, SessionSchema),
    PasswordResetToken: register(c, PasswordResetToken.name, PasswordResetTokenSchema),
    CollectionItem: register(c, CollectionItem.name, CollectionItemSchema),
    ContactField: register(c, ContactField.name, ContactFieldSchema),
    Competency: register(c, Competency.name, CompetencySchema),
    TeamCategory: register(c, TeamCategory.name, TeamCategorySchema),
    Form: register(c, Form.name, FormSchema),
    FormSubmission: register(c, FormSubmission.name, FormSubmissionSchema),
    MediaAsset: register(c, MediaAsset.name, MediaAssetSchema),
    MediaFolder: register(c, MediaFolder.name, MediaFolderSchema),
    Navigation: register(c, Navigation.name, NavigationSchema),
    NavigationItem: register(c, NavigationItem.name, NavigationItemSchema),
    ContentRevision: register(c, ContentRevision.name, ContentRevisionSchema),
    ContentSection: register(c, ContentSection.name, ContentSectionSchema),
    Page: register(c, Page.name, PageSchema),
    Setting: register(c, Setting.name, SettingSchema),
    Site: register(c, Site.name, SiteSchema),
    Role: register(c, Role.name, RoleSchema),
    User: register(c, User.name, UserSchema),
  }
}

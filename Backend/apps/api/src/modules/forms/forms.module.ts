import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuditModule } from "../audit/audit.module";
import { FormsController } from "./forms.controller";
import { FormsService } from "./forms.service";
import { MailService } from "./mail.service";
import { SubmissionsController } from "./submissions.controller";
import { SubmissionsService } from "./submissions.service";
import { SubmissionsCron } from "./submissions.cron";
import { Form, FormSchema } from "./schemas/form.schema";
import {
  FormSubmission,
  FormSubmissionSchema,
} from "./schemas/form-submission.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Form.name, schema: FormSchema },
      { name: FormSubmission.name, schema: FormSubmissionSchema },
    ]),
    AuditModule,
  ],
  providers: [FormsService, SubmissionsService,
    SubmissionsCron, MailService],
  controllers: [FormsController, SubmissionsController],
  exports: [FormsService, SubmissionsService],
})
export class FormsModule {}

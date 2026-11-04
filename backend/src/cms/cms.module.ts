import { Module } from '@nestjs/common';
import { AuditModule } from '../audit/audit.module';
import { AuthModule } from '../auth/auth.module';
import { FilesModule } from '../files/files.module';
import { CmsAdminController } from './cms-admin.controller';
import { CmsAdminService } from './cms-admin.service';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';

@Module({
  imports: [AuthModule, AuditModule, FilesModule],
  controllers: [CmsController, CmsAdminController],
  providers: [CmsService, CmsAdminService],
  exports: [CmsService, CmsAdminService],
})
export class CmsModule {}

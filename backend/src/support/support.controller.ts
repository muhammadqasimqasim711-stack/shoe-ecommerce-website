import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ContactDto } from './dto/contact.dto';
import { SupportService } from './support.service';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post('contact')
  @ApiOperation({ summary: 'Submit a contact / support message' })
  contact(@Body() body: ContactDto) {
    return this.supportService.createContact(body);
  }
}

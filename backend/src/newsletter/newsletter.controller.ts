import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PreferenceDto, SubscribeDto, UnsubscribeDto } from './dto/subscribe.dto';
import { NewsletterService } from './newsletter.service';

@ApiTags('Newsletter')
@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiOperation({ summary: 'Subscribe an email to the newsletter' })
  subscribe(@Body() body: SubscribeDto) {
    return this.newsletterService.subscribe(body.email, body.preference);
  }

  @Post('preference')
  @ApiOperation({ summary: 'Update newsletter preference for an email' })
  updatePreference(@Body() body: PreferenceDto) {
    return this.newsletterService.updatePreference(body.email, body.preference);
  }

  @Post('unsubscribe')
  @ApiOperation({ summary: 'Unsubscribe an email from the newsletter' })
  unsubscribe(@Body() body: UnsubscribeDto) {
    return this.newsletterService.unsubscribe(body.email);
  }

  @Get('status')
  @ApiOperation({ summary: 'Get newsletter status for an email' })
  getStatus(@Query('email') email: string) {
    return this.newsletterService.getStatus(email || '');
  }
}


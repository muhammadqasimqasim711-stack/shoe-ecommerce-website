import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateReviewDto, ReviewsQueryDto } from './dto/review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('Reviews')
@Controller()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('reviews')
  @ApiOperation({ summary: 'List approved reviews (optional productId filter)' })
  findAll(@Query() query: ReviewsQueryDto) {
    return this.reviewsService.findAll({
      productId: query.productId,
      limit: query.limit,
    });
  }

  @Post('products/:productId/reviews')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Create a review for a product (auto-approved)' })
  create(
    @Req() req: { user: { sub: string } },
    @Param('productId') productId: string,
    @Body() body: CreateReviewDto,
  ) {
    return this.reviewsService.create(req.user.sub, productId, body);
  }
}

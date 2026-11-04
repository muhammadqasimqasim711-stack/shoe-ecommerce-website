import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto/address.dto';

@ApiTags('Addresses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Get()
  @ApiOperation({ summary: 'List my addresses' })
  findAll(@Req() req: { user: { sub: string } }) {
    return this.addressesService.findAll(req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Create address' })
  create(@Req() req: { user: { sub: string } }, @Body() body: CreateAddressDto) {
    return this.addressesService.create(req.user.sub, body);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update address' })
  update(
    @Req() req: { user: { sub: string } },
    @Param('id') id: string,
    @Body() body: UpdateAddressDto,
  ) {
    return this.addressesService.update(req.user.sub, id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete address' })
  remove(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.addressesService.remove(req.user.sub, id);
  }

  @Post(':id/default')
  @ApiOperation({ summary: 'Set default address' })
  setDefault(@Req() req: { user: { sub: string } }, @Param('id') id: string) {
    return this.addressesService.setDefault(req.user.sub, id);
  }
}

import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Headers,
  UnauthorizedException,
  Patch,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ItemsUseCases } from 'src/applications/usecases/items.usecases';
import { CreateItemDto } from 'src/domain/dto/create-item.dto';
import { UpdatePhoneDto } from 'src/domain/dto/update-phone.dto';
import { ItemStatus } from 'src/infrastructure/database/schemas/item.entity';

@Controller('items')
export class ItemController {
  constructor(
    private readonly itemsUseCases: ItemsUseCases,
    private readonly jwtService: JwtService,
  ) {}

  private getUserId(authHeader: string): string {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');
    try {
      const payload = this.jwtService.verify(token);
      return payload.sub;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post()
  create(@Headers('authorization') auth: string, @Body() dto: CreateItemDto) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.create(userId, dto);
  }

  @Get()
  findAll(@Headers('authorization') auth: string) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.findAll(userId);
  }

  @Get('trash')
  findTrash(@Headers('authorization') auth: string) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.findTrash(userId);
  }

  @Get(':id')
  findOne(@Headers('authorization') auth: string, @Param('id') itemId: string) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.findOne(userId, itemId);
  }

  @Patch(':id/status')
  updateStatus(
    @Headers('authorization') auth: string,
    @Param('id') itemId: string,
    @Body('status') status: ItemStatus,
  ) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.updateStatus(userId, itemId, status);
  }

  @Patch(':id/restore')
  restore(@Headers('authorization') auth: string, @Param('id') itemId: string) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.restoreFromTrash(userId, itemId);
  }

  @Patch('notifications/toggle')
  toggleNotifications(
    @Headers('authorization') auth: string,
    @Body('enabled') enabled: boolean,
  ) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.toggleNotifications(userId, enabled);
  }

  @Patch('push-token')
  updatePushToken(
    @Headers('authorization') auth: string,
    @Body('token') token: string,
  ) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.updatePushToken(userId, token);
  }

  @Delete(':id')
  delete(@Headers('authorization') auth: string, @Param('id') itemId: string) {
    const userId = this.getUserId(auth);
    return this.itemsUseCases.delete(userId, itemId);
  }
}

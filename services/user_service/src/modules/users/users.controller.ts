import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { InternalServiceGuard } from '../../common/guards/internal-service.guard';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { BootstrapUserProfileDto } from './dto/bootstrap-user-profile.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UpsertInstructorProfileDto } from './dto/upsert-instructor-profile.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('me/bootstrap')
  @ApiOperation({ summary: 'Create or sync my initial profile' })
  bootstrapMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: BootstrapUserProfileDto,
  ) {
    return this.usersService.bootstrapMyProfile(user, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get my profile' })
  getMyProfile(@CurrentUser() user: JwtPayload) {
    return this.usersService.getMyProfile(user.sub);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @ApiOperation({ summary: 'Update my profile' })
  updateMyProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateMyProfileDto,
  ) {
    return this.usersService.updateMyProfile(user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me/preferences')
  @ApiOperation({ summary: 'Create or update my learning preferences' })
  updateMyPreferences(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserPreferencesDto,
  ) {
    return this.usersService.updateMyPreferences(user.sub, dto);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put('me/instructor')
  @ApiOperation({ summary: 'Create or update my instructor profile' })
  upsertInstructorProfile(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpsertInstructorProfileDto,
  ) {
    return this.usersService.upsertInstructorProfile(user, dto);
  }

  @Public()
  @Get('public/:id')
  @ApiOperation({ summary: 'Get public profile by user id' })
  getPublicProfile(@Param('id') id: string) {
    return this.usersService.getPublicProfile(id);
  }

  @Public()
  @Get('instructors/:id')
  @ApiOperation({ summary: 'Get public instructor profile by user id' })
  getPublicInstructorProfile(@Param('id') id: string) {
    return this.usersService.getPublicInstructorProfile(id);
  }

  @Public()
  @UseGuards(InternalServiceGuard)
  @Post('internal/create-from-auth')
  @ApiOperation({
    summary:
      'Internal endpoint for auth-service to create user profile after register',
  })
  createProfileFromAuth(
    @Body() body: { id: string; email: string; fullName: string },
  ) {
    return this.usersService.createProfileFromAuthEvent(body);
  }
}

import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthContext } from '../../common/interfaces/auth-context.interface';
import { ProxyRegistryService } from './proxy-registry.service';

@ApiTags('Gateway')
@Controller('gateway')
export class GatewayController {
  constructor(private readonly proxyRegistryService: ProxyRegistryService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Inspect the authenticated user as seen by the gateway' })
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: AuthContext): { success: true; data: AuthContext } {
    return {
      success: true,
      data: user,
    };
  }

  @Get('routes')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List enabled upstream routes configured in the gateway' })
  @Roles('admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  getRoutes() {
    return {
      success: true,
      data: this.proxyRegistryService.getEnabledServices().map((service) => ({
        name: service.name,
        target: service.target,
        routePrefix: `/${service.routePrefix}`,
      })),
    };
  }
}

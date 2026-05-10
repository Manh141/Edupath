import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAccessGuard } from '../../common/guards/jwt-access.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { CurrentUserData } from '../../common/interfaces/current-user.interface';
import { ROLE_HIERARCHY, ROLES } from '../../common/constants/role.constants';
import { PrismaService } from '../../common/prisma/prisma.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAccessGuard, RolesGuard)
@Controller('auth/admin')
export class AdminController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('profile')
  @Roles(ROLES.ADMIN)
  @ApiOperation({ summary: 'Sample admin-protected endpoint' })
  getAdminProfile(@CurrentUser() currentUser: CurrentUserData) {
    return {
      message: 'Admin route is protected by JWT and role guards.',
      user: currentUser,
    };
  }

  @Get('rbac')
  @Roles(ROLES.ADMIN)
  @ApiOperation({
    summary: 'Get RBAC roles and permission matrix for admin UI',
  })
  async getRbac() {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });

    const roleCards = await Promise.all(
      roles.map(async (role) => {
        const members = await this.prisma.authAccount.count({
          where: {
            OR: [
              { roleId: role.id },
              {
                accountRoles: {
                  some: {
                    roleId: role.id,
                  },
                },
              },
            ],
          },
        });

        return {
          role: role.name,
          description: role.description ?? '',
          members,
          inherits: ROLE_HIERARCHY[
            role.name as keyof typeof ROLE_HIERARCHY
          ] ?? [role.name],
        };
      }),
    );

    const permissionMatrix = [
      {
        module: 'Users',
        admin: true,
        instructor: false,
        student: false,
      },
      {
        module: 'Courses',
        admin: true,
        instructor: true,
        student: false,
      },
      {
        module: 'Orders',
        admin: true,
        instructor: false,
        student: true,
      },
      {
        module: 'Reviews',
        admin: true,
        instructor: true,
        student: true,
      },
      {
        module: 'Reports',
        admin: true,
        instructor: false,
        student: false,
      },
      {
        module: 'RBAC',
        admin: true,
        instructor: false,
        student: false,
      },
    ];

    return {
      roles: roleCards,
      permissionMatrix,
      generatedAt: new Date().toISOString(),
    };
  }
}

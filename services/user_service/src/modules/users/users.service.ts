import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '../../common/prisma/prisma-client';
import { JwtPayload } from '../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AccountRoleSummary, AuthClient } from '../external/auth.client';
import { BootstrapUserProfileDto } from './dto/bootstrap-user-profile.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { UpdateMyProfileDto } from './dto/update-my-profile.dto';
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';
import { UpdateUserStatusDto } from './dto/update-user-status.dto';
import { UpsertInstructorProfileDto } from './dto/upsert-instructor-profile.dto';

const userProfileInclude = {
  instructorProfile: true,
  preferences: true,
} satisfies Prisma.UserProfileInclude;

type UserProfileWithRelations = Prisma.UserProfileGetPayload<{
  include: typeof userProfileInclude;
}>;

export type AdminUserView = UserProfileWithRelations & {
  roles: string[];
  role: string;
  isEmailVerified: boolean;
  lastLoginAt: string | null;
  authStatus: string | null;
};

type PaginatedUsersResponse = {
  items: AdminUserView[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authClient: AuthClient,
  ) {}

  private toAdminUserView(
    profile: UserProfileWithRelations,
    summary?: AccountRoleSummary,
  ): AdminUserView {
    const roles =
      summary?.roles && summary.roles.length > 0
        ? summary.roles
        : profile.isInstructor
          ? ['instructor', 'student']
          : ['student'];
    const role = summary?.primaryRole ?? roles[0] ?? 'student';

    return {
      ...profile,
      roles,
      role,
      isEmailVerified: summary?.isEmailVerified ?? false,
      lastLoginAt: summary?.lastLoginAt ?? null,
      authStatus: summary?.authStatus ?? null,
    };
  }

  private async enrichManyWithRoles(
    profiles: UserProfileWithRelations[],
  ): Promise<AdminUserView[]> {
    if (profiles.length === 0) {
      return [];
    }
    const summaries = await this.authClient.getRolesByUserIds(
      profiles.map((profile) => profile.id),
    );
    return profiles.map((profile) =>
      this.toAdminUserView(profile, summaries.get(profile.id)),
    );
  }

  private async enrichOneWithRoles(
    profile: UserProfileWithRelations,
  ): Promise<AdminUserView> {
    const summaries = await this.authClient.getRolesByUserIds([profile.id]);
    return this.toAdminUserView(profile, summaries.get(profile.id));
  }

  private getMonthStart(offset = 0): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + offset, 1);
  }

  private getRollingMonthStarts(months: number): Date[] {
    const currentMonthStart = this.getMonthStart();

    return Array.from({ length: months }, (_, index) => {
      const monthsAgo = months - index - 1;
      return new Date(
        currentMonthStart.getFullYear(),
        currentMonthStart.getMonth() - monthsAgo,
        1,
      );
    });
  }

  private formatMonthLabel(date: Date): string {
    return date.toLocaleString('en-US', {
      month: 'short',
      year: '2-digit',
      timeZone: 'UTC',
    });
  }

  private calculateDeltaPercent(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }

    return Number((((current - previous) / previous) * 100).toFixed(1));
  }

  async bootstrapMyProfile(
    user: JwtPayload,
    dto: BootstrapUserProfileDto,
  ): Promise<UserProfileWithRelations> {
    return this.prisma.userProfile.upsert({
      where: { id: user.sub },
      update: {
        email: user.email,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl,
        headline: dto.headline,
        bio: dto.bio,
        phone: dto.phone,
        country: dto.country,
        language: dto.language,
      },
      create: {
        id: user.sub,
        email: user.email,
        fullName: dto.fullName,
        avatarUrl: dto.avatarUrl ?? '',
        headline: dto.headline ?? '',
        bio: dto.bio ?? '',
        phone: dto.phone ?? '',
        country: dto.country ?? '',
        language: dto.language ?? 'vi',
      },
      include: userProfileInclude,
    });
  }

  async getMyProfile(userId: string): Promise<UserProfileWithRelations> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      include: userProfileInclude,
    });

    if (!profile) {
      throw new NotFoundException(
        'User profile not found. Please bootstrap profile first.',
      );
    }

    return profile;
  }

  async updateMyProfile(
    userId: string,
    dto: UpdateMyProfileDto,
  ): Promise<UserProfileWithRelations> {
    await this.ensureUserProfileExists(userId);

    const fullName =
      (dto.fullName ??
        [dto.firstName?.trim(), dto.lastName?.trim()]
          .filter(Boolean)
          .join(' ')) ||
      undefined;
    const phone = dto.phone ?? dto.phoneNumber;

    return this.prisma.userProfile.update({
      where: { id: userId },
      data: {
        fullName,
        avatarUrl: dto.avatarUrl,
        headline: dto.headline,
        bio: dto.bio,
        phone,
        country: dto.country,
        language: dto.language,
      },
      include: userProfileInclude,
    });
  }

  async updateMyPreferences(
    userId: string,
    dto: UpdateUserPreferencesDto,
  ): Promise<UserProfileWithRelations> {
    await this.ensureUserProfileExists(userId);

    const learningGoals =
      dto.learningGoals ??
      (dto.learningGoal?.trim()
        ? [dto.learningGoal.trim()]
        : dto.learningGoal !== undefined
          ? []
          : undefined);

    return this.prisma.userProfile.update({
      where: { id: userId },
      data: {
        preferences: {
          upsert: {
            create: {
              favoriteCategories: dto.favoriteCategories ?? [],
              learningGoals: learningGoals ?? [],
              preferredLanguage: dto.preferredLanguage ?? 'vi',
            },
            update: {
              favoriteCategories: dto.favoriteCategories,
              learningGoals,
              preferredLanguage: dto.preferredLanguage,
            },
          },
        },
      },
      include: userProfileInclude,
    });
  }

  async upsertInstructorProfile(
    user: JwtPayload,
    dto: UpsertInstructorProfileDto,
  ): Promise<UserProfileWithRelations> {
    const instructorProfileData = {
      displayName: dto.displayName,
      title: dto.title ?? '',
      about: dto.about ?? '',
      websiteUrl: dto.websiteUrl ?? '',
      twitterUrl: dto.twitterUrl ?? '',
      linkedinUrl: dto.linkedinUrl ?? '',
      youtubeUrl: dto.youtubeUrl ?? '',
    };

    return this.prisma.userProfile.upsert({
      where: { id: user.sub },
      create: {
        id: user.sub,
        email: user.email,
        fullName: dto.displayName,
        isInstructor: true,
        instructorProfile: {
          create: instructorProfileData,
        },
      },
      update: {
        email: user.email,
        isInstructor: true,
        instructorProfile: {
          upsert: {
            create: instructorProfileData,
            update: {
              displayName: dto.displayName,
              title: dto.title,
              about: dto.about,
              websiteUrl: dto.websiteUrl,
              twitterUrl: dto.twitterUrl,
              linkedinUrl: dto.linkedinUrl,
              youtubeUrl: dto.youtubeUrl,
            },
          },
        },
      },
      include: userProfileInclude,
    });
  }

  async findInternalById(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        headline: true,
        isInstructor: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return {
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      displayName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      role: profile.isInstructor ? 'instructor' : 'student',
    };
  }

  async findInternalManyByIds(userIds: string[]) {
    if (!Array.isArray(userIds) || userIds.length === 0) {
      return [];
    }
    const records = await this.prisma.userProfile.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        email: true,
        fullName: true,
        avatarUrl: true,
        isInstructor: true,
      },
    });

    return records.map((profile) => ({
      id: profile.id,
      email: profile.email,
      fullName: profile.fullName,
      displayName: profile.fullName,
      avatarUrl: profile.avatarUrl,
      role: profile.isInstructor ? 'instructor' : 'student',
    }));
  }

  async getPublicProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        headline: true,
        bio: true,
        country: true,
        language: true,
        isInstructor: true,
        createdAt: true,
      },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async getPublicInstructorProfile(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        avatarUrl: true,
        headline: true,
        bio: true,
        country: true,
        language: true,
        instructorProfile: true,
      },
    });

    if (!profile || !profile.instructorProfile) {
      throw new NotFoundException('Instructor profile not found');
    }

    return profile;
  }

  async listUsers(query: QueryUsersDto): Promise<PaginatedUsersResponse> {
    const page = query.page;
    const limit = query.limit;
    const skip = (page - 1) * limit;
    const where = this.buildUserWhere(query);
    const orderBy = this.buildUserOrderBy(query);

    const [total, items] = await this.prisma.$transaction([
      this.prisma.userProfile.count({ where }),
      this.prisma.userProfile.findMany({
        where,
        include: userProfileInclude,
        orderBy,
        skip,
        take: limit,
      }),
    ]);

    const enriched = await this.enrichManyWithRoles(items);

    return {
      items: enriched,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAdminUserStats() {
    const currentMonthStart = this.getMonthStart();
    const previousMonthStart = this.getMonthStart(-1);
    const nextMonthStart = this.getMonthStart(1);
    const monthStarts = this.getRollingMonthStarts(12);
    const firstSeriesMonth = monthStarts[0] ?? currentMonthStart;

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      bannedUsers,
      instructors,
      newUsersThisMonth,
      newUsersPreviousMonth,
      monthlyUsers,
    ] = await this.prisma.$transaction([
      this.prisma.userProfile.count(),
      this.prisma.userProfile.count({ where: { status: 'active' } }),
      this.prisma.userProfile.count({ where: { status: 'inactive' } }),
      this.prisma.userProfile.count({ where: { status: 'banned' } }),
      this.prisma.userProfile.count({ where: { isInstructor: true } }),
      this.prisma.userProfile.count({
        where: {
          createdAt: {
            gte: currentMonthStart,
            lt: nextMonthStart,
          },
        },
      }),
      this.prisma.userProfile.count({
        where: {
          createdAt: {
            gte: previousMonthStart,
            lt: currentMonthStart,
          },
        },
      }),
      this.prisma.userProfile.findMany({
        where: {
          createdAt: {
            gte: firstSeriesMonth,
          },
        },
        select: {
          createdAt: true,
        },
      }),
    ]);

    const monthlyNewUsers = monthStarts.map((start) => {
      const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);
      const value = monthlyUsers.filter(
        (user) => user.createdAt >= start && user.createdAt < end,
      ).length;

      return {
        month: start.toISOString().slice(0, 7),
        label: this.formatMonthLabel(start),
        value,
      };
    });

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      bannedUsers,
      instructors,
      students: Math.max(totalUsers - instructors, 0),
      newUsersThisMonth,
      newUsersPreviousMonth,
      newUsersDeltaPercent: this.calculateDeltaPercent(
        newUsersThisMonth,
        newUsersPreviousMonth,
      ),
      monthlyNewUsers,
      statusBreakdown: [
        { status: 'active', value: activeUsers },
        { status: 'inactive', value: inactiveUsers },
        { status: 'banned', value: bannedUsers },
      ],
      roleBreakdown: [
        { role: 'Student', members: Math.max(totalUsers - instructors, 0) },
        { role: 'Instructor', members: instructors },
      ],
    };
  }

  async getUserByIdForAdmin(userId: string): Promise<AdminUserView> {
    const profile = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      include: userProfileInclude,
    });

    if (!profile) {
      throw new NotFoundException('User not found');
    }

    return this.enrichOneWithRoles(profile);
  }

  async updateUserStatus(
    userId: string,
    dto: UpdateUserStatusDto,
  ): Promise<UserProfileWithRelations> {
    await this.ensureUserProfileExists(userId);

    return this.prisma.userProfile.update({
      where: { id: userId },
      data: {
        status: dto.status,
      },
      include: userProfileInclude,
    });
  }

  async createProfileFromAuthEvent(input: {
    id: string;
    email: string;
    fullName: string;
  }): Promise<UserProfileWithRelations> {
    const existing = await this.prisma.userProfile.findUnique({
      where: { id: input.id },
      select: { id: true, fullName: true },
    });

    if (existing) {
      const shouldBackfillName =
        !existing.fullName || existing.fullName.trim().length === 0;
      return this.prisma.userProfile.update({
        where: { id: input.id },
        data: {
          email: input.email,
          ...(shouldBackfillName ? { fullName: input.fullName } : {}),
        },
        include: userProfileInclude,
      });
    }

    return this.prisma.userProfile.create({
      data: {
        id: input.id,
        email: input.email,
        fullName: input.fullName,
      },
      include: userProfileInclude,
    });
  }

  private buildUserWhere(query: QueryUsersDto): Prisma.UserProfileWhereInput {
    const where: Prisma.UserProfileWhereInput = {};

    const search = query.search ?? query.searchTerm;

    if (search) {
      where.OR = [
        {
          fullName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          headline: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (query.status) {
      where.status = query.status;
    }

    if (typeof query.isInstructor === 'boolean') {
      where.isInstructor = query.isInstructor;
    }

    return where;
  }

  private buildUserOrderBy(
    query: QueryUsersDto,
  ): Prisma.UserProfileOrderByWithRelationInput {
    switch (query.sortBy) {
      case 'fullName':
        return { fullName: query.order };
      case 'updatedAt':
        return { updatedAt: query.order };
      case 'createdAt':
      default:
        return { createdAt: query.order };
    }
  }

  private async ensureUserProfileExists(userId: string): Promise<void> {
    const exists = await this.prisma.userProfile.findUnique({
      where: { id: userId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException(
        'User profile not found. Please bootstrap profile first.',
      );
    }
  }
}

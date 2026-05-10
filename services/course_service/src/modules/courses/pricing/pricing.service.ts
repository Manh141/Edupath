import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CoursePricingTier,
  CourseStatusActorType,
  Prisma,
} from '../../../common/prisma/prisma-client';
import { ROLES } from '../../../common/constants/roles.constant';
import type { JwtPayload } from '../../../common/interfaces/jwt-payload.interface';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { CourseStateMachine } from '../moderation/course-state-machine';
import { CourseStatusHistoryService } from '../moderation/course-status-history.service';
import { UpdateCoursePricingDto } from './dto/update-course-pricing.dto';
import { PricingEligibility, PricingEligibilityClient } from './pricing.eligibility.client';

type CourseWithInstructors = Prisma.CourseGetPayload<{
  include: { instructors: true };
}>;

@Injectable()
export class PricingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eligibility: PricingEligibilityClient,
    private readonly statusHistory: CourseStatusHistoryService,
  ) {}

  async getPricingPage(courseId: string, user: JwtPayload) {
    const course = await this.loadOwned(courseId, user);
    const pricing = await this.prisma.coursePricing.findUnique({
      where: { courseId },
    });
    const elig = await this.eligibility.getForInstructor(user.sub);

    const editingLocked = !CourseStateMachine.isHeavyEditable(course.status);

    const effectivePricing = pricing ?? {
      id: null,
      courseId,
      tier: CoursePricingTier.free,
      price: course.price ?? 0,
      compareAtPrice: course.compareAtPrice ?? null,
      currency: course.currency ?? 'VND',
      eligibilityCheckedAt: null,
      eligibilitySnapshot: null,
      updatedBy: null,
    };

    return {
      courseId: course.id,
      currentStatus: course.status,
      pricing: effectivePricing,
      eligibility: elig,
      editingLocked,
      canSetPrice: elig.canSellPaid && !editingLocked,
      canSetPaidPrice: elig.canSellPaid && !editingLocked,
    };
  }

  async upsertPricing(courseId: string, user: JwtPayload, dto: UpdateCoursePricingDto) {
    const course = await this.loadOwned(courseId, user);
    CourseStateMachine.assertCanPerform('edit', course.status);

    if (dto.tier === CoursePricingTier.free && dto.price !== 0) {
      throw new BadRequestException('Free tier must have price=0.');
    }
    if (dto.tier !== CoursePricingTier.free && dto.price <= 0) {
      throw new BadRequestException('Paid tier requires a positive price.');
    }
    if (typeof dto.compareAtPrice === 'number' && dto.compareAtPrice < dto.price) {
      throw new BadRequestException('compareAtPrice must be greater than or equal to price.');
    }

    const elig = await this.eligibility.getForInstructor(user.sub);
    if (!elig.resolved) {
      throw new BadRequestException({
        code: 'SELLER_ONBOARDING_UNAVAILABLE',
        message: 'Cannot verify pre-instructor registration right now.',
        onboardingUrl: elig.onboardingUrl,
        reasons: elig.reasons,
      });
    }
    if (!elig.canSellPaid) {
      throw new BadRequestException({
        code: 'INSTRUCTOR_ONBOARDING_REQUIRED',
        message: 'Complete pre-instructor registration before setting course pricing.',
        onboardingUrl: elig.onboardingUrl,
        reasons: elig.reasons,
      });
    }
    const eligibilitySnapshot = this.toJson(elig);

    const nextStatus = CourseStateMachine.resolveNextOnEdit(course.status);
    const fromStatus = course.status;

    return this.prisma.$transaction(async (tx) => {
      const pricing = await tx.coursePricing.upsert({
        where: { courseId },
        create: {
          courseId,
          tier: dto.tier,
          price: dto.price,
          compareAtPrice: dto.compareAtPrice ?? null,
          currency: dto.currency,
          eligibilityCheckedAt: new Date(),
          eligibilitySnapshot,
          updatedBy: user.sub,
        },
        update: {
          tier: dto.tier,
          price: dto.price,
          compareAtPrice: dto.compareAtPrice ?? null,
          currency: dto.currency,
          eligibilityCheckedAt: new Date(),
          eligibilitySnapshot,
          updatedBy: user.sub,
        },
      });

      await tx.course.update({
        where: { id: courseId },
        data: {
          price: dto.price,
          compareAtPrice: dto.compareAtPrice ?? null,
          currency: dto.currency,
          updatedBy: user.sub,
          status: nextStatus,
        },
      });

      if (nextStatus !== fromStatus) {
        await this.statusHistory.log(tx, {
          courseId,
          fromStatus,
          toStatus: nextStatus,
          actorType: CourseStatusActorType.instructor,
          actorId: user.sub,
          reason: 'Pricing updated',
        });
      }

      return pricing;
    });
  }

  private toJson(value: PricingEligibility): Prisma.InputJsonValue {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  }

  private async loadOwned(id: string, user: JwtPayload): Promise<CourseWithInstructors> {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { instructors: true },
    });
    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }
    if (this.hasRole(user, ROLES.ADMIN)) {
      return course;
    }
    const isOwner = course.instructors.some((i) => i.instructorId === user.sub);
    if (!isOwner) {
      throw new ForbiddenException('You can only manage your own courses.');
    }
    return course;
  }

  private hasRole(user: JwtPayload, role: string): boolean {
    const set = new Set([...(user.roles ?? []), ...(user.role ? [user.role] : [])]);
    return set.has(role);
  }
}

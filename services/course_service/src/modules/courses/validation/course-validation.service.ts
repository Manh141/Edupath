import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../common/prisma/prisma.service';
import type {
  ChecklistGroup,
  ChecklistGroupSummary,
  ChecklistIssue,
  ChecklistItem,
  CourseValidationReport,
} from './checklist.types';
import { basicInfoRule } from './rules/basic-info.rule';
import { curriculumRule } from './rules/curriculum.rule';
import { intendedLearnersRule } from './rules/intended-learners.rule';
import { mediaRule, ownershipRule } from './rules/media.rule';
import { pricingRule } from './rules/pricing.rule';
import type { CourseValidationInput, LectureLite, SectionLite } from './rules/types';
import { PricingEligibilityClient } from '../pricing/pricing.eligibility.client';

const RULES = [
  basicInfoRule,
  intendedLearnersRule,
  curriculumRule,
  mediaRule,
  pricingRule,
  ownershipRule,
];

const ALL_GROUPS: ChecklistGroup[] = [
  'basicInfo',
  'intendedLearners',
  'curriculum',
  'media',
  'pricing',
  'ownership',
];

@Injectable()
export class CourseValidationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly eligibility: PricingEligibilityClient,
  ) {}

  async loadCourseInput(courseId: string): Promise<CourseValidationInput> {
    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
      include: {
        subcategory: { include: { category: true } },
        instructors: true,
        objectives: { select: { id: true } },
        requirements: { select: { id: true } },
        targetAudiences: { select: { id: true } },
        pricingConfig: true,
        sections: {
          orderBy: { order: 'asc' },
          include: {
            lectures: {
              orderBy: { order: 'asc' },
              include: { assets: { where: { deletedAt: null }, select: { id: true } } },
            },
          },
        },
      },
    });

    if (!course || course.deletedAt) {
      throw new NotFoundException('Course not found.');
    }

    const primaryInstructor = course.instructors.find((i) => i.isPrimary);
    const sellerEligibility = primaryInstructor
      ? await this.eligibility.getForInstructor(primaryInstructor.instructorId)
      : null;

    const sections: SectionLite[] = course.sections.map((s) => ({
      id: s.id,
      title: s.title,
      order: s.order,
      lectures: s.lectures.map<LectureLite>((l) => ({
        id: l.id,
        type: l.type as LectureLite['type'],
        title: l.title,
        videoUrl: l.videoUrl,
        articleContent: l.articleContent,
        durationSec: l.durationSec,
        order: l.order,
        assets: l.assets,
      })),
    }));

    return {
      id: course.id,
      title: course.title,
      subtitle: course.subtitle,
      shortDescription: course.shortDescription,
      description: course.description,
      language: course.language,
      level: course.level,
      thumbnailUrl: course.thumbnailUrl,
      trailerUrl: course.trailerUrl,
      subcategoryId: course.subcategoryId,
      categoryId: course.subcategory?.categoryId ?? null,
      objectivesCount: course.objectives.length,
      requirementsCount: course.requirements.length,
      targetAudiencesCount: course.targetAudiences.length,
      primaryInstructorId: primaryInstructor?.instructorId ?? null,
      pricing: course.pricingConfig
        ? {
            tier: course.pricingConfig.tier,
            price: course.pricingConfig.price,
            currency: course.pricingConfig.currency,
          }
        : null,
      sellerEligibility: sellerEligibility
        ? {
            resolved: sellerEligibility.resolved,
            canSellPaid: sellerEligibility.canSellPaid,
            reasons: sellerEligibility.reasons,
            onboardingUrl: sellerEligibility.onboardingUrl,
          }
        : null,
      sections,
    };
  }

  buildReport(input: CourseValidationInput): CourseValidationReport {
    const items: ChecklistItem[] = RULES.flatMap((rule) => rule(input));

    const issues: ChecklistIssue[] = items
      .filter((i) => !i.passed && i.severity === 'error')
      .map((i) => ({
        group: i.group,
        code: i.code,
        message: i.hint ? `${i.label} - ${i.hint}` : i.label,
        severity: 'error',
      }));

    const warnings: ChecklistIssue[] = items
      .filter((i) => !i.passed && i.severity === 'warning')
      .map((i) => ({
        group: i.group,
        code: i.code,
        message: i.hint ? `${i.label} - ${i.hint}` : i.label,
        severity: 'warning',
      }));

    const requiredItems = items.filter((i) => i.severity === 'error');
    const passedRequiredItems = requiredItems.filter((i) => i.passed).length;
    const completionPercent =
      requiredItems.length === 0
        ? 100
        : Math.round((passedRequiredItems / requiredItems.length) * 100);

    const groups: ChecklistGroupSummary[] = ALL_GROUPS.map((group) => {
      const groupRequired = items.filter((i) => i.group === group && i.severity === 'error');
      return {
        group,
        total: groupRequired.length,
        passed: groupRequired.filter((i) => i.passed).length,
      };
    });

    return {
      courseId: input.id,
      canSubmit: issues.length === 0,
      completionPercent,
      totals: {
        requiredItems: requiredItems.length,
        passedRequiredItems,
        errors: issues.length,
        warnings: warnings.length,
      },
      groups,
      items,
      issues,
      warnings,
      generatedAt: new Date().toISOString(),
    };
  }

  async getReport(courseId: string): Promise<CourseValidationReport> {
    const input = await this.loadCourseInput(courseId);
    return this.buildReport(input);
  }
}

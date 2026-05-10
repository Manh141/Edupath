import type { ChecklistItem } from '../checklist.types';
import {
  type CourseValidationInput,
  type LectureLite,
  type SectionLite,
  type ValidationRule,
  MIN_LECTURES,
  MIN_SECTIONS,
  MIN_TOTAL_VIDEO_SEC,
} from './types';

function isLectureValid(lecture: LectureLite): boolean {
  if (!lecture.title.trim()) return false;
  if (lecture.type === 'video') {
    return Boolean(lecture.videoUrl) && lecture.durationSec > 0;
  }
  if (lecture.type === 'article') {
    return lecture.articleContent.trim().length >= 50;
  }
  return lecture.assets.length > 0;
}

function hasContiguousOrders<T extends { order: number }>(items: T[]): boolean {
  if (items.length === 0) return true;
  const orders = items.map((i) => i.order).sort((a, b) => a - b);
  return orders.every((order, idx) => order === idx + 1);
}

function flattenLectures(sections: SectionLite[]): LectureLite[] {
  return sections.flatMap((s) => s.lectures);
}

export const curriculumRule: ValidationRule = (input: CourseValidationInput): ChecklistItem[] => {
  const lectures = flattenLectures(input.sections);
  const totalVideoSec = lectures
    .filter((l) => l.type === 'video')
    .reduce((acc, l) => acc + l.durationSec, 0);
  const invalidLectures = lectures.filter((l) => !isLectureValid(l));
  const sectionsOrdered = hasContiguousOrders(input.sections);
  const lecturesOrderedPerSection = input.sections.every((s) =>
    hasContiguousOrders(s.lectures),
  );

  return [
    {
      group: 'curriculum',
      code: 'CURRICULUM_MIN_SECTIONS',
      label: `At least ${MIN_SECTIONS} section`,
      severity: 'error',
      passed: input.sections.length >= MIN_SECTIONS,
    },
    {
      group: 'curriculum',
      code: 'CURRICULUM_MIN_LECTURES',
      label: `At least ${MIN_LECTURES} lectures across the course`,
      severity: 'error',
      passed: lectures.length >= MIN_LECTURES,
      hint: `Current: ${lectures.length}`,
    },
    {
      group: 'curriculum',
      code: 'CURRICULUM_LECTURES_VALID',
      label: 'Every lecture has valid content',
      severity: 'error',
      passed: invalidLectures.length === 0,
      hint:
        invalidLectures.length === 0
          ? undefined
          : `${invalidLectures.length} lecture(s) need content`,
    },
    {
      group: 'curriculum',
      code: 'CURRICULUM_VIDEO_DURATION',
      label: `Total video duration at least ${Math.round(MIN_TOTAL_VIDEO_SEC / 60)} minutes`,
      severity: 'error',
      passed: totalVideoSec >= MIN_TOTAL_VIDEO_SEC,
      hint: `Current: ${Math.round(totalVideoSec / 60)} min`,
    },
    {
      group: 'curriculum',
      code: 'CURRICULUM_ORDER',
      label: 'Section and lecture order is contiguous',
      severity: 'error',
      passed: sectionsOrdered && lecturesOrderedPerSection,
    },
  ];
};

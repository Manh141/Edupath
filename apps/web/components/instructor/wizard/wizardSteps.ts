import {
  ClipboardCheck,
  FileText,
  Image as ImageIcon,
  ListChecks,
  ListVideo,
  Wallet,
  Send,
  type LucideIcon,
} from "lucide-react";

export type WizardStepId =
  | "basic"
  | "learners"
  | "curriculum"
  | "media"
  | "pricing"
  | "review"
  | "submit";

export interface WizardStepDefinition {
  id: WizardStepId;
  label: string;
  description: string;
  icon: LucideIcon;
}

export const WIZARD_STEPS: WizardStepDefinition[] = [
  {
    id: "basic",
    label: "Basic info",
    description: "Title, category, language, level, descriptions.",
    icon: FileText,
  },
  {
    id: "learners",
    label: "Intended learners",
    description: "Objectives, requirements, target audience.",
    icon: ListChecks,
  },
  {
    id: "curriculum",
    label: "Curriculum",
    description: "Sections and lectures.",
    icon: ListVideo,
  },
  {
    id: "media",
    label: "Media",
    description: "Thumbnail and promotional video.",
    icon: ImageIcon,
  },
  {
    id: "pricing",
    label: "Pricing",
    description: "Pre-instructor onboarding and course price.",
    icon: Wallet,
  },
  {
    id: "review",
    label: "Review checklist",
    description: "Validate course readiness.",
    icon: ClipboardCheck,
  },
  {
    id: "submit",
    label: "Submit for review",
    description: "Send to admin for moderation.",
    icon: Send,
  },
];

export function isValidStep(
  value: string | null | undefined,
): value is WizardStepId {
  return WIZARD_STEPS.some((s) => s.id === value);
}

export function getDefaultStep(): WizardStepId {
  return WIZARD_STEPS[0].id;
}

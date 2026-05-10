import LearningPage from "@/components/pages/LearningPage";

export const metadata = { title: "Learning — EduPath" };

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <LearningPage courseId={courseId} />;
}

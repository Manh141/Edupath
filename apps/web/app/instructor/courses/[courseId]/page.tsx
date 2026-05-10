import InstructorCourseEditorPage from "@/components/pages/InstructorCourseEditorPage";

export const metadata = { title: "Edit Course - EduPath" };

export default async function Page({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = await params;

  return <InstructorCourseEditorPage courseId={courseId} />;
}

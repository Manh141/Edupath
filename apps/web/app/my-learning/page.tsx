import { Suspense } from "react";
import MyLearningPage from "@/components/pages/MyLearningPage";

export const metadata = { title: "My Learning — EduPath" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MyLearningPage />
    </Suspense>
  );
}

import { Suspense } from "react";
import MessagesPage from "@/components/pages/MessagesPage";

export const metadata = { title: "Messages · EduPath" };

export default function Page() {
  return (
    <Suspense fallback={null}>
      <MessagesPage />
    </Suspense>
  );
}

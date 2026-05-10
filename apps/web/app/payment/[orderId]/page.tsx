import PaymentPage from "@/components/pages/PaymentPage";

export const metadata = { title: "Complete payment — EduPath" };

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  return <PaymentPage orderId={orderId} />;
}

import OrderDetailPage from "@/components/pages/OrderDetailPage";

export const metadata = { title: "Order Details — EduPath" };

export default async function Page({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  return <OrderDetailPage orderId={orderId} />;
}

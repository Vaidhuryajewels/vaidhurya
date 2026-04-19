import { OrderDetailPageClient } from "@/components/order-detail-page-client";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return <OrderDetailPageClient orderNumber={orderNumber} />;
}

import { OrderDetailPageClient } from "@/components/order-detail-page-client";

export default async function CheckoutConfirmationPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;

  return <OrderDetailPageClient orderNumber={orderNumber} />;
}

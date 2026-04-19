import { SiteShell } from "@/components/site-shell";
import { sampleOrders } from "@/lib/commerce-data";

export default function AdminShipmentsPage() {
  const shipments = sampleOrders.flatMap((order) =>
    order.shipments.map((shipment) => ({
      orderNumber: order.orderNumber,
      customerName: order.customerName,
      ...shipment,
    })),
  );

  return (
    <SiteShell
      theme="bridal"
      pageEyebrow="Admin • Shipments"
      pageTitle="Shipment control and tracking sync"
      pageIntro="Split-package fulfillment is a first-class part of the operations model, so shipments are managed independently from the order header."
    >
      <section className="content-shell stack-lg">
        <div className="admin-table">
          <div className="admin-table-row admin-table-row-head">
            <strong>Shipment</strong>
            <strong>Order</strong>
            <strong>Carrier</strong>
            <strong>Status</strong>
          </div>
          {shipments.map((shipment) => (
            <div className="admin-table-row" key={shipment.id}>
              <span>{shipment.label}</span>
              <span>
                {shipment.orderNumber} • {shipment.customerName}
              </span>
              <span>{shipment.carrier}</span>
              <span>{shipment.status}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

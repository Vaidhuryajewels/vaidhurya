import { NextResponse } from "next/server.js";
import { adminModules, integrationHealth } from "../../../../lib/commerce-data.ts";
import { getOperationsSnapshot } from "../../../../lib/integrations.ts";
import { listOrders } from "../../../../lib/order-store.ts";

export function GET() {
  return NextResponse.json({
    modules: adminModules,
    integrations: integrationHealth,
    snapshot: {
      ...getOperationsSnapshot(),
      orders: listOrders(),
    },
  });
}

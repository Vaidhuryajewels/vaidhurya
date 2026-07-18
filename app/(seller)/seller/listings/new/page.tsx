import { AddListingFlow } from "@/components/add-listing-flow";
import { SellerShell } from "@/components/seller-shell";

export default function AddListingPage() { return <SellerShell eyebrow="Catalog · New piece" title="Add listing"><section className="seller-content"><AddListingFlow /></section></SellerShell>; }

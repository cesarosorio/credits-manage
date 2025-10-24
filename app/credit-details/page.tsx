import { Suspense } from "react";
import CreditDetailsContent from "./credit-details-content";

function LoadingFallback() {
  return (
    <div className="text-center py-12">
      <div className="text-sm text-muted-foreground">
        Cargando detalles del crédito de Casa Guacerí...
      </div>
    </div>
  );
}

export default function CreditDetailsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <CreditDetailsContent />
    </Suspense>
  );
}

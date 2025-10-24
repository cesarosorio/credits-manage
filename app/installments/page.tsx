import { Suspense } from "react";
import InstallmentsContent from "./installments-content";

function LoadingFallback() {
  return (
    <div className="text-center py-12">
      <div className="text-sm text-muted-foreground">
        Cargando tabla de amortización...
      </div>
    </div>
  );
}

export default function InstallmentsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <InstallmentsContent />
    </Suspense>
  );
}

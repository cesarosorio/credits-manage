import { Suspense } from "react";
import SingleDetailContent from "./single-detail-content";

export default function SingleDetailPage() {
  return (
    <Suspense fallback={<div>Cargando detalles del crédito...</div>}>
      <SingleDetailContent />
    </Suspense>
  );
}

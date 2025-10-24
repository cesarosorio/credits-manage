import { Suspense } from "react";
import TestDetailContent from "./test-detail-content";

export default function TestDetailPage() {
  return (
    <Suspense fallback={<div>Cargando detalles de prueba...</div>}>
      <TestDetailContent />
    </Suspense>
  );
}
"use client";

import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { PaymentResponseDto } from "@/domain/payments/types/payments.types";
import { formatCurrencyInstallment, formatDateInstallment } from "@/lib/installment-calculator";

interface PaymentDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  payment: PaymentResponseDto | null;
  isLoading?: boolean;
}

export default function PaymentDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  payment,
  isLoading = false,
}: PaymentDeleteDialogProps) {
  if (!payment) return null;

  const handleConfirm = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isLoading) {
      console.log('Dialog confirm clicked for payment:', payment.id);
      onConfirm();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-500" />
            Confirmar Eliminación
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            ¿Estás seguro de que deseas eliminar este pago? Esta acción no se puede deshacer.
          </AlertDialogDescription>
          
          <div className="bg-gray-50 p-4 rounded-lg border mt-4">
            <div className="font-semibold text-sm text-gray-700 mb-2">
              Detalles del pago a eliminar:
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Fecha:</span>
                <span className="font-medium">
                  {formatDateInstallment(new Date(payment.paymentDate))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monto:</span>
                <span className="font-semibold text-green-600">
                  {formatCurrencyInstallment(payment.amountPaid)}
                </span>
              </div>
              {payment.comment && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Comentario:</span>
                  <span className="font-medium max-w-48 text-right">
                    {payment.comment}
                  </span>
                </div>
              )}
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
          >
            {isLoading ? "Eliminando..." : "Eliminar Pago"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
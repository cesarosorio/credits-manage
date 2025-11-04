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
import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import { formatCurrencyInstallment } from "@/lib/installment-calculator";
import { Loader2, AlertTriangle } from "lucide-react";

interface CreditDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  credit: CreditResponseDto | null;
  isLoading?: boolean;
}

export default function CreditDeleteDialog({
  open,
  onOpenChange,
  onConfirm,
  credit,
  isLoading = false,
}: CreditDeleteDialogProps) {
  if (!credit) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Eliminar Crédito
          </AlertDialogTitle>
        </AlertDialogHeader>
        
        <div className="space-y-3">
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar este crédito? Esta acción no se puede deshacer.
          </AlertDialogDescription>
          
          <div className="bg-muted p-3 rounded-lg space-y-2">
            <div className="font-medium text-sm">Detalles del crédito:</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">Descripción:</span>
                <div className="font-medium">{credit.description || "Sin descripción"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Monto:</span>
                <div className="font-medium">{formatCurrencyInstallment(credit.totalLoan)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Tasa:</span>
                <div className="font-medium">{credit.annualInterestRate}%</div>
              </div>
              <div>
                <span className="text-muted-foreground">Plazo:</span>
                <div className="font-medium">{credit.termMonths} meses</div>
              </div>
            </div>
          </div>

          <div className="bg-destructive/10 border border-destructive/20 p-3 rounded-lg">
            <div className="text-sm text-destructive font-medium">
              ⚠️ Advertencia: También se eliminarán todos los pagos asociados a este crédito.
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel 
            disabled={isLoading}
            className="cursor-pointer transition-colors duration-200 hover:bg-muted"
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer transition-colors duration-200"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Eliminar Crédito
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CreditCard, Plus, Edit, Trash2 } from "lucide-react";
import { PaymentResponseDto } from "@/domain/payments/types/payments.types";
import { formatCurrencyInstallment, formatDateInstallment } from "@/lib/installment-calculator";

export interface PaymentListProps {
  payments: PaymentResponseDto[];
  onNewPayment?: () => void;
  onEditPayment?: (payment: PaymentResponseDto) => void;
  onDeletePayment?: (paymentId: string) => void;
}

export default function PaymentList({ 
  payments, 
  onNewPayment, 
  onEditPayment, 
  onDeletePayment 
}: PaymentListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          Historial de Pagos
        </CardTitle>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto"
          onClick={onNewPayment}
          size="sm"
        >
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Nuevo Pago
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Vista móvil: Cards en lugar de tabla */}
        <div className="block sm:hidden space-y-3">
          {payments.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <h3 className="text-base font-semibold mb-2">
                No hay pagos registrados
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Comienza registrando el primer pago
              </p>
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white w-full"
                onClick={onNewPayment}
                size="sm"
              >
                <Plus className="mr-2 h-3 w-3" />
                Registrar Primer Pago
              </Button>
            </div>
          ) : (
            payments.map((payment, index) => (
              <Card key={payment.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          Pago #{index + 1}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDateInstallment(new Date(payment.paymentDate))}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        {formatCurrencyInstallment(payment.amountPaid)}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {payment.comment || "Sin comentarios"}
                      </p>
                    </div>
                    <div className="flex gap-1 ml-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditPayment?.(payment)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeletePayment?.(payment.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vista desktop: Tabla */}
        <div className="hidden sm:block rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Pago #</TableHead>
                <TableHead className="text-center">Fecha</TableHead>
                <TableHead className="text-right">Monto</TableHead>
                <TableHead className="text-left">Comentario</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-12">
                    <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No hay pagos registrados
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Comienza registrando el primer pago para este crédito
                    </p>
                    <Button 
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                      onClick={onNewPayment}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Registrar Primer Pago
                    </Button>
                  </TableCell>
                </TableRow>
              ) : (
                payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="text-center font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatDateInstallment(new Date(payment.paymentDate))}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrencyInstallment(payment.amountPaid)}
                    </TableCell>
                    <TableCell className="text-left">
                      {payment.comment || "Sin comentarios"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditPayment?.(payment)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeletePayment?.(payment.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
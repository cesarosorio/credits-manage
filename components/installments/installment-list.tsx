import { PaymentStatusEnum } from "@/domain/payments/enums/payments.enums";
import { formatCurrencyInstallment as formatCurrencyInstallment, formatDateInstallment as formatDateInstallment } from "@/lib/installment-calculator";
import { Calculator, Calendar, CheckCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Installment } from "@/domain/payments/types/payments.types";
import { Badge } from "../ui/badge";

export interface InstallmentListProps {
    installments: Installment[];
}

export default function InstallmentsList({ installments }: InstallmentListProps) {
  return (
    <div className="w-full px-8 py-8 space-y-8">
      {/* Tabla de cuotas */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-500" />
            Cronograma de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Cuota #</TableHead>
                <TableHead className="text-center">Fecha Vencimiento</TableHead>
                <TableHead className="text-right">Valor Cuota</TableHead>
                <TableHead className="text-right">Interés</TableHead>
                <TableHead className="text-right">Capital</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
                <TableHead className="text-center">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {installments.map((installment) => (
                <TableRow key={installment.id}>
                  <TableCell className="text-center font-medium">
                    {installment.paymentNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3 text-orange-500" />
                      {formatDateInstallment(installment.expirationDate)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrencyInstallment(installment.installmentAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrencyInstallment(installment.interest)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div>
                      {formatCurrencyInstallment(installment.capital)}
                      {installment.capitalContribution && (
                        <div className="text-xs text-green-600 font-medium">
                          +{formatCurrencyInstallment(installment.capitalContribution)}{" "}
                          extra
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    {installment.status === PaymentStatusEnum.PAID ? (
                      <span className="text-muted-foreground">—</span>
                    ) : (
                      formatCurrencyInstallment(installment.balance)
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge
                      variant={
                        installment.status === PaymentStatusEnum.PAID
                          ? "default"
                          : "secondary"
                      }
                      className={
                        installment.status === PaymentStatusEnum.PAID
                          ? "bg-green-100 text-green-800"
                          : ""
                      }
                    >
                      {installment.status === PaymentStatusEnum.PAID ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Pagado
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 mr-1" />
                          Pendiente
                        </>
                      )}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
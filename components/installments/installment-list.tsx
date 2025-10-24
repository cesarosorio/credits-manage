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
    <div className="w-full space-y-4 sm:space-y-8">
      {/* Tabla de cuotas */}
      <Card className="w-full">
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
            Cronograma de Pagos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          {/* Vista móvil: Cards */}
          <div className="block lg:hidden space-y-3">
            {installments.map((installment) => (
              <Card key={installment.id} className="border border-gray-200">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold">
                          Cuota #{installment.paymentNumber}
                        </span>
                        <Badge
                          variant={
                            installment.status === PaymentStatusEnum.PAID
                              ? "default"
                              : "secondary"
                          }
                          className={
                            installment.status === PaymentStatusEnum.PAID
                              ? "bg-green-100 text-green-800 text-xs"
                              : "text-xs"
                          }
                        >
                          {installment.status === PaymentStatusEnum.PAID ? (
                            <>
                              <CheckCircle className="h-2.5 w-2.5 mr-1" />
                              Pagado
                            </>
                          ) : (
                            <>
                              <Clock className="h-2.5 w-2.5 mr-1" />
                              Pendiente
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Vencimiento:</span>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-2.5 w-2.5 text-orange-500" />
                            <span className="font-medium">
                              {formatDateInstallment(installment.expirationDate)}
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Valor Cuota:</span>
                          <div className="font-bold text-sm">
                            {formatCurrencyInstallment(installment.installmentAmount)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Interés:</span>
                          <div className="font-medium">
                            {formatCurrencyInstallment(installment.interest)}
                          </div>
                        </div>
                        
                        <div>
                          <span className="text-muted-foreground">Capital:</span>
                          <div>
                            <div className="font-medium">
                              {formatCurrencyInstallment(installment.capital)}
                            </div>
                            {installment.capitalContribution && (
                              <div className="text-xs text-green-600 font-medium">
                                +{formatCurrencyInstallment(installment.capitalContribution)} extra
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {installment.status !== PaymentStatusEnum.PAID && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">Saldo:</span>
                            <div className="font-medium">
                              {formatCurrencyInstallment(installment.balance)}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Vista desktop: Tabla */}
          <div className="hidden lg:block rounded-md border overflow-x-auto">
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
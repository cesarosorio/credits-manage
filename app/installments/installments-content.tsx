"use client";

import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import {
  LoanSchedule,
  PaymentResponseDto,
} from "@/domain/payments/types/payments.types";
import { PaymentStatusEnum } from "@/domain/payments/enums/payments.enums";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Calculator,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Percent,
  Shield,
} from "lucide-react";
import {
  calculateMonthlyRate,
  formatCurrencyInstallment,
  formatDateInstallment,
} from "@/lib/installment-calculator";
import {
  generateLoanScheduleFromCredit,
  calculateLoanSummary,
  crossPaymentsWithInstallments,
} from "@/lib/installment-calculator";
import { useApiGet } from "@/common/react-query/useApi";
import { PaymentService } from "@/services/payment.service";
import { CreditService } from "@/services/credit.service";

export default function InstallmentsContent() {
  const searchParams = useSearchParams();
  const creditId = searchParams.get("creditId");

  const [credit, setCredit] = useState<CreditResponseDto | null>(null);
  const [schedule, setSchedule] = useState<LoanSchedule | null>(null);

  // Helper function to safely convert to number and format
  const safeFormatRate = (value: unknown): string => {
    const numValue =
      typeof value === "number" ? value : parseFloat(String(value));
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  // Fetch del crédito por ID
  const creditQuery =  useApiGet<CreditResponseDto>({
      key: ['credits', creditId],
      fn: () => CreditService.getCreditById(creditId!),
    });

  const paymentsQuery = useApiGet<PaymentResponseDto[]>({
    key: ["payments", creditId],
    fn: () => PaymentService.getPaymentsByCreditId(creditId!),
    options: {
      enabled: !!creditId,
    },
  });

  // Generar tabla de amortización cuando se carga el crédito y los pagos
  useEffect(() => {
    if (creditQuery.data) {
      setCredit(creditQuery.data);

      // Generar cronograma base
      const baseSchedule = generateLoanScheduleFromCredit(creditQuery.data);

      // Si hay pagos, cruzarlos con el cronograma
      if (paymentsQuery.data && paymentsQuery.data.length > 0) {
        const updatedSchedule = crossPaymentsWithInstallments(
          baseSchedule,
          paymentsQuery.data,
          creditQuery.data
        );
        setSchedule(updatedSchedule);
      } else {
        // Si no hay pagos, usar cronograma base
        setSchedule(baseSchedule);
      }
    }
  }, [creditQuery.data, paymentsQuery.data]);

  // Calcular resumen financiero
  const summary =
    credit && schedule ? calculateLoanSummary(credit, schedule) : null;

  if (creditQuery.isLoading || paymentsQuery.isLoading) {
    return (
      <div className="text-center py-12">
        <div className="text-sm text-muted-foreground">
          Cargando información del crédito, pagos y calculando cuotas...
        </div>
      </div>
    );
  }

  if (creditQuery.isError || !creditId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h3 className="mt-4 text-lg font-semibold">
          Error al cargar el crédito
        </h3>
        <p className="mt-2 text-muted-foreground">
          {creditQuery.error?.message ||
            "No se pudo cargar la información del crédito"}
        </p>
        <Link href="/credits" className="mt-4 inline-block">
          <Button variant="outline">Volver a Créditos</Button>
        </Link>
      </div>
    );
  }

  if (!credit || !schedule || !summary) {
    return null;
  }

  return (
    <div className="w-full px-2 sm:px-8 py-4 sm:py-8 space-y-4 sm:space-y-8">
      {/* Navegación */}
      <div className="flex justify-between items-center">
        <Link href="/credits">
          <Button
            variant="outline"
            className="bg-transparent border-orange-400 text-foreground hover:bg-orange-50 text-xs sm:text-sm"
            size="sm"
          >
            <ArrowLeft className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Volver a Créditos</span>
            <span className="sm:hidden">Volver</span>
          </Button>
        </Link>
      </div>

      {/* Título y descripción del crédito */}
      <div className="space-y-2 sm:space-y-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Tabla de Amortización
        </h1>
        <div className="flex flex-col gap-1 sm:gap-2">
          <p className="text-sm sm:text-base text-muted-foreground">
            {credit.description || "Crédito sin descripción"}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground">ID: {credit.id}</p>
        </div>
      </div>

      {/* Resumen financiero */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Valor del Préstamo
            </CardTitle>
            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrencyInstallment(summary.loanAmount)}
            </div>
            <p className="text-xs text-muted-foreground">monto inicial</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Cuota Mensual</CardTitle>
            <Calculator className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrencyInstallment(summary.monthlyPayment)}
            </div>
            <p className="text-xs text-muted-foreground">
              incluye seguro de vida
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Total Intereses
            </CardTitle>
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">
              {formatCurrencyInstallment(summary.totalInterest)}
            </div>
            <p className="text-xs text-muted-foreground">
              durante toda la vida del crédito
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Plazo Total</CardTitle>
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="text-lg sm:text-2xl font-bold">{summary.termMonths}</div>
            <p className="text-xs text-muted-foreground">
              meses de financiación
            </p>
          </CardContent>
        </Card>

        <Card className="sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">
              Tasas y Seguro
            </CardTitle>
            <Percent className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
          </CardHeader>
          <CardContent className="pb-3 sm:pb-6">
            <div className="space-y-1.5 sm:space-y-2">
              <div>
                <div className="text-base sm:text-lg font-bold">
                  {safeFormatRate(credit.annualInterestRate)}% EA
                </div>
                <p className="text-xs text-muted-foreground">tasa anual</p>
              </div>
              <div>
                <div className="text-xs sm:text-sm font-semibold text-muted-foreground">
                  {(
                    calculateMonthlyRate(credit.annualInterestRate) * 100
                  ).toFixed(2)}
                  % EM
                </div>
                <p className="text-xs text-muted-foreground">tasa mensual</p>
              </div>
              <div className="flex items-center gap-1 pt-1">
                <Shield className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-orange-500" />
                <div className="text-xs sm:text-sm font-medium">
                  {formatCurrencyInstallment(credit.lifeInsurance || 0)}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">seguro mensual</p>
            </div>
          </CardContent>
        </Card>
      </div>

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
              {schedule.installments.map((installment) => (
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
                    {formatCurrencyInstallment(installment.balance)}
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

      {/* Resumen final */}
      <Card>
        <CardHeader className="pb-3 sm:pb-6">
          <CardTitle className="text-base sm:text-lg">Resumen del Financiamiento</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:gap-4 grid-cols-1 md:grid-cols-2 p-3 sm:p-6">
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Monto del préstamo:</span>
              <span className="font-medium">
                {formatCurrencyInstallment(summary.loanAmount)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total de intereses:</span>
              <span className="font-medium">
                {formatCurrencyInstallment(summary.totalInterest)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Seguro de vida total:
              </span>
              <span className="font-medium">
                {formatCurrencyInstallment(summary.totalLifeInsurance)}
              </span>
            </div>
            <div className="flex justify-between border-t pt-2 text-sm">
              <span className="font-semibold">Total a pagar:</span>
              <span className="font-semibold">
                {formatCurrencyInstallment(summary.totalPayments)}
              </span>
            </div>
          </div>
          <div className="space-y-1.5 sm:space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tasa de interés:</span>
              <span className="font-medium">{summary.effectiveRate}% EA</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Plazo:</span>
              <span className="font-medium">{summary.termMonths} meses</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cuota mensual:</span>
              <span className="font-medium">
                {formatCurrencyInstallment(summary.monthlyPayment)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Fecha inicio:</span>
              <span className="font-medium">
                {formatDateInstallment(new Date(credit.expirationDate))}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
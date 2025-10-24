import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  Clock,
  Percent,
  Shield,
  Calculator,
  TrendingUp,
} from "lucide-react";
import {
  formatCurrencyInstallment,
  calculateMonthlyRate,
} from "@/lib/installment-calculator";
import { CreditResponseDto } from "@/domain/credits/types/credits.types";

interface FinancialSummaryProps {
  summary: {
    loanAmount: number;
    monthlyPayment: number;
    totalInterest: number;
    termMonths: number;
    effectiveRate: number;
    totalLifeInsurance: number;
    totalPayments: number;
  };
  credit: CreditResponseDto;
  safeFormatRate: (value: unknown) => string;
}

export default function FinancialSummary({
  summary,
  credit,
  safeFormatRate,
}: FinancialSummaryProps) {
  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
      <Card className="col-span-1">
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

      <Card className="col-span-1">
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

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Intereses</CardTitle>
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

      <Card className="col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Plazo Total</CardTitle>
          <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
        </CardHeader>
        <CardContent className="pb-3 sm:pb-6">
          <div className="text-lg sm:text-2xl font-bold">{summary.termMonths}</div>
          <p className="text-xs text-muted-foreground">meses de financiación</p>
        </CardContent>
      </Card>

      <Card className="col-span-1 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Tasas y Seguro</CardTitle>
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
                {(calculateMonthlyRate(credit.annualInterestRate) * 100).toFixed(
                  2
                )}
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
  );
}
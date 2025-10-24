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
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 w-full">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Valor del Préstamo
          </CardTitle>
          <DollarSign className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrencyInstallment(summary.loanAmount)}
          </div>
          <p className="text-xs text-muted-foreground">monto inicial</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cuota Mensual</CardTitle>
          <Calculator className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrencyInstallment(summary.monthlyPayment)}
          </div>
          <p className="text-xs text-muted-foreground">
            incluye seguro de vida
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Intereses</CardTitle>
          <TrendingUp className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrencyInstallment(summary.totalInterest)}
          </div>
          <p className="text-xs text-muted-foreground">
            durante toda la vida del crédito
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Plazo Total</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.termMonths}</div>
          <p className="text-xs text-muted-foreground">meses de financiación</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasas y Seguro</CardTitle>
          <Percent className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <div className="text-lg font-bold">
                {safeFormatRate(credit.annualInterestRate)}% EA
              </div>
              <p className="text-xs text-muted-foreground">tasa anual</p>
            </div>
            <div>
              <div className="text-sm font-semibold text-muted-foreground">
                {(calculateMonthlyRate(credit.annualInterestRate) * 100).toFixed(
                  2
                )}
                % EM
              </div>
              <p className="text-xs text-muted-foreground">tasa mensual</p>
            </div>
            <div className="flex items-center gap-1 pt-1">
              <Shield className="h-3 w-3 text-orange-500" />
              <div className="text-sm font-medium">
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
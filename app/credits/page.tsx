"use client";

import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import React, { useEffect } from "react";
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
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  Percent,
  Shield,
  Copy,
  FileText,
} from "lucide-react";
import { useApiGet } from "@/common/react-query/useApi";
import { CreditService } from "@/services/credit.service";
import {
  copyToClipboardId,
  maskUUIDToDisplay,
} from "@/hooks/copy-to-clipboard";
import { formatCurrencyInstallment, formatDateInstallment } from "@/lib/installment-calculator";

export default function CreditsPage() {
  const [credits, setCredits] = React.useState<CreditResponseDto[]>([]);

  const creditsQuery = useApiGet<CreditResponseDto[]>({
    key: ["client-credits"],
    fn: () => CreditService.getAllCredits(),
  });

  useEffect(() => {
    if (creditsQuery.data && Array.isArray(creditsQuery.data)) {
      setCredits(creditsQuery.data);
    } else if (creditsQuery.data) {
      console.warn(
        "Credits data is not an array:",
        typeof creditsQuery.data,
        creditsQuery.data
      );
      // Si los datos vienen en un formato diferente, intentar extraer el array
      if (
        creditsQuery.data &&
        typeof creditsQuery.data === "object" &&
        "data" in creditsQuery.data
      ) {
        const dataWithData = creditsQuery.data as { data: unknown };
        if (Array.isArray(dataWithData.data)) {
          setCredits(dataWithData.data as CreditResponseDto[]);
        }
      }
    }
  }, [creditsQuery.data]);

  return (
    <div className="w-full px-8 py-8 space-y-8">
      {/* Navegación */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-transparent border-orange-400 text-foreground hover:bg-orange-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Título y resumen */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de Créditos
        </h1>
        <p className="text-muted-foreground">
          Administra y visualiza todos los créditos activos
        </p>

        {/* Estado de carga */}
        {creditsQuery.isLoading && (
          <div className="text-sm text-muted-foreground">
            Cargando créditos...
          </div>
        )}

        {/* Estado de error */}
        {creditsQuery.isError && (
          <div className="text-sm text-destructive">
            Error al cargar los créditos:{" "}
            {creditsQuery.error?.message || "Error desconocido"}
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4 w-full">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Créditos
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(credits) && credits.length > 0
                ? credits.length
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">créditos activos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyInstallment(
                Array.isArray(credits) && credits.length > 0
                  ? credits.reduce((sum, credit) => sum + credit.totalLoan, 0)
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              en préstamos activos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa Promedio</CardTitle>
            <Percent className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Array.isArray(credits) && credits.length > 0
                ? (
                    credits.reduce(
                      (sum, credit) => sum + credit.annualInterestRate,
                      0
                    ) / credits.length
                  ).toFixed(2)
                : "0.00"}
              %
            </div>
            <p className="text-xs text-muted-foreground">
              interés anual promedio
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Seguro Total</CardTitle>
            <Shield className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrencyInstallment(
                Array.isArray(credits) && credits.length > 0
                  ? credits.reduce(
                      (sum, credit) => sum + credit.lifeInsurance,
                      0
                    )
                  : 0
              )}
            </div>
            <p className="text-xs text-muted-foreground">en seguros de vida</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de créditos */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-orange-500" />
            Lista de Créditos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!Array.isArray(credits) || credits.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay créditos disponibles
              </h3>
              <p className="mt-2 text-muted-foreground">
                Aún no se han registrado créditos en el sistema
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left">Descripción</TableHead>
                  <TableHead className="text-right">Monto Total</TableHead>
                  <TableHead className="text-right">Tasa Anual</TableHead>
                  <TableHead className="text-right">Seguro Vida</TableHead>
                  <TableHead className="text-center">
                    Fecha Desembolso
                  </TableHead>
                  <TableHead className="text-center">Plazo (Meses)</TableHead>
                  <TableHead className="text-center">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credits.map((credit) => (
                  <TableRow key={credit.id}>
                    <TableCell>
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {credit.description || "Sin descripción"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              ID: {maskUUIDToDisplay(credit.id)}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboardId(credit.id)}
                              className="text-muted-foreground hover:text-orange-500 p-0 h-auto"
                              title="Copiar ID completo"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrencyInstallment(credit.totalLoan)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Percent className="h-3 w-3 text-orange-500" />
                        {credit.annualInterestRate}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrencyInstallment(credit.lifeInsurance)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-3 w-3 text-orange-500" />
                        {formatDateInstallment(new Date(credit.expirationDate))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {credit.termMonths} meses
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex gap-2 justify-center">
                        <Link href={`/credit-details?creditId=${credit.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent border-orange-400 text-foreground hover:bg-orange-50"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Ver Detalles
                          </Button>
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

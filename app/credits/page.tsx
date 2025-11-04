"use client";

import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import React, { useEffect, useState } from "react";
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
  Copy,
  FileText,
  Plus,
  Edit,
  Trash2,
  CreditCard,
} from "lucide-react";
import { useApiGet, useApiSend } from "@/common/react-query/useApi";
import { CreditService } from "@/services/credit.service";
import { cn } from "@/lib/utils";
import {
  copyToClipboardId,
  maskUUIDToDisplay,
} from "@/hooks/copy-to-clipboard";
import {
  formatCurrencyInstallment,
  formatDateInstallment,
} from "@/lib/installment-calculator";
import CreditFormDialog from "@/components/credits/credit-form-dialog";
import CreditDeleteDialog from "@/components/credits/credit-delete-dialog";
import { toast } from "sonner";
import {
  CreateCreditDto,
  UpdateCreditDto,
} from "@/domain/credits/types/credits.dto";

export default function CreditsPage() {
  const [credits, setCredits] = useState<CreditResponseDto[]>([]);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCredit, setSelectedCredit] =
    useState<CreditResponseDto | null>(null);
  const [creditToDelete, setCreditToDelete] =
    useState<CreditResponseDto | null>(null);

  const creditsQuery = useApiGet<CreditResponseDto[]>({
    key: ["client-credits"],
    fn: () => CreditService.getAllCredits(),
  });

  // Mutaciones para CRUD
  const { mutate: createCredit, isPending: isCreatingCredit } =
    useApiSend<CreateCreditDto>({
      fn: (data: CreateCreditDto) => CreditService.createCredit(data),
      success: () => {
        toast.success("Crédito creado exitosamente");
        setIsFormDialogOpen(false);
        setSelectedCredit(null);
        creditsQuery.refetch();
      },
      error: (error) => {
        console.error("Error creando crédito", error);
        toast.error("Error al crear el crédito");
      },
      invalidateAllWhenStart: "client-credits",
    });

  const { mutate: updateCredit, isPending: isUpdatingCredit } =
    useApiSend<UpdateCreditDto>({
      fn: (data: UpdateCreditDto) =>
        CreditService.updateCredit(selectedCredit!.id, data),
      success: () => {
        toast.success("Crédito actualizado exitosamente");
        setIsFormDialogOpen(false);
        setSelectedCredit(null);
        creditsQuery.refetch();
      },
      error: (error) => {
        console.error("Error actualizando crédito", error);
        toast.error("Error al actualizar el crédito");
      },
      invalidateAllWhenStart: "client-credits",
    });

  const { mutate: deleteCredit, isPending: isDeletingCredit } =
    useApiSend<string>({
      fn: (creditId: string) => CreditService.deleteCredit(creditId),
      success: () => {
        toast.success("Crédito eliminado exitosamente");
        setIsDeleteDialogOpen(false);
        setCreditToDelete(null);
        creditsQuery.refetch();
      },
      error: (error) => {
        console.error("Error eliminando crédito", error);
        toast.error("Error al eliminar el crédito");
      },
      invalidateAllWhenStart: "client-credits",
    });

  // Funciones para manejar las acciones
  const handleCreateCredit = () => {
    setSelectedCredit(null);
    setIsFormDialogOpen(true);
  };

  const handleEditCredit = (credit: CreditResponseDto) => {
    setSelectedCredit(credit);
    setIsFormDialogOpen(true);
  };

  const handleDeleteCredit = (credit: CreditResponseDto) => {
    setCreditToDelete(credit);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: CreateCreditDto | UpdateCreditDto) => {
    if (selectedCredit) {
      updateCredit(data as UpdateCreditDto);
    } else {
      createCredit(data as CreateCreditDto);
    }
  };

  const handleConfirmDelete = () => {
    if (creditToDelete) {
      deleteCredit(creditToDelete.id);
    }
  };

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
      {/* Navegación y botón de crear */}
      <div className="flex justify-between items-center">
        <Link href="/">
          <Button
            variant="outline"
            className="bg-transparent border-orange-400 text-foreground hover:bg-orange-50 cursor-pointer transition-colors duration-200"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>

      {/* Título y navegación */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestión de Créditos
            </h1>
            <p className="text-muted-foreground">
              Administra y visualiza todos los créditos activos
            </p>
          </div>
          <Button
            onClick={handleCreateCredit}
            className="bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg transition-all duration-200 w-full sm:w-auto cursor-pointer"
            size="default"
          >
            <Plus className="mr-2 h-4 w-4" />
            Crear Nuevo Crédito
          </Button>
        </div>

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

      {/* Tabla de créditos */}
      <Card className="w-full border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5 text-orange-500" />
            Lista de Créditos
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Administra todos los créditos del sistema
          </p>
        </CardHeader>
        <CardContent className="p-0">
          {!Array.isArray(credits) || credits.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="mx-auto w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-8 w-8 text-orange-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay créditos disponibles
              </h3>
              <p className="text-muted-foreground mb-6">
                Aún no se han registrado créditos en el sistema
              </p>
              <Button
                onClick={handleCreateCredit}
                className="bg-orange-500 hover:bg-orange-600 cursor-pointer transition-colors duration-200"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear Primer Crédito
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50/50">
                    <TableHead className="text-left font-semibold text-gray-900 py-4">
                      Información
                    </TableHead>
                    <TableHead className="text-right font-semibold text-gray-900 py-4">
                      Monto Total
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Tasa Anual
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Seguro
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Fecha
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Plazo
                    </TableHead>
                    <TableHead className="text-center font-semibold text-gray-900 py-4">
                      Acciones
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {credits.map((credit, index) => (
                    <TableRow
                      key={credit.id}
                      className={cn(
                        "border-b border-gray-100 hover:bg-gray-50/50 transition-colors duration-150",
                        index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                      )}
                    >
                      <TableCell className="py-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CreditCard className="h-5 w-5 text-orange-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-gray-900 mb-1">
                              {credit.description || "Sin descripción"}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
                                {maskUUIDToDisplay(credit.id)}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => copyToClipboardId(credit.id)}
                                className="h-6 w-6 p-0 text-muted-foreground hover:text-orange-500"
                                title="Copiar ID completo"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4">
                        <div className="font-bold text-gray-900 text-lg">
                          {formatCurrencyInstallment(credit.totalLoan)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                          <Percent className="h-3 w-3" />
                          {credit.annualInterestRate}%
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="text-sm font-medium text-gray-600">
                          {formatCurrencyInstallment(credit.lifeInsurance)}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="inline-flex items-center gap-1 text-sm font-medium text-gray-600">
                          <Calendar className="h-3 w-3" />
                          {formatDateInstallment(
                            new Date(credit.expirationDate)
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full text-sm font-semibold">
                          {credit.termMonths}m
                        </div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="flex gap-1 justify-center">
                          <Link href={`/credit-details?creditId=${credit.id}`}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-9 w-9 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg cursor-pointer transition-colors duration-200"
                              title="Ver detalles"
                            >
                              <FileText className="h-4 w-4" />
                            </Button>
                          </Link>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCredit(credit)}
                            className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors duration-200"
                            title="Editar crédito"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCredit(credit)}
                            className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg cursor-pointer transition-colors duration-200"
                            title="Eliminar crédito"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Diálogos */}
      <CreditFormDialog
        open={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
        onSubmit={handleFormSubmit}
        credit={selectedCredit}
        isLoading={isCreatingCredit || isUpdatingCredit}
      />

      <CreditDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        credit={creditToDelete}
        isLoading={isDeletingCredit}
      />
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Calculator, AlertCircle, CreditCard } from "lucide-react";
import {
  formatCurrencyInstallment,
  crossPaymentsWithInstallments,
  generateLoanScheduleFromCredit,
  calculateLoanSummary,
} from "@/lib/installment-calculator";
import { useApiGet, useApiSend } from "@/common/react-query/useApi";
import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import {
  LoanSchedule,
  PaymentResponseDto,
} from "@/domain/payments/types/payments.types";
import { CreditService } from "@/services/credit.service";
import { PaymentService } from "@/services/payment.service";
import InstallmentsList from "@/components/installments/installment-list";
import PaymentList from "@/components/payments/payment-list";
import PaymentFormDialog from "@/components/payments/payment-form-dialog";
import PaymentDeleteDialog from "@/components/payments/payment-delete-dialog";
import FinancialSummary from "@/components/credits/financial-summary";
import { toast } from "sonner";
import { UpsertPaymentDto } from "@/domain/payments/types/payments.dto";

export default function CreditDetailsContent() {
  const searchParams = useSearchParams();
  const creditId = searchParams.get("creditId");

  const [credit, setCredit] = useState<CreditResponseDto | null>(null);
  const [schedule, setSchedule] = useState<LoanSchedule | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] =
    useState<PaymentResponseDto | null>(null);
  const [paymentToDelete, setPaymentToDelete] =
    useState<PaymentResponseDto | null>(null);

  // Fetch del crédito por ID
  const creditQuery = useApiGet<CreditResponseDto>({
    key: ["client-credits", creditId],
    fn: () => CreditService.getCreditById(creditId!),
  });

  const paymentsQuery = useApiGet<PaymentResponseDto[]>({
    key: ["client-payments", creditId],
    fn: () => PaymentService.getPaymentsByCreditId(creditId!),
    options: {
      enabled: !!creditId,
    },
  });

  const { mutate: createPayment, isPending: isCreatingPayment } = useApiSend<
    Partial<UpsertPaymentDto>
  >({
    fn: (data: Partial<UpsertPaymentDto>) => PaymentService.createPayment(data),
    success: (data: PaymentResponseDto) => {
      console.log("Payment created successfully", data);
      toast.success("Pago registrado exitosamente");
      setIsPaymentDialogOpen(false);
      // Refrescar los datos después de crear el pago
      paymentsQuery.refetch();
    },
    error: (error) => {
      console.error("Error creando pago", error);
      toast.error("Error al registrar el pago");
      setIsPaymentDialogOpen(false);
    },
    invalidateAllWhenStart: "client-payments",
  });

  const { mutate: updatePayment, isPending: isUpdatingPayment } = useApiSend<
    Partial<UpsertPaymentDto>
  >({
    fn: (data: Partial<UpsertPaymentDto>) =>
      PaymentService.updatePayment(selectedPayment!.id, data),
    success: (data: PaymentResponseDto) => {
      console.log("Payment updated successfully", data);
      toast.success("Pago actualizado exitosamente");
      setIsPaymentDialogOpen(false);
      setSelectedPayment(null);
      paymentsQuery.refetch();
    },
    error: (error) => {
      console.error("Error actualizando pago", error);
      toast.error("Error al actualizar el pago");
      setIsPaymentDialogOpen(false);
    },
    invalidateAllWhenStart: "client-payments",
  });

  // Subida de imagen lateral (left/right)
  const { mutate: uploadImageSide, isPending: isUploadImageSide } =
    useApiSend<File>({
      fn: (file: File) => PaymentService.uploadImage(file, selectedPayment!.id),
      success: (url: string) => {
        console.log("Imagen subida exitosamente:", url);
        toast.success("Imagen subida exitosamente");
      },
      error: () => {
        toast.error("Error al subir la imagen");
      },
    });

  // Eliminación de pagos
  const { mutate: deletePayment, isPending: isDeletingPayment } = useApiSend<string>({
    fn: (paymentId: string) => PaymentService.deletePayment(paymentId),
    success: () => {
      console.log("Payment deleted successfully");
      toast.success("Pago eliminado exitosamente");
      setIsDeleteDialogOpen(false);
      setPaymentToDelete(null);
      paymentsQuery.refetch();
    },
    error: (error) => {
      console.error("Error eliminando pago", error);
      toast.error("Error al eliminar el pago");
      setIsDeleteDialogOpen(false);
    },
    invalidateAllWhenStart: "client-payments",
  });

  // Helper function to safely convert to number and format
  const safeFormatRate = (value: unknown): string => {
    const numValue =
      typeof value === "number" ? value : parseFloat(String(value));
    return isNaN(numValue) ? "0.00" : numValue.toFixed(2);
  };

  // Funciones para manejar pagos
  const handleNewPayment = () => {
    setSelectedPayment(null);
    setIsPaymentDialogOpen(true);
  };

  const handlePaymentSubmit = (data: Partial<UpsertPaymentDto>) => {
    if (selectedPayment) {
      // Modo edición - aquí iría la lógica de actualización
      updatePayment(data);
    } else {
      // Modo creación
      data.creditId = creditId!;
      createPayment(data);
    }
  };

  const handleFileUpload = (file: File) => {
    // Aquí iría la lógica para manejar el archivo subido
    uploadImageSide(file);
  };

  const handleEditPayment = (payment: PaymentResponseDto) => {
    setSelectedPayment(payment);
    setIsPaymentDialogOpen(true);
  };

  const handleDeletePayment = (paymentId: string) => {
    // Encontrar el pago a eliminar
    const payment = paymentsQuery.data?.find(p => p.id === paymentId);
    if (payment) {
      setPaymentToDelete(payment);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    console.log('handleConfirmDelete called', paymentToDelete?.id);
    if (paymentToDelete && !isDeletingPayment) {
      console.log('Executing delete for payment:', paymentToDelete.id);
      deletePayment(paymentToDelete.id);
    }
  };

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
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full px-8 py-8 space-y-8">
        {/* Navegación */}
        <div className="flex justify-between items-center">
          <Link href="/credits">
            <Button
              variant="outline"
              className="bg-transparent border-orange-400 text-foreground hover:bg-orange-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Créditos
            </Button>
          </Link>
        </div>

        {/* Título */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Detalles del Crédito
          </h1>
          <div className="flex flex-col gap-2">
            <p className="text-muted-foreground">
              Vista de detalles para el crédito seleccionado
            </p>
            <p className="text-sm text-muted-foreground">ID: {creditId}</p>
          </div>
        </div>

        {/* Resumen financiero */}
        <FinancialSummary
          summary={summary}
          credit={credit}
          safeFormatRate={safeFormatRate}
        />

        {/* Tabs con contenido */}
        <Tabs defaultValue="amortization" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="amortization"
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              Tabla de Amortización
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Gestión de Pagos
            </TabsTrigger>
          </TabsList>

          {/* Tab 1: Tabla de Amortización */}
          <TabsContent value="amortization" className="space-y-4">
            <InstallmentsList installments={schedule.installments} />
          </TabsContent>

          {/* Tab 2: Gestión de Pagos */}
          <TabsContent value="payments" className="space-y-4">
            <PaymentList
              payments={paymentsQuery.data || []}
              onNewPayment={handleNewPayment}
              onEditPayment={handleEditPayment}
              onDeletePayment={handleDeletePayment}
            />
          </TabsContent>
        </Tabs>

        {/* Cards de Resumen Financiero */}
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-start">
          {/* Card 1: Resumen de Cuotas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-orange-500" />
                Resumen de Cuotas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total de Cuotas:
                  </span>
                  <span className="font-semibold text-lg">
                    {summary.termMonths}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Cuotas Pagadas:
                  </span>
                  <span className="font-semibold text-lg text-green-600">
                    {
                      schedule.installments.filter(
                        (inst) => inst.status === "PAID"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Cuotas Pendientes:
                  </span>
                  <span className="font-semibold text-lg text-orange-600">
                    {
                      schedule.installments.filter(
                        (inst) => inst.status === "PENDING"
                      ).length
                    }
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total Intereses:
                  </span>
                  <span className="font-semibold text-lg">
                    {formatCurrencyInstallment(summary.totalInterest)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total Capital:
                  </span>
                  <span className="font-semibold text-lg">
                    {formatCurrencyInstallment(summary.loanAmount)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total Seguro:
                  </span>
                  <span className="font-semibold text-lg">
                    {formatCurrencyInstallment(summary.totalLifeInsurance)}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-orange-50 rounded-lg px-3">
                  <span className="font-medium">Total a Pagar:</span>
                  <span className="font-bold text-xl text-orange-600">
                    {formatCurrencyInstallment(summary.totalPayments)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Resumen de Pagos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-orange-500" />
                Resumen de Pagos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total Pagos Realizados:
                  </span>
                  <span className="font-semibold text-lg">
                    {paymentsQuery.data?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Total Pagado:
                  </span>
                  <span className="font-semibold text-lg text-green-600">
                    {formatCurrencyInstallment(
                      paymentsQuery.data?.reduce(
                        (total, payment) => total + payment.amountPaid,
                        0
                      ) || 0
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-muted-foreground">
                    Saldo Pendiente:
                  </span>
                  <span className="font-semibold text-lg text-orange-600">
                    {formatCurrencyInstallment(
                      summary.totalPayments -
                        (paymentsQuery.data?.reduce(
                          (total, payment) => total + payment.amountPaid,
                          0
                        ) || 0)
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 bg-green-50 rounded-lg px-3">
                  <span className="font-medium">Progreso de Pago:</span>
                  <span className="font-bold text-xl text-green-600">
                    {(
                      ((paymentsQuery.data?.reduce(
                        (total, payment) => total + payment.amountPaid,
                        0
                      ) || 0) /
                        summary.totalPayments) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog para crear/editar pagos */}
      <PaymentFormDialog
        open={isPaymentDialogOpen}
        onOpenChange={(open) => {
          setIsPaymentDialogOpen(open);
          if (!open) setSelectedPayment(null); // Limpiar selección al cerrar
        }}
        onSubmit={handlePaymentSubmit}
        payment={selectedPayment}
        isLoading={isCreatingPayment || isUpdatingPayment}
        onFileUpload={handleFileUpload}
        isUploadImageSide={isUploadImageSide}
      />

      {/* Dialog para confirmar eliminación de pagos */}
      <PaymentDeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        payment={paymentToDelete}
        isLoading={isDeletingPayment}
      />
    </main>
  );
}

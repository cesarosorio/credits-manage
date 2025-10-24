"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, DollarSign, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { PaymentUploadImage } from "./payment-upload-image";
import { ENV_CONFIG } from "@/config/env.config";
import {
  UpsertPaymentDto,
  paymentFormSchema,
  PaymentFormValues,
} from "@/domain/payments/types/payments.dto";
import { PaymentResponseDto } from "@/domain/payments/types/payments.types";
import { API_ENDPOINTS } from "@/common/axios";
import { API_CONFIG } from "@/services/api.service";

interface PaymentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<UpsertPaymentDto>) => void;
  onFileUpload: (file: File) => void;
  payment?: PaymentResponseDto | null; // Para edición
  isLoading?: boolean;
  isUploadImageSide?: boolean;
}

export default function PaymentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  payment = null, // null para crear, PaymentResponseDto para editar
  isLoading = false,
  onFileUpload,
  isUploadImageSide = false,
}: PaymentFormDialogProps) {
  const form = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: {
      paymentDate: new Date(),
      amountPaid: "",
      comment: "",
    },
  });

  // Estado para el manejo de archivos
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Pre-llenar el formulario cuando se está editando
  useEffect(() => {
    if (payment && open) {
      // Intentamos cargar la imagen usando el ID del pago
      const imageUrl = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PAYMENTS.URL_GET_IMAGE(payment.id)}`;
      setPreviewUrl(imageUrl);
      form.reset({
        paymentDate: new Date(payment.paymentDate),
        amountPaid: payment.amountPaid.toString(),
        comment: payment.comment || "",
      });
    } else if (!payment && open) {
      setPreviewUrl(null);
      form.reset({
        paymentDate: new Date(),
        amountPaid: "",
        comment: "",
      });
    }
  }, [payment, open, form]);

  // Determinar si es modo edición
  const isEditMode = payment !== null;

  // Funciones para manejar archivos
  const handleFileUpload = (file: File) => {
    setSelectedFile(file);
    onFileUpload(file);
    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleSubmit = (data: PaymentFormValues) => {
    onSubmit({
      paymentDate: data.paymentDate,
      amountPaid: Number(data.amountPaid),
      comment: data.comment,
    });
    form.reset();
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isEditMode ? (
              <Edit className="h-5 w-5 text-orange-500" />
            ) : (
              <DollarSign className="h-5 w-5 text-orange-500" />
            )}
            {isEditMode ? "Editar Pago" : "Registrar Nuevo Pago"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode 
              ? "Modifica la información del pago seleccionado. Todos los campos marcados con * son obligatorios."
              : "Registra un nuevo pago para este crédito. Todos los campos marcados con * son obligatorios."
            }
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            {/* Fecha de Pago */}
            <FormField
              control={form.control}
              name="paymentDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de Pago *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: es })
                          ) : (
                            <span>Selecciona una fecha</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Monto Pagado */}
            <FormField
              control={form.control}
              name="amountPaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto Pagado *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        {...field}
                        type="number"
                        placeholder="0.00"
                        className="pl-8"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Comprobante de Pago - Solo para edición */}
            {isEditMode && (
              <PaymentUploadImage
                label="Comprobante de Pago"
                onUpload={handleFileUpload}
                onRemove={handleRemoveFile}
                selectedFile={selectedFile}
                previewUrl={previewUrl}
                isUploadImageSide={isUploadImageSide}
              />
            )}

            {/* Comentario */}
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comentario</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Comentarios adicionales sobre el pago (opcional)"
                      className="resize-none"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isEditMode ? "Actualizando..." : "Guardando...")
                  : (isEditMode ? "Actualizar Pago" : "Registrar Pago")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

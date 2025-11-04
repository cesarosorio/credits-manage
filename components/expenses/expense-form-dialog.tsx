"use client";

import React, { useEffect } from "react";
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
import { CalendarIcon, Receipt, Edit } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  UpsertExpenseDto,
  expenseFormSchema,
  ExpenseFormValues,
} from "@/domain/expenses/types/expenses.dto";
import { ExpenseResponseDto } from "@/domain/expenses/types/expenses.types";

interface ExpenseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<UpsertExpenseDto>) => void;
  expense?: ExpenseResponseDto | null; // Para edición
  isLoading?: boolean;
}

export default function ExpenseFormDialog({
  open,
  onOpenChange,
  onSubmit,
  expense,
  isLoading = false,
}: ExpenseFormDialogProps) {
  const isEditMode = !!expense;

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      date: new Date(),
      value: "",
      description: "",
    },
  });

  // Efecto para cargar datos en modo edición
  useEffect(() => {
    if (expense && open) {
      form.reset({
        date: new Date(expense.date),
        value: expense.value.toString(),
        description: expense.description,
      });
    } else if (!expense && open) {
      // Modo creación - limpiar form
      form.reset({
        date: new Date(),
        value: "",
        description: "",
      });
    }
  }, [expense, open, form]);

  const handleSubmit = (data: ExpenseFormValues) => {
    const formattedData: Partial<UpsertExpenseDto> = {
      date: data.date,
      value: parseFloat(data.value),
      description: data.description,
    };

    onSubmit(formattedData);
  };

  const handleCancel = () => {
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            {isEditMode ? (
              <>
                <Edit className="h-5 w-5 text-orange-500" />
                Editar Gasto
              </>
            ) : (
              <>
                <Receipt className="h-5 w-5 text-orange-500" />
                Registrar Nuevo Gasto
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Actualiza la información del gasto seleccionado."
              : "Completa los datos para registrar un nuevo gasto en el crédito."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Fecha del Gasto */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha del Gasto *</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal cursor-pointer transition-colors duration-200",
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

            {/* Valor del Gasto */}
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor del Gasto *</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                        $
                      </span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        className="pl-6"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Descripción del Gasto */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Gasto *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe el motivo o concepto del gasto..."
                      className="resize-none"
                      rows={3}
                      {...field}
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
                className="cursor-pointer transition-colors duration-200 hover:bg-muted"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white cursor-pointer transition-colors duration-200"
                disabled={isLoading}
              >
                {isLoading 
                  ? (isEditMode ? "Actualizando..." : "Guardando...")
                  : (isEditMode ? "Actualizar Gasto" : "Registrar Gasto")
                }
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import {
  CreateCreditDto,
  CreditFormData,
  UpdateCreditDto,
  createCreditFormSchemaByMode,
} from "@/domain/credits/types/credits.dto";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CreditFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateCreditDto | UpdateCreditDto) => void;
  credit?: CreditResponseDto | null;
  isLoading?: boolean;
}

export default function CreditFormDialog({
  open,
  onOpenChange,
  onSubmit,
  credit,
  isLoading = false,
}: CreditFormDialogProps) {
  const isEditMode = !!credit;

  const form = useForm<CreditFormData>({
    resolver: zodResolver(createCreditFormSchemaByMode(isEditMode)),
    defaultValues: {
      description: "",
      totalLoan: undefined,
      annualInterestRate: undefined,
      lifeInsurance: 0,
      expirationDate: new Date(),
      termMonths: undefined,
    },
  });

  React.useEffect(() => {
    if (credit) {
      // Modo edición: cargar todos los valores del crédito con conversiones explícitas
      form.reset({
        description: credit.description || "",
        totalLoan: typeof credit.totalLoan === 'number' ? credit.totalLoan : Number(credit.totalLoan) || undefined,
        annualInterestRate: typeof credit.annualInterestRate === 'number' ? credit.annualInterestRate : Number(credit.annualInterestRate) || undefined,
        lifeInsurance: typeof credit.lifeInsurance === 'number' ? credit.lifeInsurance : Number(credit.lifeInsurance) || 0,
        expirationDate: credit.expirationDate
          ? new Date(credit.expirationDate)
          : new Date(),
        termMonths: typeof credit.termMonths === 'number' ? credit.termMonths : Number(credit.termMonths) || undefined,
      });
    } else {
      // Modo creación: valores por defecto vacíos
      form.reset({
        description: "",
        totalLoan: undefined,
        annualInterestRate: undefined,
        lifeInsurance: 0,
        expirationDate: new Date(),
        termMonths: undefined,
      });
    }
  }, [credit, form]);

  const onFormSubmit = (data: CreditFormData) => {
    const submitData = {
      ...data,
      expirationDate: data.expirationDate.toISOString(),
    };

    // Omitir paymentAmount para que lo calcule el backend (tanto en creación como en edición)
    delete submitData.paymentAmount;

    onSubmit(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {credit ? "Editar Crédito" : "Crear Nuevo Crédito"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onFormSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Descripción */}
              <div className="sm:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Descripción del crédito"
                          {...field}
                          rows={2}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Monto Total */}
              <FormField
                control={form.control}
                name="totalLoan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Total *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1,000,000"
                        value={field.value !== undefined ? field.value.toString() : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseFloat(value);
                            field.onChange(isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Valor del préstamo en pesos colombianos
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Tasa de Interés Anual */}
              <FormField
                control={form.control}
                name="annualInterestRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tasa Anual (%) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="15.5"
                        value={field.value !== undefined ? field.value.toString() : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseFloat(value);
                            field.onChange(isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Tasa de interés efectiva anual
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Seguro de Vida */}
              <FormField
                control={form.control}
                name="lifeInsurance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seguro de Vida *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        value={field.value !== undefined ? field.value : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseFloat(value);
                            field.onChange(isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>Valor mensual del seguro (puede ser 0)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha de Desembolso */}
              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Desembolso *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccionar fecha</span>
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
                          disabled={(date) => date < new Date("1900-01-01")}
                          locale={es}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Fecha en que se desembolsó el crédito
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Plazo en Meses */}
              <FormField
                control={form.control}
                name="termMonths"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plazo (Meses) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        max="360"
                        placeholder="24"
                        value={field.value !== undefined ? field.value.toString() : ""}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "") {
                            field.onChange(undefined);
                          } else {
                            const numValue = parseInt(value);
                            field.onChange(isNaN(numValue) ? undefined : numValue);
                          }
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Duración del crédito en meses (1-360 meses)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {credit ? "Actualizar" : "Crear"} Crédito
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

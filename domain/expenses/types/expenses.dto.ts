import z from "zod";

export interface UpsertExpenseDto {
  value: number;
  date: Date;
  description: string;
  creditId: string;
}

export interface UpdateExpenseDto {
  id: string;
  value?: number;
  date?: Date;
  description?: string;
}

export type ExpenseFormValues = z.infer<typeof expenseFormSchema>;

export const expenseFormSchema = z.object({
  date: z.date({
    message: "La fecha del gasto es requerida",
  }),
  value: z
    .string()
    .min(1, "El valor es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El valor debe ser un número mayor a 0",
    }),
  description: z
    .string()
    .min(1, "La descripción es requerida")
    .max(500, "La descripción no puede exceder 500 caracteres"),
});
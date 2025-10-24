import z from "zod";

export interface UpsertPaymentDto {
  paymentDate: Date;
  amountPaid: number;
  comment?: string;
  creditId: string;
}

export interface UpdatePaymentDto {
  id: string;
  paymentDate?: Date;
  amountPaid?: number;
  comment?: string;
}

export type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export const paymentFormSchema = z.object({
  paymentDate: z.date({
    message: "La fecha de pago es requerida",
  }),
  amountPaid: z
    .string()
    .min(1, "El monto es requerido")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "El monto debe ser un número mayor a 0",
    }),
  comment: z.string().optional(),
});
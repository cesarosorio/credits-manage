import * as z from "zod";

// Esquemas de validación para formularios de créditos
export const baseCreditFormSchema = {
  description: z.string().optional(),
  totalLoan: z.number().min(1, "El monto total debe ser mayor a 0"),
  annualInterestRate: z.number().min(0, "La tasa debe ser mayor o igual a 0").max(100, "La tasa no puede exceder 100%"),
  lifeInsurance: z.number().min(0, "El seguro debe ser mayor o igual a 0"),
  expirationDate: z.date({
    message: "La fecha de desembolso es obligatoria",
  }),
  termMonths: z.number().min(1, "El plazo debe ser mayor a 0").max(360, "El plazo no puede exceder 360 meses"),
};

// Esquema para creación de créditos (sin paymentAmount)
export const createCreditFormSchema = z.object(baseCreditFormSchema);

// Esquema para edición de créditos (también sin paymentAmount - será calculado por el backend)
export const updateCreditFormSchema = z.object(baseCreditFormSchema);

// Función helper para crear esquema dinámico según el modo
export const createCreditFormSchemaByMode = (isEditMode: boolean) => {
  return isEditMode ? updateCreditFormSchema : createCreditFormSchema;
};

// Tipos derivados de los esquemas de validación
export type CreateCreditFormValues = z.infer<typeof createCreditFormSchema>;
export type UpdateCreditFormValues = z.infer<typeof updateCreditFormSchema>;

// Tipo unificado para los datos del formulario (sin paymentAmount)
export type CreditFormData = {
  description?: string;
  totalLoan: number;
  annualInterestRate: number;
  lifeInsurance: number;
  expirationDate: Date;
  termMonths: number;
};

export interface CreateCreditDto {
    description?: string;
    totalLoan: number;
    annualInterestRate: number;
    lifeInsurance: number;
    expirationDate: Date | string;
    termMonths: number;
    paymentAmount: number;
}

export interface UpdateCreditDto {
    description?: string;
    totalLoan?: number;
    annualInterestRate?: number;
    lifeInsurance?: number;
    expirationDate?: Date | string;
    termMonths?: number;
    paymentAmount?: number;
}
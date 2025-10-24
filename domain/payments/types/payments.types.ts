import { PaymentStatusEnum } from "../enums/payments.enums"

export interface PaymentResponseDto {
  id: string
  paymentDate: Date
  amountPaid: number
  comment?: string
  creditId: string
}

export interface Installment {
  id: string
  paymentNumber: number
  expirationDate: Date
  installmentAmount: number // Valor de la cuota (capital + interés + seguro)
  status: PaymentStatusEnum
  capitalContribution?: number // Abono a capital extra
  interest: number
  capital: number
  balance: number
}

export interface LoanSchedule {
  installments: Installment[]
  totalInterest: number
  totalPaid: number
}
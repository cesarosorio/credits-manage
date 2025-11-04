import { ExpenseStatusEnum } from "../enums/expenses.enums"

export interface ExpenseResponseDto {
  id: string
  value: number
  date: Date
  description: string
  creditId: string
  status?: ExpenseStatusEnum
  createdAt?: Date
  updatedAt?: Date
}
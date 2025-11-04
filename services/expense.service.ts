import { UpsertExpenseDto } from "@/domain/expenses/types/expenses.dto";
import { ExpenseResponseDto } from "../domain/expenses/types/expenses.types";
import apiService from "./api.service";
import { API_ENDPOINTS } from "@/common/axios";

export const ExpenseService = {
  getExpensesByCreditId: async (
    creditId: string
  ): Promise<ExpenseResponseDto[]> => {
    try {
      const endpoint = API_ENDPOINTS.EXPENSES.GET_ALL_BY_CREDIT_ID(creditId);
      const response = await apiService.get<ExpenseResponseDto[]>(endpoint);

      if (!response) {
        throw new Error("Invalid response from expenses API");
      }

      // Si response.data existe, usarlo, si no, usar response directamente
      const expensesData = response.data || response;

      // Asegurar que siempre retornemos un array con tipos numéricos correctos
      const expenses = Array.isArray(expensesData) ? expensesData : [];

      // Convertir campos numéricos que podrían venir como strings del API
      return expenses.map((expense) => ({
        ...expense,
        value: Number(expense.value),
        date: new Date(expense.date),
      }));
    } catch (error) {
      console.error("Error in ExpenseService.getExpenses:", error);
      throw error;
    }
  },

  createExpense: async (
    upsertExpenseDto: Partial<UpsertExpenseDto>
  ): Promise<ExpenseResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.EXPENSES.CREATE;
      const response = await apiService.post<ExpenseResponseDto>(
        endpoint,
        upsertExpenseDto
      );
      if (!response) {
        throw new Error("Invalid response from expenses API on create");
      }
      const expenseData = response.data || response;
      return {
        ...expenseData,
        value: Number(expenseData.value),
        date: new Date(expenseData.date),
      };
    } catch (error) {
      console.error("Error in ExpenseService.createExpense:", error);
      throw error;
    }
  },

  updateExpense: async (
    expenseId: string,
    upsertExpenseDto: Partial<UpsertExpenseDto>
  ): Promise<ExpenseResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.EXPENSES.UPDATE(expenseId);
      const response = await apiService.put<ExpenseResponseDto>(
        endpoint,
        upsertExpenseDto
      );
      if (!response) {
        throw new Error("Invalid response from expenses API on update");
      }
      const expenseData = response.data || response;
      return {
        ...expenseData,
        value: Number(expenseData.value),
        date: new Date(expenseData.date),
      };
    } catch (error) {
      console.error("Error in ExpenseService.updateExpense:", error);
      throw error;
    }
  },

  deleteExpense: async (expenseId: string): Promise<void> => {
    try {
      const endpoint = API_ENDPOINTS.EXPENSES.DELETE(expenseId);
      await apiService.delete(endpoint);
    } catch (error) {
      console.error("Error in ExpenseService.deleteExpense:", error);
      throw error;
    }
  },

  getExpenseById: async (expenseId: string): Promise<ExpenseResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.EXPENSES.FIND_BY_ID(expenseId);
      const response = await apiService.get<ExpenseResponseDto>(endpoint);
      if (!response) {
        throw new Error("Invalid response from expenses API on get by id");
      }
      const expenseData = response.data || response;
      return {
        ...expenseData,
        value: Number(expenseData.value),
        date: new Date(expenseData.date),
      };
    } catch (error) {
      console.error("Error in ExpenseService.getExpenseById:", error);
      throw error;
    }
  },
};
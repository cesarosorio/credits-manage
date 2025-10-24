import { UpsertPaymentDto } from "@/domain/payments/types/payments.dto";
import { PaymentResponseDto } from "../domain/payments/types/payments.types";
import apiService from "./api.service";
import { API_ENDPOINTS } from "@/common/axios";

export const PaymentService = {
  getPaymentsByCreditId: async (
    creditId: string
  ): Promise<PaymentResponseDto[]> => {
    try {
      const endpoint = API_ENDPOINTS.PAYMENTS.GET_ALL_BY_CREDIT_ID(creditId);
      const response = await apiService.get<PaymentResponseDto[]>(endpoint);

      if (!response) {
        throw new Error("Invalid response from payments API");
      }

      // Si response.data existe, usarlo, si no, usar response directamente
      const paymentsData = response.data || response;

      // Asegurar que siempre retornemos un array con tipos numéricos correctos
      const payments = Array.isArray(paymentsData) ? paymentsData : [];

      // Convertir campos numéricos que podrían venir como strings del API
      return payments.map((payment) => ({
        ...payment,
        amountPaid: Number(payment.amountPaid),
        paymentDate: new Date(payment.paymentDate),
      }));
    } catch (error) {
      console.error("Error in PaymentService.getPayments:", error);
      throw error;
    }
  },

  createPayment: async (
    upsertPaymentDto: Partial<UpsertPaymentDto>
  ): Promise<PaymentResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.PAYMENTS.CREATE;
      const response = await apiService.post<PaymentResponseDto>(
        endpoint,
        upsertPaymentDto
      );
      if (!response) {
        throw new Error("Invalid response from payments API on create");
      }
      const paymentData = response.data || response;
      return {
        ...paymentData,
        amountPaid: Number(paymentData.amountPaid),
        paymentDate: new Date(paymentData.paymentDate),
      } as PaymentResponseDto;
    } catch (error) {
      console.error("Error in PaymentService.createPayment:", error);
      throw error;
    }
  },

  updatePayment: async (
    paymentId: string,
    updatePaymentDto: Partial<UpsertPaymentDto>
  ): Promise<PaymentResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.PAYMENTS.UPDATE(paymentId);
      const response = await apiService.put<PaymentResponseDto>(
        endpoint,
        updatePaymentDto
      );
      if (!response) {
        throw new Error("Invalid response from payments API on update");
      }
      const paymentData = response.data || response;
      return {
        ...paymentData,
        amountPaid: Number(paymentData.amountPaid),
        paymentDate: new Date(paymentData.paymentDate),
      } as PaymentResponseDto;
    } catch (error) {
      console.error("Error in PaymentService.updatePayment:", error);
      throw error;
    }
  },

  uploadImage: async (file: File, paymentId: string): Promise<void> => {
    try {
      const endpoint = API_ENDPOINTS.PAYMENTS.UPLOAD_IMAGE(paymentId);
      const formData = new FormData();
      formData.append("file", file);

      const response = await apiService.post<{ message: string }>(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!response) {
        throw new Error("Invalid response from payments API on image upload");
      }

      return;
    } catch (error) {
      console.error("Error in PaymentService.uploadImage:", error);
      throw error;
    }
  },

  deletePayment: async (paymentId: string): Promise<void> => {
    try {
      const endpoint = API_ENDPOINTS.PAYMENTS.DELETE(paymentId);
      await apiService.delete(endpoint);
      return;
    } catch (error) {
      console.error("Error in PaymentService.deletePayment:", error);
      throw error;
    }
  },
};

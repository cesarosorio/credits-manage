import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import apiService from "./api.service";
import { API_ENDPOINTS } from "@/common/axios";
import {
  CreateCreditDto,
  UpdateCreditDto,
} from "@/domain/credits/types/credits.dto";

export const CreditService = {
  getCreditById: async (creditId: string): Promise<CreditResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.GET_BY_ID(creditId);
      const response = await apiService.get<CreditResponseDto>(endpoint);

      if (!response) {
        throw new Error("Invalid response from API");
      }

      // Si response.data existe, usarlo, si no, usar response directamente
      const creditData = response.data || response;

      return creditData as CreditResponseDto;
    } catch (error) {
      console.error("Error in CreditService.getCreditById:", error);
      throw error;
    }
  },

  getAllCredits: async (): Promise<CreditResponseDto[]> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.GET_ALL;
      const response = await apiService.get<CreditResponseDto[]>(endpoint);

      if (!response) {
        throw new Error("Invalid response from API");
      }

      // Si response.data existe, usarlo, si no, usar response directamente
      const creditData = response.data || response;

      return creditData as CreditResponseDto[];
    } catch (error) {
      console.error("Error in CreditService.getAllCredits:", error);
      throw error;
    }
  },

  createCredit: async (
    creditData: CreateCreditDto
  ): Promise<CreditResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.CREATE;
      const response = await apiService.post<CreditResponseDto>(
        endpoint,
        creditData
      );

      if (!response) {
        throw new Error("Invalid response from API");
      }

      const newCredit = response.data || response;
      return newCredit as CreditResponseDto;
    } catch (error) {
      console.error("Error in CreditService.createCredit:", error);
      throw error;
    }
  },

  updateCredit: async (
    creditId: string,
    creditData: UpdateCreditDto
  ): Promise<CreditResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.UPDATE(creditId);
      const response = await apiService.put<CreditResponseDto>(
        endpoint,
        creditData
      );

      if (!response) {
        throw new Error("Invalid response from API");
      }

      const updatedCredit = response.data || response;
      return updatedCredit as CreditResponseDto;
    } catch (error) {
      console.error("Error in CreditService.updateCredit:", error);
      throw error;
    }
  },

  deleteCredit: async (creditId: string): Promise<void> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.DELETE(creditId);
      await apiService.delete(endpoint);
    } catch (error) {
      console.error("Error in CreditService.deleteCredit:", error);
      throw error;
    }
  },
};

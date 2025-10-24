import { CreditResponseDto } from '@/domain/credits/types/credits.types';
import apiService from './api.service';
import { API_ENDPOINTS } from '@/common/axios';

export const CreditService = {
  getCreditById: async (creditId: string): Promise<CreditResponseDto> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.GET_BY_ID(creditId);
      const response = await apiService.get<CreditResponseDto>(endpoint);
      
      if (!response) {
        throw new Error('Invalid response from API');
      }
      
      // Si response.data existe, usarlo, si no, usar response directamente
      const creditData = response.data || response;
      
      return creditData as CreditResponseDto;
    } catch (error) {
      console.error('Error in CreditService.getCreditById:', error);
      throw error;
    }
  },

  getAllCredits: async (): Promise<CreditResponseDto[]> => {
    try {
      const endpoint = API_ENDPOINTS.CREDITS.GET_ALL;
      const response = await apiService.get<CreditResponseDto[]>(endpoint);

      if (!response) {
        throw new Error('Invalid response from API');
      }
      
      // Si response.data existe, usarlo, si no, usar response directamente
      const creditData = response.data || response;

      return creditData as CreditResponseDto[];
    } catch (error) {
      console.error('Error in CreditService.getCreditById:', error);
      throw error;
    }
  }
}
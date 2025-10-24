export interface CreditResponseDto {
    id: string;
    description?: string;
    totalLoan: number;
    annualInterestRate: number;
    lifeInsurance: number;
    expirationDate: Date;
    termMonths: number;
    paymentAmount: number; // Valor de la cuota que viene del banco
}

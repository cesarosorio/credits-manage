import { CreditResponseDto } from "@/domain/credits/types/credits.types";
import { Installment, LoanSchedule, PaymentResponseDto } from "@/domain/payments/types/payments.types";
import { PaymentStatusEnum } from "@/domain/payments/enums/payments.enums";
import { v4 as uuidv4 } from 'uuid';

/**
 * Calcular la tasa de interés mensual desde la tasa efectiva anual
 * ÚNICA FUNCIÓN PARA CALCULAR TASA MENSUAL
 */
export function calculateMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
}

/**
 * Formatear moneda en pesos colombianos
 */
export function formatCurrencyInstallment(amount: number | string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numericAmount)) {
    console.warn('formatCurrency received invalid value:', amount);
    return '$0';
  }
  
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(numericAmount);
}

/**
 * Formatear fecha
 */
export function formatDateInstallment(date: Date): string {
  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

/**
 * Calcula la cuota mensual usando la fórmula de amortización francesa estándar
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualRate: number,
  termMonths: number
): number {
  if (annualRate === 0) {
    return loanAmount / termMonths;
  }
  
  // USAR LA FUNCIÓN LOCAL ÚNICA
  const monthlyRate = calculateMonthlyRate(annualRate);
  const factor = Math.pow(1 + monthlyRate, termMonths);
  
  const exactPayment = (loanAmount * monthlyRate * factor) / (factor - 1);
  
  return Math.round(exactPayment);
}

/**
 * Genera la tabla de amortización completa para un crédito
 */
export function generateLoanSchedule(
  loanAmount: number,
  annualRate: number,
  termMonths: number,
  lifeInsurance: number = 0,
  paymentAmount?: number, // Valor opcional de la cuota del banco
  startDate?: Date | string // Fecha de inicio para calcular vencimientos
): Installment[] {
  // Si se proporciona paymentAmount, usarlo; sino calcular
  const basePayment = paymentAmount ? paymentAmount - lifeInsurance : calculateMonthlyPayment(loanAmount, annualRate, termMonths);
  
  // USAR LA FUNCIÓN LOCAL ÚNICA
  const monthlyRate = calculateMonthlyRate(annualRate);
  
  // Fecha base para calcular vencimientos
  const baseDate = startDate ? new Date(startDate) : new Date();
  
  let remainingBalance = Number(loanAmount);
  const schedule: Installment[] = [];
  
  for (let month = 1; month <= termMonths; month++) {
    const interest = Math.round(remainingBalance * monthlyRate * 100) / 100;
    let principal = Math.round((basePayment - interest) * 100) / 100;
    
    // Calcular fecha de vencimiento basada en la fecha de inicio
    const expirationDate = new Date(baseDate);
    expirationDate.setMonth(expirationDate.getMonth() + month);
    
    // Calcular el saldo como deuda total pendiente (capital + interés + seguro del período)
    const debtBalance = Math.round((Number(remainingBalance) + Number(interest) + Number(lifeInsurance)) * 100) / 100;
    
    // Ajustar la última cuota para cubrir cualquier diferencia de redondeo
    if (month === termMonths) {
      principal = Math.round(remainingBalance * 100) / 100;
      
      // Si se proporciona paymentAmount del banco, mantener ese valor fijo
      const installmentAmount = paymentAmount ? 
        Number(paymentAmount) : 
        (Number(principal) + Number(interest) + Number(lifeInsurance));
      
      remainingBalance = 0;
      
      schedule.push({
        id: uuidv4(),
        paymentNumber: month,
        expirationDate: expirationDate,
        installmentAmount: Math.round(installmentAmount * 100) / 100,
        capital: principal,
        interest: interest,
        balance: Math.round((Number(principal) + Number(interest) + Number(lifeInsurance)) * 100) / 100, // Saldo final de la última cuota
        status: PaymentStatusEnum.PENDING,
      });
    } else {
      const installmentAmount = Number(basePayment) + Number(lifeInsurance);
      remainingBalance = Math.round((remainingBalance - principal) * 100) / 100;
      
      schedule.push({
        id: uuidv4(),
        paymentNumber: month,
        expirationDate: expirationDate,
        installmentAmount: Math.round(installmentAmount * 100) / 100,
        capital: principal,
        interest: interest,
        balance: debtBalance, // Saldo como deuda total pendiente del período
        status: PaymentStatusEnum.PENDING,
      });
    }
  }
  
  return schedule;
}

/**
 * Genera el cronograma de pagos usando directamente un crédito
 * Usa el paymentAmount del crédito si está disponible y calcula fechas desde expirationDate
 */
export function generateLoanScheduleFromCredit(credit: CreditResponseDto): LoanSchedule {
  const installments = generateLoanSchedule(
    Number(credit.totalLoan),              // Asegurar conversión a número
    Number(credit.annualInterestRate),     // Asegurar conversión a número
    Number(credit.termMonths),             // Asegurar conversión a número
    Number(credit.lifeInsurance),          // Asegurar conversión a número
    Number(credit.paymentAmount),          // Asegurar conversión a número
    credit.expirationDate                  // Fecha se mantiene como está
  );
  
  const totalInterest = installments.reduce((sum, inst) => sum + Number(inst.interest), 0);
  const totalPaid = installments.reduce((sum, inst) => sum + Number(inst.installmentAmount), 0);
  
  return {
    installments,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
  };
}

/**
 * Cruza los pagos reales con las cuotas generadas de forma secuencial
 * Lógica: 
 * 1. Los pagos se asignan secuencialmente (pago 1 → cuota 1, pago 2 → cuota 2, etc.)
 * 2. Todo abono a capital reduce el saldo y minimiza las cuotas futuras progresivamente
 * 3. Si el saldo se reduce significativamente, puede eliminar cuotas completas
 * @param schedule - Cronograma de cuotas generado
 * @param payments - Pagos reales realizados (en orden cronológico)
 * @param credit - Información del crédito
 * @returns Cronograma actualizado con menos cuotas si hay abonos grandes a capital
 */
export function crossPaymentsWithInstallments(
  schedule: LoanSchedule,
  payments: PaymentResponseDto[],
  credit: CreditResponseDto
): LoanSchedule {
  // USAR LA FUNCIÓN LOCAL ÚNICA
  const monthlyRate = calculateMonthlyRate(Number(credit.annualInterestRate));
  let currentBalance = Number(credit.totalLoan);
  
  // Crear copia mutable de los installments
  const updatedInstallments = [...schedule.installments];
  
  // Ordenar pagos por fecha (para asegurar orden secuencial)
  const sortedPayments = [...payments].sort((a, b) => 
    new Date(a.paymentDate).getTime() - new Date(b.paymentDate).getTime()
  );
  
  // Procesar cada pago secuencialmente
  for (let paymentIndex = 0; paymentIndex < sortedPayments.length && paymentIndex < updatedInstallments.length; paymentIndex++) {
    const payment = sortedPayments[paymentIndex];
    const installment = updatedInstallments[paymentIndex];
    const amountPaid = Number(payment.amountPaid);
    
    // Calcular interés real basado en saldo actual
    const realInterest = Math.round(currentBalance * monthlyRate * 100) / 100;
    const lifeInsurance = Number(credit.lifeInsurance);
    const minPaymentNeeded = realInterest + lifeInsurance;
    
    if (amountPaid >= minPaymentNeeded) {
      // El pago cubre al menos interés + seguro
      const availableForCapital = amountPaid - realInterest - lifeInsurance;
      const capitalToPay = Math.min(availableForCapital, currentBalance);
      const regularCapital = Math.min(capitalToPay, Number(installment.capital));
      const extraCapital = Math.max(0, capitalToPay - regularCapital);
      
      // Actualizar saldo
      currentBalance = Math.max(0, currentBalance - capitalToPay);
      
      // Para cuotas pagadas, el saldo de esa cuota específica es 0
      // El saldo de deuda pendiente se refleja en las cuotas siguientes
      
      // Marcar cuota como PAGADA
      updatedInstallments[paymentIndex] = {
        ...installment,
        status: PaymentStatusEnum.PAID,
        interest: realInterest,
        capital: regularCapital,
        capitalContribution: extraCapital > 0 ? extraCapital : undefined,
        balance: 0, // Saldo de la cuota pagada es 0
      };
      
    } else {
      // Pago insuficiente - aplicar como abono a capital
      if (amountPaid > 0 && currentBalance > 0) {
        const capitalAbono = Math.min(amountPaid, currentBalance);
        currentBalance = Math.max(0, currentBalance - capitalAbono);
        
        // Calcular saldo como deuda pendiente
        const debtBalance = currentBalance > 0 ? 
          Math.round((Number(currentBalance) + (Number(currentBalance) * Number(monthlyRate)) + Number(credit.lifeInsurance)) * 100) / 100 : 0;
        
        // No marcar como PAGADA, pero registrar el abono
        updatedInstallments[paymentIndex] = {
          ...installment,
          status: PaymentStatusEnum.PENDING,
          capitalContribution: capitalAbono,
          balance: debtBalance,
        };
      }
    }
  }
  
  // PASO CRÍTICO: Regenerar cronograma con el saldo actualizado
  // Si el saldo se redujo significativamente, algunas cuotas pueden desaparecer
  if (currentBalance < Number(credit.totalLoan)) {
    // Regenerar todas las cuotas pendientes con el nuevo saldo
    const newInstallments = [];
    
    // Mantener las cuotas ya procesadas (pagadas o con abonos)
    for (let i = 0; i < Math.min(sortedPayments.length, updatedInstallments.length); i++) {
      newInstallments.push(updatedInstallments[i]);
    }
    
    // Regenerar TODAS las cuotas restantes hasta completar el término original
    let tempBalance = currentBalance;
    let cuotaNumber = newInstallments.length + 1;
    const baseDate = new Date(credit.expirationDate);
    
    while (cuotaNumber <= credit.termMonths) {
      const expirationDate = new Date(baseDate);
      expirationDate.setMonth(expirationDate.getMonth() + cuotaNumber);
      
      if (tempBalance > 0.01) {
        // Cuotas normales mientras hay saldo
        const interest = Math.round(tempBalance * monthlyRate * 100) / 100;
        const lifeInsurance = Number(credit.lifeInsurance);
        const maxCapital = Number(credit.paymentAmount) - interest - lifeInsurance;
        const capital = Math.min(maxCapital, tempBalance);
        
        // Si es la última cuota necesaria o el capital cubre todo el saldo
        const isLastNeeded = capital >= tempBalance;
        const finalInstallmentAmount = isLastNeeded ? 
          (interest + capital + lifeInsurance) : 
          Number(credit.paymentAmount);
        
        // Calcular el saldo como deuda pendiente (capital restante + interés + seguro)
        const remainingAfterPayment = Math.max(0, Number(tempBalance) - Number(capital));
        const debtBalance = remainingAfterPayment > 0 ? 
          Math.round((Number(remainingAfterPayment) + (Number(remainingAfterPayment) * Number(monthlyRate)) + Number(lifeInsurance)) * 100) / 100 : 0;
        
        newInstallments.push({
          id: `regenerated-${cuotaNumber}`,
          paymentNumber: cuotaNumber,
          expirationDate: expirationDate,
          installmentAmount: Math.round(finalInstallmentAmount * 100) / 100,
          status: PaymentStatusEnum.PENDING,
          interest: interest,
          capital: capital,
          balance: debtBalance,
        });
        
        tempBalance = Math.max(0, tempBalance - capital);
      } else {
        // Cuotas con valores en 0 para completar el término original
        newInstallments.push({
          id: `zero-${cuotaNumber}`,
          paymentNumber: cuotaNumber,
          expirationDate: expirationDate,
          installmentAmount: 0,
          status: PaymentStatusEnum.PENDING,
          interest: 0,
          capital: 0,
          balance: 0,
        });
      }
      
      cuotaNumber++;
    }
    
    // Recalcular totales
    const totalInterest = newInstallments.reduce((sum, inst) => sum + Number(inst.interest), 0);
    const totalPaid = newInstallments
      .filter(inst => inst.status === PaymentStatusEnum.PAID)
      .reduce((sum, inst) => sum + Number(inst.installmentAmount), 0);
    
    return {
      installments: newInstallments,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalPaid: Math.round(totalPaid * 100) / 100,
    };
  }
  
  // Si no hubo cambios significativos, devolver cronograma original actualizado
  const totalInterest = updatedInstallments.reduce((sum, inst) => sum + Number(inst.interest), 0);
  const totalPaid = updatedInstallments
    .filter(inst => inst.status === PaymentStatusEnum.PAID)
    .reduce((sum, inst) => sum + Number(inst.installmentAmount), 0);
  
  return {
    installments: updatedInstallments,
    totalInterest: Math.round(totalInterest * 100) / 100,
    totalPaid: Math.round(totalPaid * 100) / 100,
  };
}

/**
 * Recalcula la tabla de amortización cuando hay abonos a capital
 */
export function recalculateScheduleWithExtraPayments(
  credit: CreditResponseDto,
  extraPayments: { paymentNumber: number; amount: number }[]
): LoanSchedule {
  const monthlyPayment = calculateMonthlyPayment(
    credit.totalLoan,
    credit.annualInterestRate,
    credit.termMonths
  );
  
  // USAR LA FUNCIÓN LOCAL ÚNICA
  const monthlyRate = calculateMonthlyRate(credit.annualInterestRate);
  const disbursementDate = new Date(credit.expirationDate);
  
  let remainingBalance = credit.totalLoan;
  const installments: Installment[] = [];
  let totalInterest = 0;
  let currentMonth = 1;
  
  while (remainingBalance > 0.01 && currentMonth <= credit.termMonths * 2) {
    // Calcular la fecha de vencimiento
    const dueDate = new Date(disbursementDate);
    dueDate.setMonth(dueDate.getMonth() + currentMonth);
    
    // Calcular interés del período
    const interestPayment = remainingBalance * monthlyRate;
    
    // Calcular abono a capital base
    let principalPayment = monthlyPayment - interestPayment;
    
    // Verificar si hay abono extra en esta cuota
    const extraPayment = extraPayments.find(ep => ep.paymentNumber === currentMonth);
    if (extraPayment) {
      principalPayment += extraPayment.amount;
    }
    
    // Asegurar que no se pague más del saldo restante
    principalPayment = Math.min(principalPayment, remainingBalance);
    
    // Actualizar saldo
    remainingBalance = Math.max(0, remainingBalance - principalPayment);
    
    // Calcular cuota total (incluye seguro de vida)
    const installmentAmount = interestPayment + principalPayment + credit.lifeInsurance;
    
    const installment: Installment = {
      id: uuidv4(),
      paymentNumber: currentMonth,
      expirationDate: dueDate,
      installmentAmount,
      status: PaymentStatusEnum.PENDING,
      capitalContribution: extraPayment?.amount,
      interest: interestPayment,
      capital: principalPayment - (extraPayment?.amount || 0),
      balance: remainingBalance,
    };
    
    installments.push(installment);
    totalInterest += interestPayment;
    currentMonth++;
  }
  
  return {
    installments,
    totalInterest,
    totalPaid: 0,
  };
}

/**
 * Calcula el resumen financiero del crédito
 */
export function calculateLoanSummary(credit: CreditResponseDto, schedule: LoanSchedule) {
  const totalPayments = schedule.installments.reduce(
    (sum, inst) => sum + Number(inst.installmentAmount),
    0
  );
  
  const totalLifeInsurance = Number(credit.lifeInsurance) * schedule.installments.length;
  
  return {
    loanAmount: Number(credit.totalLoan),
    totalInterest: Number(schedule.totalInterest),
    totalLifeInsurance: Number(totalLifeInsurance),
    totalPayments: Number(totalPayments),
    monthlyPayment: Number(schedule.installments[0]?.installmentAmount || 0),
    effectiveRate: Number(credit.annualInterestRate),
    termMonths: Number(credit.termMonths), // Usar siempre el término original del crédito
  };
}

# Módulo de Cuotas (Installments)

Este módulo calcula automáticamente la tabla de amortización de un crédito basado en el sistema de cuotas fijas (amortización francesa).

## Características

### 🧮 **Cálculo Automático**
- Genera automáticamente la tabla de amortización completa
- Calcula cuotas fijas mensuales usando la fórmula estándar
- Incluye seguro de vida en cada cuota

### 📊 **Información Detallada**
- **Cronograma completo** de pagos mes a mes
- **Distribución** entre capital e interés en cada cuota
- **Saldo pendiente** después de cada pago
- **Resumen financiero** del crédito

### 🎯 **Fórmulas Implementadas**

#### Cuota Fija Mensual:
```
PMT = P * [r(1+r)^n] / [(1+r)^n - 1]
```

Donde:
- `P` = Monto del préstamo
- `r` = Tasa de interés mensual (tasa anual / 12)
- `n` = Número de cuotas

#### Para cada período:
- **Interés** = Saldo anterior × Tasa mensual
- **Capital** = Cuota fija - Interés
- **Nuevo saldo** = Saldo anterior - Capital

## Uso

### Navegación
1. Ir a **Gestión de Créditos**
2. Hacer clic en **"Amortización"** del crédito deseado
3. La tabla se calcula automáticamente

### Parámetros de Entrada
El módulo recibe como props:
- `creditId` (via URL params): ID del crédito a procesar

### Datos del Crédito Requeridos:
```typescript
interface CreditResponseDto {
  id: string;
  totalLoan: number;           // Monto del préstamo
  annualInterestRate: number;  // Tasa de interés anual (%)
  lifeInsurance: number;       // Seguro de vida mensual
  disbursementDate: Date;      // Fecha de desembolso
  termMonths: number;          // Plazo en meses
}
```

## Archivos del Módulo

### 📄 **Lógica de Cálculo**
- `lib/installment-calculator.ts` - Funciones de cálculo financiero

### 🎨 **Interfaz de Usuario**
- `app/installments/page.tsx` - Página principal del módulo

### 📋 **Tipos de Datos**
- `domain/payments/types/payments.types.ts` - Tipos `Installment` y `LoanSchedule`

## Funciones Principales

### `generateLoanSchedule(credit: CreditResponseDto): LoanSchedule`
Genera la tabla de amortización completa para un crédito.

### `calculateMonthlyPayment(loanAmount, rate, termMonths): number`
Calcula la cuota mensual fija.

### `calculateLoanSummary(credit, schedule)`
Genera el resumen financiero del crédito.

### `recalculateScheduleWithExtraPayments(credit, extraPayments)`
Recalcula la tabla cuando hay abonos extras a capital.

## Estructura de Datos

### Installment (Cuota)
```typescript
interface Installment {
  id: string;
  paymentNumber: number;        // Número de cuota
  dueDate: Date;               // Fecha de vencimiento
  installmentAmount: number;    // Valor total de la cuota
  status: PaymentStatusEnum;    // Estado del pago
  principalPayment?: number;    // Abono extra a capital
  comment?: string;            // Comentarios
  interest: number;            // Interés del período
  principal: number;           // Abono a capital
  balance: number;             // Saldo restante
}
```

### LoanSchedule (Tabla de Amortización)
```typescript
interface LoanSchedule {
  installments: Installment[];  // Todas las cuotas
  totalInterest: number;       // Total de intereses
  totalPaid: number;          // Total pagado
}
```

## Ejemplo de Uso

```typescript
// Cargar crédito
const credit = await CreditService.getCreditById(creditId);

// Generar tabla de amortización
const schedule = generateLoanSchedule(credit);

// Calcular resumen
const summary = calculateLoanSummary(credit, schedule);
```

## Características Visuales

### 📊 **Dashboard de Resumen**
- Valor del préstamo
- Cuota mensual (incluye seguro)
- Total de intereses
- Plazo total

### 📋 **Tabla Detallada**
- Número de cuota
- Fecha de vencimiento
- Valor de la cuota
- Distribución interés/capital
- Saldo pendiente
- Estado del pago

### 🎨 **Elementos UI**
- Cards con métricas principales
- Tabla responsiva con shadcn/ui
- Badges de estado (Pagado/Pendiente)
- Navegación intuitiva

## Consideraciones Técnicas

### ⚡ **Rendimiento**
- Cálculos realizados del lado del cliente
- Generación instantánea de hasta 360 cuotas (30 años)

### 🔧 **Precisión**
- Cálculos con precisión de centavos
- Manejo correcto de redondeos
- Saldo final exactamente en cero

### 🎯 **Extensibilidad**
- Soporte para abonos extras a capital
- Recálculo automático de tabla
- Integración con módulo de pagos

## Próximas Mejoras

1. **Simulador de Abonos**: Permitir simular abonos extras
2. **Exportar a PDF**: Generar reporte de la tabla
3. **Comparador**: Comparar diferentes escenarios de pago
4. **Gráficos**: Visualización de la evolución del saldo
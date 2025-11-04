import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Receipt, Plus, Edit, Trash2 } from "lucide-react";
import { ExpenseResponseDto } from "@/domain/expenses/types/expenses.types";
import { formatCurrencyInstallment, formatDateInstallment } from "@/lib/installment-calculator";

export interface ExpenseListProps {
  expenses: ExpenseResponseDto[];
  onNewExpense?: () => void;
  onEditExpense?: (expense: ExpenseResponseDto) => void;
  onDeleteExpense?: (expenseId: string) => void;
}

export default function ExpenseList({ 
  expenses, 
  onNewExpense, 
  onEditExpense, 
  onDeleteExpense 
}: ExpenseListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Receipt className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
          Historial de Gastos
        </CardTitle>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto cursor-pointer transition-colors duration-200"
          onClick={onNewExpense}
          size="sm"
        >
          <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
          Nuevo Gasto
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {/* Vista móvil: Cards en lugar de tabla */}
        <div className="block sm:hidden space-y-3">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <Receipt className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">
                No hay gastos registrados
              </p>
            </div>
          ) : (
            expenses.map((expense) => (
              <Card key={expense.id} className="border border-border">
                <CardContent className="p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-sm">
                        {formatCurrencyInstallment(expense.value)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateInstallment(expense.date)}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditExpense?.(expense)}
                        className="h-7 w-7 p-0 cursor-pointer hover:bg-muted transition-colors duration-200"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDeleteExpense?.(expense.id)}
                        className="h-7 w-7 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors duration-200"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p className="truncate">{expense.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Vista desktop: Tabla */}
        <div className="hidden sm:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Fecha</TableHead>
                <TableHead className="w-[120px]">Valor</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="w-[100px] text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {expenses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    <div className="flex flex-col items-center justify-center py-4">
                      <Receipt className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        No hay gastos registrados
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                expenses.map((expense) => (
                  <TableRow key={expense.id}>
                    <TableCell className="font-medium">
                      {formatDateInstallment(expense.date)}
                    </TableCell>
                    <TableCell className="font-semibold text-green-600">
                      {formatCurrencyInstallment(expense.value)}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{expense.description}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEditExpense?.(expense)}
                          className="h-8 w-8 p-0 cursor-pointer hover:bg-muted transition-colors duration-200"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDeleteExpense?.(expense.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 cursor-pointer transition-colors duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, ArrowRight, CreditCard } from "lucide-react";
import { redirect } from "next/navigation";

// Verificar si existe la variable de entorno para Single Detail
const SINGLE_CREDIT_ID = process.env.NEXT_PUBLIC_SINGLE_CREDIT_ID;

export default function HomePage() {
  // Si existe la variable de entorno, redirigir a Single Detail
  if (SINGLE_CREDIT_ID) {
    redirect('/single-detail');
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex justify-center">
            <div className="bg-orange-500 p-4 rounded-2xl shadow-lg">
              <CreditCard className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
            Administración de Préstamos
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto">
            Sistema de gestión de créditos y pagos
          </p>
        </div>

        {/* Main Card */}
        <div className="flex justify-center">
          <Card className="w-full max-w-2xl hover:shadow-2xl transition-all duration-300 border-0 shadow-xl">
            <CardHeader className="text-center space-y-6 pb-8">
              <div className="flex justify-center">
                <div className="bg-orange-100 p-6 rounded-2xl">
                  <DollarSign className="h-16 w-16 text-orange-600" />
                </div>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold text-gray-900 mb-3">
                  Gestión de Créditos
                </CardTitle>
                <p className="text-lg text-gray-600">
                  Administra y visualiza todos los créditos de manera eficiente
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-8 pb-8">
              <div className="grid gap-4 text-center">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-gray-900 mb-3">Funcionalidades principales</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Ver lista completa de créditos
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Crear nuevos créditos
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Editar y eliminar créditos existentes
                    </li>
                    <li className="flex items-center justify-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      Gestionar pagos y cuotas
                    </li>
                  </ul>
                </div>
              </div>

              <div className="flex justify-center">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <Link href="/credits">
                    Acceder a Gestión de Créditos
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center">
          <p className="text-gray-500">
            Sistema desarrollado para la gestión eficiente de créditos financieros
          </p>
        </div>
      </div>
    </main>
  );
}

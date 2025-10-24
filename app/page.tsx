import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, TestTube, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <div className="text-center space-y-6 sm:space-y-8 mb-12">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
          Financiera Guacarí
        </h1>
        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema de gestión de créditos y pagos
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 md:grid-cols-2">
        {/* Card para Credit Details normal */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-xl">Credit Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Página normal de detalles de crédito que requiere parámetro creditId en la URL.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Usa useSearchParams para obtener el creditId</li>
              <li>• Incluye botón de navegación &quot;Volver&quot;</li>
              <li>• Maneja casos de error cuando no hay ID</li>
            </ul>
            <Button asChild className="w-full">
              <Link href="/credits">
                Ir a Credit Details
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Card para Test Detail con ID quemado */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-3 rounded-lg">
                <TestTube className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-xl">Test Detail</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Página de prueba con ID de crédito fijo para desarrollo y testing.
            </p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• ID quemado: c8a994b6-11b2-4a24-abee-86caf03a6cab</li>
              <li>• No requiere parámetros en la URL</li>
              <li>• Sin botones de navegación</li>
            </ul>
            <Button asChild variant="outline" className="w-full">
              <Link href="/test-detail">
                Ir a Test Detail
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Selecciona la página que deseas ver según tu caso de uso
        </p>
      </div>
    </main>
  );
}

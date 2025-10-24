import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, ArrowRight, CreditCard } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header de bienvenida */}
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-primary/10 rounded-full">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
              Bienvenido a Financiera Guacari
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Tu plataforma de gestión financiera personal. Administra tus préstamos, 
              pagos y mantén el control total de tus finanzas.
            </p>
          </div>

          {/* Tarjeta principal de bienvenida */}
          <Card className="mb-8">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl text-foreground">
                ¿Listo para gestionar tus pagos?
              </CardTitle>
              <CardDescription className="text-lg">
                Accede a tu tabla de amortización y controla el estado de tus cuotas
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6">
              <div className="grid md:grid-cols-3 gap-6 w-full max-w-2xl">
                <div className="text-center">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-3">
                    <CreditCard className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Gestiona Pagos</h3>
                  <p className="text-sm text-muted-foreground">
                    Marca cuotas como pagadas y registra abonos extra
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-3">
                    <Building2 className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Seguimiento</h3>
                  <p className="text-sm text-muted-foreground">
                    Visualiza tu progreso y saldo restante
                  </p>
                </div>
                <div className="text-center">
                  <div className="p-3 bg-secondary/10 rounded-full w-fit mx-auto mb-3">
                    <ArrowRight className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">Control Total</h3>
                  <p className="text-sm text-muted-foreground">
                    Información detallada de cada cuota
                  </p>
                </div>
              </div>
              
              <Link href="/credits">
                <Button size="lg" className="bg-orange-500 text-white hover:bg-orange-600">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Ir a Gestión de Pagos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Información adicional */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Sistema Bancolombia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Integrado con el sistema de amortización de Bancolombia para 
                  un seguimiento preciso de tu préstamo.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-foreground">Cálculos Automáticos</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Los abonos a capital recalculan automáticamente las cuotas futuras 
                  y el cronograma de pagos.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}

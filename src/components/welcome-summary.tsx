'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function WelcomeSummary() {
  return (
    <>
         <Card className="mb-8">
       <CardHeader>
         <CardTitle>Gestiona tus pedidos</CardTitle>
       </CardHeader>
       <CardContent>
         <p>Gestiona tus pedidos y productos de forma sencilla y eficiente. Recibe notificaciones de tus pedidos y productos.</p>
       </CardContent>
     </Card>
     <Card className="mb-8">
      <CardHeader>
        <CardTitle>Atencion al cliente</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Agente para atenderte las 24 horas del dia y 7 dias a la semana.</p>
      </CardContent>
    </Card>
    </>
    );
}
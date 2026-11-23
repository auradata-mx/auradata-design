'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsVertical() {
  return (
    <Tabs defaultValue="summary" orientation="vertical" className="w-full max-w-lg">
      <TabsList>
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="forecast" disabled>
          Pronóstico
        </TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="forecast">El pronóstico estará listo con 12 meses de datos.</TabsContent>
    </Tabs>
  );
}

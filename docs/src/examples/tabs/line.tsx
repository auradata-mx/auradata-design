'use client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsLine() {
  return (
    <Tabs defaultValue="summary" className="w-full max-w-md">
      <TabsList variant="line">
        <TabsTrigger value="summary">Resumen</TabsTrigger>
        <TabsTrigger value="regions">Regiones</TabsTrigger>
        <TabsTrigger value="products">Productos</TabsTrigger>
      </TabsList>
      <TabsContent value="summary">Las ventas crecieron 6 % contra septiembre.</TabsContent>
      <TabsContent value="regions">El Centro concentra la mitad de las ventas.</TabsContent>
      <TabsContent value="products">Tres productos suman el 70 %.</TabsContent>
    </Tabs>
  );
}

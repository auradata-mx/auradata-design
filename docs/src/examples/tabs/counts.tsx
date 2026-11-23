'use client';
import { Tabs, TabsContent, TabsCount, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsCounts() {
  return (
    <Tabs defaultValue="all" className="w-full max-w-md">
      <TabsList>
        <TabsTrigger value="all">
          Todos <TabsCount value={1284} />
        </TabsTrigger>
        <TabsTrigger value="mine">
          Míos <TabsCount value={12} />
        </TabsTrigger>
        <TabsTrigger value="shared">
          Compartidos <TabsCount value={140} max={99} />
        </TabsTrigger>
      </TabsList>
      <TabsContent value="all">Todos los informes del espacio.</TabsContent>
      <TabsContent value="mine">Los informes que creaste.</TabsContent>
      <TabsContent value="shared">Los informes que te compartieron.</TabsContent>
    </Tabs>
  );
}

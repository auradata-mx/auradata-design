export const blocks = [
  { name: 'app-shell', title: 'App Shell', description: 'Navegación, espacios de trabajo y barra superior de una app.' },
  { name: 'dashboard', title: 'Dashboard', description: 'Ventas por periodo: indicadores, gráficas y una tabla de clientes.' },
  { name: 'chat', title: 'Chat', description: 'Preguntas sobre tus datos, con respuestas que muestran su evidencia.' },
  { name: 'connection-form', title: 'Nueva conexión', description: 'Formulario para conectar una base de datos, con validación por campo.' },
  { name: 'login', title: 'Inicio de sesión', description: 'Acceso por correo y contraseña, con estados de espera y error.' },
  { name: 'settings', title: 'Ajustes', description: 'Perfil y preferencias de notificación en dos pestañas.' },
  { name: 'not-found', title: 'Página no encontrada', description: 'Pantalla 404 con un camino claro de vuelta al inicio.' },
] as const;

export type BlockName = (typeof blocks)[number]['name'];

export function blockPath(name: BlockName) {
  return `/docs/blocks/${name}/`;
}

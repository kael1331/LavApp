import React, { useState } from 'react';
import UserCrudPage from './pages/UserCrudPage.js';
import { Users, Code, Server, ArrowRight, ShieldCheck, Database, Layers } from 'lucide-react';

type ViewMode = 'home' | 'crud';

export default function App() {
  const [view, setView] = useState<ViewMode>('home');

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-sans p-6" id="root-container">
      <div className="max-w-4xl mx-auto">
        
        {view === 'home' ? (
          /* HOME/LANDING SCREEN - Clean & Informative */
          <div className="space-y-8 py-6" id="home-view">
            
            {/* Header */}
            <header className="border-b border-neutral-200 pb-5 text-center sm:text-left">
              <span className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-2.5 py-1 rounded-full border border-indigo-150">
                Workspace de Desarrollo Activo
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mt-3" id="main-title">
                Gestor de Usuarios Académico
              </h1>
              <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
                Un entorno simplificado diseñado para comprender la arquitectura Web modular sin saturarte de código mezclado.
              </p>
            </header>

            {/* Quick Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4" id="intro-grid">
              
              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg w-fit">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm">Estructura Modular</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Lógica organizada en módulos tipo NestJS (<code className="bg-neutral-100 p-0.5 rounded font-mono">Service</code> y <code className="bg-neutral-100 p-0.5 rounded font-mono">Controller</code> independientes).
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg w-fit">
                  <Code className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm">Frontend Aislado</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  La interfaz CRUD completa está encapsulada en la página de gestión. No contamina el archivo <code className="bg-neutral-100 p-0.5 rounded">App.tsx</code>.
                </p>
              </div>

              <div className="bg-white border border-neutral-200 rounded-xl p-5 shadow-xs space-y-2">
                <div className="p-2 bg-amber-50 text-amber-700 rounded-lg w-fit">
                  <Database className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-neutral-900 text-sm">Base de Datos Simulada</h3>
                <p className="text-xs text-neutral-500 leading-relaxed">
                  Almacena y gestiona en memoria temporal dentro del servidor Express. Preparado para conectarse a Supabase fácilmente.
                </p>
              </div>

            </div>

            {/* Interactive Visual Blueprint Card */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 shadow-xs space-y-4" id="blueprint-card">
              <div>
                <h2 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <Server className="h-4 w-4 text-indigo-500" />
                  Mapa de Navegación y Flujo de Datos
                </h2>
                <p className="text-xs text-neutral-400">
                  Visualiza cómo interactúan los archivos y capas que acabamos de estructurar
                </p>
              </div>

              <div className="bg-neutral-900 text-neutral-300 font-mono text-xs p-4 rounded-lg overflow-x-auto border border-neutral-800 leading-relaxed shadow-inner">
{` [ Vista Principal: App.tsx ] 
         │ (Selección simple de vista en estado React)
         ▼
 [ Vista CRUD: UserCrudPage.tsx ] <───(Tipos / DTOs compartidos)───> [ Backend: server.ts ]
         │ (Formularios e Interfaces)                                    │ (Body Parser / Middlewares)
         ▼                                                               ▼
  Llamadas HTTP fetch() a '/api/users'                            [ UsersModule ]
                                                                    ├── UsersController (Adapta a Express)
                                                                    └── UsersService (Base de Datos en Memoria)`}
              </div>
            </div>

            {/* Action Section */}
            <div className="flex flex-col sm:flex-row items-center justify-between bg-neutral-900 text-white rounded-xl p-6 gap-4" id="action-banner">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-semibold text-sm flex items-center justify-center sm:justify-start gap-1.5 text-neutral-200">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  Listo para Interactuar
                </h3>
                <p className="text-xs text-neutral-400">
                  Presiona el botón para navegar a la sección de administración del CRUD.
                </p>
              </div>
              <button
                onClick={() => setView('crud')}
                id="btn-navigate-crud"
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white text-neutral-900 hover:bg-neutral-100 font-semibold text-xs py-2.5 px-4 rounded-lg transition-colors cursor-pointer shadow-sm shrink-0"
              >
                Gestionar Usuarios (CRUD)
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        ) : (
          /* CALLED CRUD MODULE SCREEN */
          <div className="py-6" id="crud-view">
            <UserCrudPage onBack={() => setView('home')} />
          </div>
        )}

        {/* Humbler Footer */}
        <footer className="border-t border-neutral-200 mt-10 pt-4 text-center text-[11px] text-neutral-400 font-mono" id="app-footer">
          Puerto Ingress: 3000 • Hot Reloading Desactivado • Node Express Server de Soporte
        </footer>

      </div>
    </div>
  );
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getTenantSlugFromHost } from './utils/tenant';
import { useAuthListener } from './hooks/useAuthListener';
import { useAuthStore } from './store/authStore';

import { WorkOrdersPage } from './features/work-orders/components/WorkOrdersPage';
import { OnboardingForm } from './features/auth/components/OnboardingForm';
import { LoginForm } from './features/auth/components/LoginForm';
import { EquipmentPage } from './features/equipment/components/EquipmentPage';
import { AppLayout } from './layouts/AppLayout';
import { DashboardPage } from './features/dashboard/components/DashboardPage';

export default function App() {
  // Ativa o ouvinte de sessão do Supabase
  useAuthListener();
  
  const isInitialized = useAuthStore((state) => state.isInitialized);
  const user = useAuthStore((state) => state.user);
  const tenantSlug = getTenantSlugFromHost();

  // 1. Tela de carregamento enquanto valida o cache do usuário
  if (!isInitialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <span className="text-slate-500 animate-pulse">Carregando sistema...</span>
      </div>
    );
  }

  // 2. ROTA PÚBLICA (Onboarding/Cadastro Institucional)
  if (!tenantSlug) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <OnboardingForm />
      </div>
    );
  }

  // 3. ROTA DO CLIENTE: NÃO LOGADO (Exibe o form de login)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-indigo-50 p-4">
        <LoginForm tenantSlug={tenantSlug} />
      </div>
    );
  }

  // 4. ROTA DO CLIENTE: LOGADO (Injeta o Roteador e o Layout Base)
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          
          <Route path="/" element={<DashboardPage />} />
          
          <Route path="/equipment" element={<EquipmentPage />} />

          <Route path="/work-orders" element={<WorkOrdersPage />} />
          
          <Route path="/settings" element={
            <div className="text-slate-600 font-medium">Configurações da Clínica (Em construção...)</div>
          } />
          
          {/* Fallback: Se digitar uma URL que não existe, volta pro painel */}
          <Route path="*" element={<Navigate to="/" replace />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
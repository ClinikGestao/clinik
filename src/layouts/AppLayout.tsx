import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Stethoscope, Wrench, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { getTenantSlugFromHost } from '@/utils/tenant';

export function AppLayout() {
  const { user, signOut } = useAuthStore();
  const tenantSlug = getTenantSlugFromHost();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Equipamentos', href: '/equipment', icon: Stethoscope },
    { name: 'Ordens de Serviço', href: '/work-orders', icon: Wrench },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar (Desktop) */}
      <aside className="hidden w-64 flex-col bg-slate-900 text-slate-300 transition-all md:flex">
        <div className="flex h-16 items-center px-6 bg-slate-950">
          <span className="truncate text-lg font-bold text-white">
            {tenantSlug?.toUpperCase()}
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors ${
                  isActive
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="bg-slate-950 p-4">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-400 transition-colors hover:bg-slate-800 hover:text-red-300"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair do sistema</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-4">
            <button
              className="text-slate-500 hover:text-slate-700 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu size={24} />
            </button>
            <h1 className="hidden text-xl font-semibold text-slate-800 sm:block">
              Visão Geral
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-700">{user?.email}</p>
              <p className="text-xs capitalize text-slate-500">
                {user?.user_metadata?.role_profile?.replace('_', ' ')}
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-indigo-100 font-bold text-indigo-700">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
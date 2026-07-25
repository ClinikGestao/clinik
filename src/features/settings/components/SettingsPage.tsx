import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Palette, Save } from 'lucide-react';
import { settingsSchema } from '../schemas/settingsSchema';
import type { SettingsFormInputs } from '../schemas/settingsSchema';
import { useTenantSettings, useUpdateSettings } from '../hooks/useSettings';

export function SettingsPage() {
  const { data: tenant, isLoading } = useTenantSettings();
  const updateMutation = useUpdateSettings();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<SettingsFormInputs>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: '',
      primaryColor: '#4f46e5',
    }
  });

  useEffect(() => {
    if (tenant) {
      const theme = tenant.theme_colors as { primary?: string } | null;
      reset({
        name: tenant.name,
        primaryColor: theme?.primary || '#4f46e5',
      });
    }
  }, [tenant, reset]);

  const onSubmit = (data: SettingsFormInputs) => {
    updateMutation.mutate(data, {
      onSuccess: () => {
        alert('Configurações salvas com sucesso!');
      }
    });
  };

  const currentColor = watch('primaryColor');

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center animate-pulse text-slate-500">
        Carregando configurações...
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Configurações da Clínica</h1>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          
          <div>
            <h2 className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-2 text-lg font-semibold text-slate-800">
              <Building size={20} className="text-indigo-600" />
              Informações Gerais
            </h2>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Nome da Clínica</label>
                <input 
                  {...register('name')} 
                  className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" 
                />
                {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Slug (Subdomínio)</label>
                <input 
                  value={tenant?.slug || ''} 
                  disabled
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-slate-500 shadow-sm" 
                />
                <p className="mt-1 text-xs text-slate-400">O slug (URL) não pode ser alterado.</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">ID de Identificação (Tenant ID)</label>
                <input 
                  value={tenant?.id || ''} 
                  disabled
                  className="mt-1 block w-full rounded-md border border-slate-200 bg-slate-50 p-2 text-xs font-mono text-slate-500 shadow-sm" 
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="mb-4 mt-4 flex items-center gap-2 border-b border-slate-100 pb-2 text-lg font-semibold text-slate-800">
              <Palette size={20} className="text-indigo-600" />
              Personalização Visual
            </h2>
            
            <div>
              <label className="block text-sm font-medium text-slate-700">Cor Principal (Tema)</label>
              <div className="mt-2 flex items-center gap-3">
                <input 
                  type="color" 
                  {...register('primaryColor')} 
                  className="h-10 w-10 cursor-pointer rounded border border-slate-300 p-0 shadow-sm"
                />
                <input 
                  type="text" 
                  {...register('primaryColor')} 
                  className="block rounded-md border border-slate-300 p-2 font-mono text-sm uppercase shadow-sm" 
                />
              </div>
              {errors.primaryColor && <p className="mt-1 text-xs text-red-500">{errors.primaryColor.message}</p>}
              
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-600">
                Exemplo de uso: 
                <span 
                  className="rounded-full px-3 py-1 text-xs font-medium text-white shadow-sm"
                  style={{ backgroundColor: currentColor }}
                >
                  Botão Primário
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-slate-100 pt-6">
            <button 
              type="submit" 
              disabled={updateMutation.isPending}
              className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              <Save size={18} />
              {updateMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
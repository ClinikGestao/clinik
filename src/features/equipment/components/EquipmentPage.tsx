import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Activity, Wrench, Ban } from 'lucide-react';
import { equipmentSchema } from '../schemas/equipmentSchemas';
import type { EquipmentFormInputs } from '../schemas/equipmentSchemas';
import { useEquipments, useCreateEquipment } from '../hooks/useEquipment';

export function EquipmentPage() {
  const { data: equipments, isLoading, error } = useEquipments();
  const createMutation = useCreateEquipment();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EquipmentFormInputs>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: {
      status: 'active', // O valor inicial agora mora aqui
    }
  });

  const onSubmit = (data: EquipmentFormInputs) => {
    createMutation.mutate(data, {
      onSuccess: () => reset(),
    });
  };

  const statusConfig = {
    active: { label: 'Ativo', icon: Activity, color: 'text-green-600 bg-green-100' },
    maintenance: { label: 'Em Manutenção', icon: Wrench, color: 'text-amber-600 bg-amber-100' },
    inactive: { label: 'Inativo', icon: Ban, color: 'text-slate-600 bg-slate-100' },
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Equipamentos</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Formulário de Cadastro */}
        <div className="lg:col-span-1">
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-800">
              <Plus size={20} className="text-indigo-600" />
              Novo Equipamento
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700">Nome / Modelo</label>
              <input {...register('name')} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm" placeholder="Ex: Raio-X Digital" />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Categoria</label>
              <input {...register('category')} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm" placeholder="Ex: Imagem" />
              {errors.category && <p className="mt-1 text-xs text-red-500">{errors.category.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Número de Série</label>
              <input {...register('serial_number')} className="mt-1 block w-full rounded-md border border-slate-300 p-2 shadow-sm" placeholder="Ex: RX-2023-998" />
              {errors.serial_number && <p className="mt-1 text-xs text-red-500">{errors.serial_number.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Status Inicial</label>
              <select {...register('status')} className="mt-1 block w-full rounded-md border border-slate-300 bg-white p-2 shadow-sm">
                <option value="active">Ativo</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="inactive">Inativo</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={createMutation.isPending}
              className="mt-4 w-full rounded-md bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
            >
              {createMutation.isPending ? 'Salvando...' : 'Cadastrar Equipamento'}
            </button>
            {createMutation.isError && (
              <p className="text-center text-xs text-red-500">Erro ao salvar: {createMutation.error.message}</p>
            )}
          </form>
        </div>

        {/* Lista de Equipamentos */}
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-800">Cadastrados Recentemente</h3>
            </div>
            
            <div className="p-4">
              {isLoading ? (
                <p className="animate-pulse py-8 text-center text-slate-500">Carregando equipamentos...</p>
              ) : error ? (
                <p className="py-8 text-center text-red-500">Erro ao carregar dados.</p>
              ) : equipments?.length === 0 ? (
                <p className="py-8 text-center text-slate-500">Nenhum equipamento cadastrado ainda.</p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {equipments?.map((eq) => {
                    const status = eq.status as keyof typeof statusConfig;
                    const config = statusConfig[status] || statusConfig.active;
                    const StatusIcon = config.icon;

                    return (
                      <li key={eq.id} className="flex items-center justify-between rounded-md px-2 py-4 transition-colors hover:bg-slate-50">
                        <div>
                          <p className="font-medium text-slate-800">{eq.name}</p>
                          <p className="font-mono text-sm text-slate-500">
                            Cat: {eq.category} | SN: {eq.serial_number}
                          </p>
                        </div>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
                          <StatusIcon size={14} />
                          {config.label}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
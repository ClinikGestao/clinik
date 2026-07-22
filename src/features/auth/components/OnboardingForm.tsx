import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/config/supabase';
import { onboardingSchema, type OnboardingFormInputs } from '../schemas/authSchemas';
import { useState } from 'react';

export function OnboardingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardingFormInputs>({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (data: OnboardingFormInputs) => {
    setIsLoading(true);
    setErrorMsg('');

    // A MÁGICA ACONTECE AQUI: Chamamos a API de Auth enviando os dados do Tenant
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          tenant_name: data.clinicName,
          tenant_slug: data.slug,
          role_profile: 'tenant_admin',
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      // Como estamos no ambiente local, vamos forçar o redirecionamento 
      // simulando a ida para o subdomínio criado.
      window.location.href = `http://${data.slug}.localhost:5173`;
    }
    
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 mb-4">Cadastre sua Clínica</h2>
      
      {errorMsg && <p className="text-sm text-red-500 bg-red-50 p-2 rounded">{errorMsg}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700">Nome da Clínica</label>
        <input {...register('clinicName')} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" placeholder="Hospital São Lucas" />
        {errors.clinicName && <p className="text-xs text-red-500 mt-1">{errors.clinicName.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Subdomínio (URL)</label>
        <div className="flex items-center mt-1">
          <input {...register('slug')} className="block w-full rounded-l-md border-slate-300 shadow-sm border p-2 text-right" placeholder="sao-lucas" />
          <span className="bg-slate-100 border border-l-0 border-slate-300 text-slate-500 rounded-r-md px-3 py-2 text-sm">.klinic.com</span>
        </div>
        {errors.slug && <p className="text-xs text-red-500 mt-1">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">E-mail do Administrador</label>
        <input {...register('email')} type="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Senha</label>
        <input {...register('password')} type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <button disabled={isLoading} type="submit" className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50">
        {isLoading ? 'Criando ambiente...' : 'Criar Conta'}
      </button>
    </form>
  );
}
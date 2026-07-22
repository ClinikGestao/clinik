import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { supabase } from '@/config/supabase';
import { loginSchema, type LoginFormInputs } from '../schemas/authSchemas';
import { useState } from 'react';

export function LoginForm({ tenantSlug }: { tenantSlug: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormInputs) => {
    setIsLoading(true);
    setErrorMsg('');

    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) {
      setErrorMsg('Credenciais inválidas.');
    }
    
    // Se der sucesso, não precisamos fazer nada! O nosso `useAuthListener` 
    // vai capturar a mudança de sessão e atualizar o Zustand automaticamente.
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-slate-800 text-center mb-2">Acesso Restrito</h2>
      <p className="text-sm text-slate-500 text-center mb-4">Você está acessando: <strong className="text-indigo-600">{tenantSlug}</strong></p>
      
      {errorMsg && <p className="text-sm text-red-500 bg-red-50 p-2 rounded text-center">{errorMsg}</p>}

      <div>
        <label className="block text-sm font-medium text-slate-700">E-mail</label>
        <input {...register('email')} type="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Senha</label>
        <input {...register('password')} type="password" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm border p-2" />
        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
      </div>

      <button disabled={isLoading} type="submit" className="mt-4 bg-slate-900 text-white py-2 px-4 rounded-md hover:bg-slate-800 disabled:opacity-50">
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}
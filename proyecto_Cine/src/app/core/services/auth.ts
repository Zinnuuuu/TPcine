import { inject, Service } from '@angular/core';
import { Supabase } from './supabase';

@Service()
export class Auth {
    private supabase = inject(Supabase);
    

    async getRol(): Promise<string | null> {
        const {data: {session }} = await this.supabase.cliente.auth.getSession();
        if (!session) return null;

        const {data} = await this.supabase.cliente
            .from('Usuarios')
            .select('rol')
            .eq('id', session.user.id)
            .single();

        return data?.rol ?? null;
    }
}
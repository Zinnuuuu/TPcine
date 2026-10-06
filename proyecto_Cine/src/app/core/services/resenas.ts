import { Service, inject } from '@angular/core';
import { Supabase } from './supabase';

export interface ResumenRating {
    promedio: number;
    cantidad: number;
}

@Service()
export class Resenas {
    private supabase = inject(Supabase);

    // Promedio y cantidad de reseñas
    async promedios(): Promise<Map<string, ResumenRating>> {
        const { data } = await this.supabase.cliente.from('peliculas_rating').select('*');
        return new Map(
            (data ?? []).map((r: any) => [
                r.pelicula_id,
                { promedio: Number(r.promedio), cantidad: Number(r.cantidad) }
            ] as [string, ResumenRating])
        );
    }
}
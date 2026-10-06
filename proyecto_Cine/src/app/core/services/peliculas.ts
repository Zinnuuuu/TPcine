import { Service, inject} from '@angular/core';
import {Supabase} from './supabase';

export interface Pelicula {
    id?: string;
    nombre: string;
    descripcion: string;
    duracion_min: number;
    clasificacion_edad: string;
    imagen_url: string;
}

@Service()
export class Peliculas{
    private supabase = inject(Supabase);

    async listar(){
        const { data: peliculas, error } = await this.supabase.cliente
            .from('Peliculas')
            .select('*');
        if (error || !peliculas) return { data: null, error };

        const { data: relaciones } = await this.supabase.cliente
            .from('pelicula_generos')
            .select('pelicula_id, generos(*)');

        const peliculasConGeneros = peliculas.map(p => ({
            ...p,
            generos: (relaciones ?? [])
                .filter((r: any) => r.pelicula_id === p.id)
                .map((r: any) => r.generos)
        }));

        return { data: peliculasConGeneros, error: null };
    }

    async obtener(id: string){
        const { data: pelicula, error } = await this.supabase.cliente
            .from('Peliculas')
            .select('*')
            .eq('id', id)
            .single();
        if (error || !pelicula) return { data: null, error };

        const { data: relaciones } = await this.supabase.cliente
            .from('pelicula_generos')
            .select('generos(*)')
            .eq('pelicula_id', id);

        return { data: { ...pelicula, generos: (relaciones ?? []).map((r: any) => r.generos) }, error: null };
    }


    async listarGeneros(){
        return this.supabase.cliente
            .from('Generos')
            .select('*');
    }

    async crear(pelicula: Pelicula, generosId: string[]){
        const {data, error} = await this.supabase.cliente
            .from('Peliculas')
            .insert(pelicula)
            .select()
            .single();
        if (error || !data) return {error};

        const filas = generosId.map(generoId => ({pelicula_id: data.id, genero_id: generoId}));
        return this.supabase.cliente
            .from('pelicula_generos')
            .insert(filas);
    }

    async actualizar(id: string, pelicula: Pelicula, generosId: string[]){
        const {error} = await this.supabase.cliente
            .from('Peliculas')
            .update(pelicula)
            .eq('id', id);
        if (error) return {error};

        await this.supabase.cliente
            .from('pelicula_generos')
            .delete()
            .eq('pelicula_id', id);
        const filas = generosId.map(generoId => ({pelicula_id: id, genero_id: generoId}))
        return this.supabase.cliente
            .from('pelicula_generos')
            .insert(filas);
    }

    async eliminar(id: string){
        return this.supabase.cliente
            .from('Peliculas')
            .delete()
            .eq('id', id);
    }

    async masVendidas(limite = 3): Promise<string[]> {
        const { data, error } = await this.supabase.cliente.rpc('peliculas_mas_vendidas', { limite });
        if (error || !data) return [];
        return data.map((r: any) => r.pelicula_id);
    }
}

import { Service, inject } from '@angular/core';
import { Supabase } from './supabase';

export interface DatosFuncion {
    pelicula_id: string;
    formato: string;
    idioma: string;
    precio: number;
    precio_preventa: number | null;
    fecha_inicio_preventa: string | null; 
}

@Service()
export class Funciones {
    private supabase = inject(Supabase);

    async listar() {
        return this.supabase.cliente
            .from('Funciones')
            .select('*, Peliculas(nombre, duracion_min), Salas(nombre)')
            .order('horario');
    }

    async crear (datos: DatosFuncion, horarios: string[]) {
        const {data: pelicula} = await this.supabase.cliente
            .from('Peliculas')
            .select('duracion_min')
            .eq('id', datos.pelicula_id)
            .single();
        if (!pelicula) 
            return {error: {message: 'No se encontró la película'}};
    
        const {data: salas} = await this.supabase.cliente
            .from('Salas')
            .select('id');
        const {data: existentes} = await this.supabase.cliente
            .from('Funciones')
            .select('horario, sala_id, Peliculas(duracion_min)');
        
        const yaUsadas: any[] = [...(existentes ?? [])];
        const resultados: {horario: string; asignada: boolean}[] = [];

        for (const horario of horarios) {
            const salaId = this.buscarSalaDisponible(salas ?? [], yaUsadas, new Date(horario), pelicula.duracion_min);

            if (!salaId) {
                resultados.push({horario , asignada: false});
                continue;
            }

            const {error} = await this.supabase.cliente
                .from('Funciones')
                .insert({
                    ...datos,
                    horario,
                    sala_id: salaId
                });
            if (error) {
                console.error('Error al crear la función:', error);
                return {error};
            }
            yaUsadas.push({sala_id: salaId, horario, Peliculas: {duracion_min: pelicula.duracion_min}});
            resultados.push({horario , asignada: true});
        }
        return {resultados};
    }

    private buscarSalaDisponible(salas: any[], funcionesExistentes: any[], nuevoInicio: Date, duracionPelicula: number): string | null{
        const nuevoFin = new Date(nuevoInicio.getTime() + (duracionPelicula +30) * 60000); // 30 minutos de limpieza

        for (const sala of salas) {
            const salaActual = funcionesExistentes.filter(f => f.sala_id === sala.id);
            const hayConflicto = salaActual.some(f => {
                const inicioExistente = new Date(f.horario);
                const finExistente = new Date(inicioExistente.getTime() + ((f.Peliculas?.duracion_min ?? 0) + 30) * 60000);
                return nuevoInicio < finExistente && inicioExistente < nuevoFin; 
            });
            if (!hayConflicto) {
                return sala.id;
            }
        }
        return null;
    }
}



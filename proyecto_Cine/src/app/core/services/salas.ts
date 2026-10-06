import { Service, inject } from '@angular/core';
import { Supabase } from './supabase';

interface Butaca {
    fila : string;
    numero : number;
    tipo: 'normal' | 'discapacitados' | 'vip';
    sala_id: string;
}

const FILAS_NORMALES = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'L', 'M', 'N', 'O', 'P', 'Q'];
const FILAS_DISCAPACITADOS = ['J', 'K'];
const FILAS_VIP = ['R', 'S', 'T'];

@Service()
export class Salas {
    private supabase = inject(Supabase);

    async listar() {
        return this.supabase.cliente
            .from('Salas')
            .select('*');
    }

    async crear(nombre: string){
        const {data: sala, error} = await this.supabase.cliente
            .from('Salas')
            .insert({nombre})
            .select()
            .single();
        if (error || !sala) return {error};
        
        const butacas: Butaca[] = [];
        for (const fila of FILAS_NORMALES) this.agregarFila(butacas, fila , [4, 20 , 4], 'normal', sala.id);
        for (const fila of FILAS_DISCAPACITADOS) this.agregarFila(butacas, fila , [2, 10 , 2], 'discapacitados', sala.id);
        for (const fila of FILAS_VIP) this.agregarFila(butacas, fila , [4, 20 , 4], 'vip', sala.id);
        
        return this.supabase.cliente
            .from('Butacas')
            .insert(butacas);
        }

    private agregarFila(butacas: Butaca[], fila: string, secciones: number[], tipo: Butaca['tipo'], sala_id: string) {
        let numero = 1;
        for (const cantidad of secciones) {
            for (let i = 0; i < cantidad; i++) {
                butacas.push({fila, numero, tipo, sala_id});
                numero++;
            }
        }
    }

    async eliminar(id: string) {
        await this.supabase.cliente //CARGAR BUTACAS
            .from('Butacas')
            .delete()
            .eq('sala_id', id);
        return this.supabase.cliente // CARGAR SALA
            .from('Salas')
            .delete()
            .eq('id', id);
    }
}
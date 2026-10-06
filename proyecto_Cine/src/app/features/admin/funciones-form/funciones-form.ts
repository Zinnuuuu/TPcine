import { Component,inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import { Funciones } from '../../../core/services/funciones';
import { Peliculas } from '../../../core/services/peliculas';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-funciones-form',
  styleUrl: './funciones-form.scss',
  templateUrl: './funciones-form.html',
})
export class FuncionesForm implements OnInit{
  private funcionesService = inject(Funciones);
  private peliculasService = inject(Peliculas)
  private router = inject(Router);
  private fb = inject(FormBuilder);

  peliculas = signal<any[]>([]);
  horariosAgregados = signal<string[]>([]);

  formulario = this.fb.group({
    pelicula_id: ['', Validators.required],
    formato: ['2D', Validators.required],
    idioma: ['', Validators.required],
    precio: [0, Validators.required],
    precio_preventa: [null as number | null],
    fecha_inicio_preventa: [null as string | null],
    nuevaFecha: [''],
    nuevaHora: ['']
  });

  resultados: {horario: string; asignada: boolean}[] = [];

  async ngOnInit(){
    const {data} = await this.peliculasService.listar();
    console.log('Peliculas:', data, 'Error:', Error);
    this.peliculas.set(data ?? []);
  }

  agregarHorario(){
    const {nuevaFecha, nuevaHora} = this.formulario.value;
    if(!nuevaFecha || !nuevaHora){
      alert('Debe ingresar una fecha y hora validas');
      return;
    }

    const [anio, mes, dia] = nuevaFecha.split('-').map(Number);
    const [hora, minuto] = nuevaHora.split(':').map(Number);  
    const fecha = new Date(anio, mes - 1, dia, hora, minuto);

    if (isNaN(fecha.getTime())) {
      alert('Fecha u hora invalida, intente nuevamente.');
      return;
    }

    this.horariosAgregados.update(lista => [...lista, fecha.toISOString()]);
    this.formulario.patchValue({nuevaFecha: ''  , nuevaHora: ''});
    }

  quitarHorario(horario: string){
    this.horariosAgregados.update(lista => lista.filter(h => h !== horario));
  }

  async guardar(){
    if (this.formulario.invalid) {
    alert('Completa todos los campos obligatorios (pelicula, formato, idioma, precio).');
    return;
  }
    if (this.horariosAgregados().length === 0) {
    alert('Agregá al menos un horario antes de crear la función.');
    return;
  }
    const v = this.formulario.value;

  //   console.log('Enviando:', {
  //   pelicula_id: v.pelicula_id,                    TEST ERROR
  //   formato: v.formato,
  //   idioma: v.idioma,
  //   precio: v.precio,
  //   precio_preventa: v.precio_preventa,
  //   fecha_inicio_preventa: v.fecha_inicio_preventa
  // });
    
    const {resultados, error} =await this.funcionesService.crear({
      pelicula_id: v.pelicula_id!,
      formato: v.formato!,
      idioma: v.idioma!,
      precio: v.precio!,
      precio_preventa: v.precio_preventa ?? null,
      fecha_inicio_preventa: v.fecha_inicio_preventa ?? null
    }, this.horariosAgregados());

    if(error){
      alert(error.message);
      return;
    }
    this.resultados = resultados ?? [];
    
    if(this.resultados.every(r => r.asignada)){
      this.router.navigate(['/admin/funciones']);
    }
  }
}

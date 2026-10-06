import { Component,inject, OnInit} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Peliculas} from '../../../core/services/peliculas';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-peliculas-formulario',
  styleUrl: './peliculas-formulario.scss',
  templateUrl: './peliculas-formulario.html',
})

export class PeliculasFormulario implements OnInit{
  private peliculasService = inject(Peliculas);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    nombre: ['', Validators.required],
    descripcion: ['', Validators.required],
    duracion_min: [0, Validators.required],
    clasificacion_edad: ['Sin restricción', Validators.required],
    imagen_url: ['']
  });

  generosDisponibles: any[] = [];
  generosSeleccionados: string[] = []
  idEditar: string | null = null;

  async ngOnInit() {
    const {data: generos} = await this.peliculasService.listarGeneros();
    this.generosDisponibles = generos ?? [];

    this.idEditar = this.route.snapshot.paramMap.get('id');
    if (this.idEditar) {
      const {data} = await this.peliculasService.obtener(this.idEditar);
      if (data) {
        this.formulario.patchValue(data);
        this.generosSeleccionados = data.generos.map((g: any) => g.id);
      }
    }
  }

  toggleGenero(id: string, marcado: boolean) {
    if (marcado){
      this.generosSeleccionados.push(id);
    } else {
      this.generosSeleccionados = this.generosSeleccionados.filter((g: string) => g !== id);
    }
  }

  async guardar() {
    if (this.formulario.invalid) return;
    const pelicula = this.formulario.value as any; 

    const resultado = this.idEditar 
      ? await this.peliculasService.actualizar(this.idEditar, pelicula, this.generosSeleccionados) 
      : await this.peliculasService.crear(pelicula, this.generosSeleccionados);
    
    if (resultado.error) {
      alert('Error al guardar la película' + resultado.error.message);
      return;
    }
    
    this.router.navigate(['/admin/peliculas']);
  }
}

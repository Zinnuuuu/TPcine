import { Component, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { Salas } from '../../../core/services/salas';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-salas-form',
  styleUrl: './salas-form.scss',
  templateUrl: './salas-form.html',
})

export class SalasForm {
  private salasService = inject(Salas);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  formulario = this.fb.group({
    nombre: ['', Validators.required]
  });

  async guardar(){
    if( this.formulario.invalid) return;
    const {error} = await this.salasService.crear(this.formulario.value.nombre!);
    if(error) {
      alert('Error al crear la sala' + error.message);
      return;
    }
    this.router.navigate(['/admin/salas']);
  }
}

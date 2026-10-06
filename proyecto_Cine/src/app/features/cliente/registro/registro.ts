import { Component, inject } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Supabase} from '../../../core/services/supabase';


@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-registro',
  styleUrl: './registro.scss',
  templateUrl: './registro.html',
})
export class Registro {
  private supabase = inject(Supabase);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  // Formulario de registro con validaciones generales
  formulario = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required, Validators.minLength(5)]],
    nombre: ['',[Validators.required]],
    apellido: ['',[Validators.required]],
    fechaNacimiento: ['',[Validators.required]],
    tipoSangre: [''], 
    colorOjos: [''],
    diasVacaciones: [0]
  });
  
  error = '';

  async registrar(){
    if (this.formulario.invalid) return;
    const {email, password, nombre, apellido, fechaNacimiento, tipoSangre, colorOjos, diasVacaciones} = this.formulario.value;
    
    const {data, error} = await this.supabase.cliente.auth.signUp({
      email: email!,
      password: password!, 
    });
    if (error || !data.user) {
      this.error = error?.message ?? 'No se pudo crear la cuenta';
      return;}
  
      const {error: errorPerfil} = await this.supabase.cliente.from('Usuarios').insert({
        id: data.user.id,
        email: email,
        nombre: nombre,
        apellido: apellido,
        fecha_nacimiento: fechaNacimiento,
        tipo_sangre: tipoSangre,
        color_ojos: colorOjos,
        dias_vacaciones: diasVacaciones,
        rol: 'cliente'
      });
      if (errorPerfil) {this.error = errorPerfil.message; return;}
      this.router.navigate(['/']);
    }
  }

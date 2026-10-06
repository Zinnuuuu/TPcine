import { Component , inject} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Supabase} from '../../../core/services/supabase';

@Component({
  imports: [ReactiveFormsModule],
  selector: 'app-login',
  styleUrl: './login.scss',
  templateUrl: './login.html',
})
export class Login {
  private supabase = inject(Supabase);
  private router = inject(Router);
  private fb  = inject(FormBuilder);

  formulario = this.fb.group({
    email: ['',[Validators.required, Validators.email]],
    password: ['',[Validators.required]]
  });

  error = '';

  async ingresar(){
    if (this.formulario.invalid) return;
    const {email, password} = this.formulario.value;

    const {error} = await this.supabase.cliente.auth.signInWithPassword({
      email: email!,
      password: password!
    });
    if (error) {this.error = error.message; return;}

    this.router.navigate(['/']);
  }
}


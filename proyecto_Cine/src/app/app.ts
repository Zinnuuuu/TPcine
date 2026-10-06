import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Supabase } from './core/services/supabase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})

export class App implements OnInit {
  private supabase = inject(Supabase); 

  ngOnInit(): void {
    this.supabase.cliente 
      .from('Generos')
      .select('*')
      .then(({data, error}) => {
        console.log('Datos' , data);
        console.log('Error' , error);
      });
  }
}

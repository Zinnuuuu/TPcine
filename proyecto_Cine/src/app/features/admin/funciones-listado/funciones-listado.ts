import { Component, inject, OnInit, signal} from '@angular/core';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import { Funciones } from '../../../core/services/funciones';

@Component({
  imports: [DatePipe],
  selector: 'app-funciones-listado',
  styleUrl: './funciones-listado.scss',
  templateUrl: './funciones-listado.html',
})
export class FuncionesListado implements OnInit {
  private funcionesService = inject(Funciones);
  private router = inject(Router);
  funciones = signal<any[]>([]);

  async ngOnInit() {
    const {data} = await this.funcionesService.listar();
    this.funciones.set(data ?? []);
  }

  nueva(){
    this.router.navigate(['/admin/funciones/nueva']);
  }
}

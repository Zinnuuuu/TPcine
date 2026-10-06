import { Component, OnInit , inject, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Peliculas} from '../../../core/services/peliculas';


@Component({
  imports: [],
  selector: 'app-peliculas-listado',
  styleUrl: './peliculas-listado.scss',
  templateUrl: './peliculas-listado.html',
})
export class PeliculasListado implements OnInit {
  private peliculasService = inject(Peliculas);
  private router = inject(Router)
  peliculas = signal<any[]>([]);

  async ngOnInit(){
    const {data} = await this.peliculasService.listar();
    this.peliculas.set(data ?? []);
  }

  nueva(){
    this.router.navigate(['/admin/peliculas/nueva']);
  }

  editar(id: string){
    this.router.navigate(['/admin/peliculas/editar', id]);
  }

  async eliminar(id: string){
    if(!confirm('¿Esta seguro que desea eliminar la pelicula?'))
      return;
    await this.peliculasService.eliminar(id);
    this.peliculas.update(lista => lista.filter(p => p.id !== id));
  }
}

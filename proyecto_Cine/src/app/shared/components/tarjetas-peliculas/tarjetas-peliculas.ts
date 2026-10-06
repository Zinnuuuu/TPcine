import { Component, input, signal } from '@angular/core';
import { ResumenRating } from '../../../core/services/resenas';

@Component({
  selector: 'app-tarjetas-peliculas',
  styleUrl: './tarjetas-peliculas.scss',
  templateUrl: './tarjetas-peliculas.html',
})
export class TarjetasPeliculas {
  pelicula = input.required<any>();
  rating = input<ResumenRating | null>(null);
  puesto = input<number | null>(null);
  destacada = input(false);
  imagenRota = signal(false);
}
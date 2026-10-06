import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { Peliculas } from '../../../core/services/peliculas';
import { Resenas, ResumenRating } from '../../../core/services/resenas';
import { TarjetasPeliculas } from '../../../shared/components/tarjetas-peliculas/tarjetas-peliculas';

const normalizar = (t: string) => t.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

@Component({
  imports: [TarjetasPeliculas],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
})
export class Home implements OnInit {
  private peliculasService = inject(Peliculas);
  private resenasService = inject(Resenas);

  peliculas = signal<any[]>([]);
  generos = signal<any[]>([]);
  ratings = signal<Map<string, ResumenRating>>(new Map());
  topIds = signal<string[]>([]);
  cargando = signal(true);

  busqueda = signal('');
  generosActivos = signal<Set<string>>(new Set());

  // Si todavía no hay ventas registradas, muestra las primeras 3 como reemplazo
  masVendidas = computed(() => {
    const todas = this.peliculas();
    const top = this.topIds().map(id => todas.find(p => p.id === id)).filter(Boolean);
    return (top.length ? top : todas).slice(0, 3);
  });

  filtradas = computed(() => {
    const q = normalizar(this.busqueda().trim());
    const activos = this.generosActivos();
    return this.peliculas().filter(p => {
      const texto = normalizar(`${p.nombre} ${p.generos.map((g: any) => g.nombre).join(' ')}`);
      const coincideTexto = !q || texto.includes(q);
      const coincideGenero = activos.size === 0 || p.generos.some((g: any) => activos.has(g.id));
      return coincideTexto && coincideGenero;
    });
  });

  async ngOnInit() {
    const [pel, gen, ratings, top] = await Promise.all([
      this.peliculasService.listar(),
      this.peliculasService.listarGeneros(),
      this.resenasService.promedios(),
      this.peliculasService.masVendidas(),
    ]);
    this.peliculas.set((pel.data ?? []).map((p: any) => ({ ...p, generos: (p.generos ?? []).filter(Boolean) })));
    this.generos.set(gen.data ?? []);
    this.ratings.set(ratings);
    this.topIds.set(top);
    this.cargando.set(false);
  }

  toggleGenero(id: string) {
    this.generosActivos.update(set => {
      const nuevo = new Set(set);
      nuevo.has(id) ? nuevo.delete(id) : nuevo.add(id);
      return nuevo;
    });
  }

  limpiarFiltros() {
    this.busqueda.set('');
    this.generosActivos.set(new Set());
  }
}
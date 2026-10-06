import { Component ,inject , OnInit, signal} from '@angular/core';
import {Router} from '@angular/router';
import {Salas} from '../../../core/services/salas';

@Component({
  imports: [],
  selector: 'app-salas-listado',
  styleUrl: './salas-listado.scss',
  templateUrl: './salas-listado.html',
})
export class SalasListado implements OnInit {
  private salasService = inject(Salas);
  private router = inject(Router);
  salas = signal<any[]>([]);  

  async ngOnInit(){
    const {data} = await this.salasService.listar()
    this.salas.set(data ?? []);
  }

  nueva(){
    this.router.navigate(['/admin/salas/nueva'])
  }

  async eliminar(id:string){
    if(!confirm ('¿Desea eliminar esta sala y todas sus butacas?'))
      return;
    await this.salasService.eliminar(id);
    this.salas.update(lista => lista.filter(s => s.id !== id));
  }
}

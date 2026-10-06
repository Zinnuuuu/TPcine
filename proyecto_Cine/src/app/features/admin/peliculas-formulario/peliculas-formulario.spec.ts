import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculasFormulario } from './peliculas-formulario';

describe('PeliculasFormulario', () => {
  let component: PeliculasFormulario;
  let fixture: ComponentFixture<PeliculasFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculasFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculasFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

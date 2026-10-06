import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PeliculasListado } from './peliculas-listado';

describe('PeliculasListado', () => {
  let component: PeliculasListado;
  let fixture: ComponentFixture<PeliculasListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeliculasListado],
    }).compileComponents();

    fixture = TestBed.createComponent(PeliculasListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

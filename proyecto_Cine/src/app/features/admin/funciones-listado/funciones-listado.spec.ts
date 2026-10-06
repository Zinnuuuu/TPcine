import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FuncionesListado } from './funciones-listado';

describe('FuncionesListado', () => {
  let component: FuncionesListado;
  let fixture: ComponentFixture<FuncionesListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuncionesListado],
    }).compileComponents();

    fixture = TestBed.createComponent(FuncionesListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

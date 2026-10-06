import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalasListado } from './salas-listado';

describe('SalasListado', () => {
  let component: SalasListado;
  let fixture: ComponentFixture<SalasListado>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalasListado],
    }).compileComponents();

    fixture = TestBed.createComponent(SalasListado);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

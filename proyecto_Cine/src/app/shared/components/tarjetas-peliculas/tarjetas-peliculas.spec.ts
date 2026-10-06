import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarjetasPeliculas } from './tarjetas-peliculas';

describe('TarjetasPeliculas', () => {
  let component: TarjetasPeliculas;
  let fixture: ComponentFixture<TarjetasPeliculas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasPeliculas],
    }).compileComponents();

    fixture = TestBed.createComponent(TarjetasPeliculas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosClienteAlquilerComponent } from './datos-cliente-alquiler.component';

describe('DatosClienteAlquilerComponent', () => {
  let component: DatosClienteAlquilerComponent;
  let fixture: ComponentFixture<DatosClienteAlquilerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosClienteAlquilerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosClienteAlquilerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RespuestaAjustePreciosComponent } from './respuesta-ajuste-precios.component';

describe('RespuestaAjustePreciosComponent', () => {
  let component: RespuestaAjustePreciosComponent;
  let fixture: ComponentFixture<RespuestaAjustePreciosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RespuestaAjustePreciosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RespuestaAjustePreciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioCajaComponent } from './formulario-caja.component';

describe('FormularioCajaComponent', () => {
  let component: FormularioCajaComponent;
  let fixture: ComponentFixture<FormularioCajaComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FormularioCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

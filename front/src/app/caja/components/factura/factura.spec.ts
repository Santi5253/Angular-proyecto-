import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaCaja } from './factura';

describe('FacturaCaja', () => {
  let component: FacturaCaja;
  let fixture: ComponentFixture<FacturaCaja>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaCaja],
    }).compileComponents();

    fixture = TestBed.createComponent(FacturaCaja);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

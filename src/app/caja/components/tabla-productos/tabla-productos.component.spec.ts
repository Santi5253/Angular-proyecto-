import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaProductosComponent } from './tabla-productos.component';

describe('TablaProductosComponent', () => {
  let component: TablaProductosComponent;
  let fixture: ComponentFixture<TablaProductosComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TablaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should compile', () => {
    expect(component).toBeTruthy();
  });
});

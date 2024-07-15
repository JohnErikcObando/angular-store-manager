import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaVentasComponent } from './factura-ventas.component';

describe('FacturaVentasComponent', () => {
  let component: FacturaVentasComponent;
  let fixture: ComponentFixture<FacturaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

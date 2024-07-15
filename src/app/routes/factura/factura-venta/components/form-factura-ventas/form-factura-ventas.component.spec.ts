import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFacturaVentasComponent } from './form-factura-ventas.component';

describe('FormFacturaVentasComponent', () => {
  let component: FormFacturaVentasComponent;
  let fixture: ComponentFixture<FormFacturaVentasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFacturaVentasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFacturaVentasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

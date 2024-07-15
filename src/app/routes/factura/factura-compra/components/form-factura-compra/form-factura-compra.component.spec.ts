import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFacturaCompraComponent } from './form-factura-compra.component';

describe('FormFacturaCompraComponent', () => {
  let component: FormFacturaCompraComponent;
  let fixture: ComponentFixture<FormFacturaCompraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFacturaCompraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFacturaCompraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

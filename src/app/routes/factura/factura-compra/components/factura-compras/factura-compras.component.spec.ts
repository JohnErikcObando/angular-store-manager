import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaComprasComponent } from './factura-compras.component';

describe('FacturaComprasComponent', () => {
  let component: FacturaComprasComponent;
  let fixture: ComponentFixture<FacturaComprasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacturaComprasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacturaComprasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

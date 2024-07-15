import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormFormaPagosComponent } from './form-forma-pagos.component';

describe('FormFormaPagosComponent', () => {
  let component: FormFormaPagosComponent;
  let fixture: ComponentFixture<FormFormaPagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormFormaPagosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormFormaPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

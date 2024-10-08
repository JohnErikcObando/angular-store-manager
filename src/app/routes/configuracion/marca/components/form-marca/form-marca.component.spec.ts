import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMarcaComponent } from './form-marca.component';

describe('FormMarcaComponent', () => {
  let component: FormMarcaComponent;
  let fixture: ComponentFixture<FormMarcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormMarcaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormMarcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

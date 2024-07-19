import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormValidationService {
  constructor() {}

  getErrorMessage(control: AbstractControl): string {
    if (control?.hasError('required')) {
      return 'Campo requerido';
    } else if (control?.hasError('minlength')) {
      return `Mínimo ${control.errors?.minlength.requiredLength} caracteres`;
    } else if (control?.hasError('maxlength')) {
      return `Mínimo ${control.errors?.maxlength.requiredLength} caracteres`;
    } else if (control?.hasError('email') || control?.hasError('validateEmail')) {
      return 'Correo electrónico no válido';
    } else if (control?.hasError('CampoExistente')) {
      return 'El nombre ya existe';
    }

    return '';
  }
}

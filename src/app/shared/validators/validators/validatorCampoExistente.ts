import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of, timer } from 'rxjs';

import { CategoriaService, ClienteService } from 'app/services';

export function ValidatorCampoExistente(categoriaService: CategoriaService): ValidatorFn {
  return (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    console.log('ingreso');

    return timer(1000).pipe(
      switchMap(() =>
        categoriaService.findByNombre(control.value).pipe(
          map(response => {
            console.log('resp');
            return response.isAvailable ? null : { CampoExistente: true };
          }),
          catchError(() => of(null))
        )
      )
    );
  };
}

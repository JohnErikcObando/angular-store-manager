import { AbstractControl } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { catchError, map, delay, switchMap } from 'rxjs/operators';

import { CategoriaService } from 'app/services';

export class MyValidators {
  static estado: string;
  static campo: string;
  static campoDos: string;

  static setEstado(estado: string) {
    MyValidators.estado = estado;
    console.log('validador', estado);
  }

  static setCampo(campo: string) {
    MyValidators.campo = campo;
    console.log('usuario en edición ID', campo);
  }

  static setCampoDos(campoDos: string) {
    MyValidators.campoDos = campoDos;
    console.log('usuario en edición ID', campoDos);
  }

  static ValidarCampoExistente(
    service: any,
    methodName: string,
    fieldName: string,
    accion: string
  ) {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      console.log(
        'value',
        control.value,
        'campo',
        MyValidators.campo,
        'campodos',
        MyValidators.campoDos,
        'accion service',
        accion
      );

      if (accion === 'Editar') {
        if (
          (fieldName === 'nombre' && control.value === MyValidators.campo) ||
          (fieldName === 'id' && control.value === MyValidators.campoDos) ||
          MyValidators.campo === undefined
        ) {
          return of(null);
        }
      }

      const value = control.value;

      return service[methodName](value).pipe(
        map((response: any) => {
          const isAvailable = response.isAvailable;

          if (!isAvailable) {
            return { CampoExistente: true };
          }
          return null;
        }),
        catchError(() => of(null).pipe(delay(0)))
      );
    };
  }
}
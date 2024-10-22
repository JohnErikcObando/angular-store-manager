import { AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';

export class MyValidators {
  static estado: string;
  static campo: string;
  static campoDos: string;

  static setEstado(estado: string) {
    MyValidators.estado = estado;
  }

  static setCampo(campo: string) {
    MyValidators.campo = campo;
  }

  static setCampoDos(campoDos: string) {
    MyValidators.campoDos = campoDos;
  }

  static ValidarCampoExistente(
    service: any,
    methodName: string,
    fieldName: string,
    accion: string
  ) {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
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

  static ValidarExistente(service: any, methodName: string, fieldName: string) {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> => {
      if (MyValidators.estado === 'Editar') {
        return of(null);
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

import { Injectable, Signal, signal } from '@angular/core';
import { from, Observable } from 'rxjs';

import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Sweetalert2Service {
  delecteConfirm = signal(false);

  constructor() {}

  get deleteConfirmation(): Signal<boolean> {
    return this.delecteConfirm;
  }

  swalSuccess(message: string) {
    Swal.fire({
      icon: 'success',
      title: message,
      showConfirmButton: false,
      timer: 1500,
    });
  }

  swalConfirm(message: string): Promise<any> {
    const confirmOptions: SweetAlertOptions = {
      title: 'Estas seguro?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, proceed!',
    };

    return Swal.fire(confirmOptions);
  }

  swalQuestion(message: string) {
    Swal.fire({
      title: 'Oops..?',
      text: message,
      icon: 'question',
    });
  }

  swalwarning(message: string) {
    Swal.fire({
      title: 'No Se encontro?',
      text: message,
      icon: 'warning',
    });
  }

  swalDelete(message: string): Observable<boolean> {
    return new Observable(observer => {
      Swal.fire({
        title: '¿Está seguro?',
        text: message,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
      }).then(result => {
        if (result.isConfirmed) {
          observer.next(true);
        } else {
          observer.next(false);
        }
        observer.complete();
      });
    });
  }
}

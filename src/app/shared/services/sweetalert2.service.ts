import { Injectable } from '@angular/core';

import Swal, { SweetAlertOptions } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class Sweetalert2Service {
  constructor() {}

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

  swalwarning(message: string) {
    Swal.fire({
      title: 'No Se encontro?',
      text: message,
      icon: 'warning',
    });
  }
}

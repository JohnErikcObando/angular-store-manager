import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  ValidationErrors,
} from '@angular/forms';
import { delay, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmailValidatorService implements AsyncValidator {
  // validate(control: AbstractControl): Observable<ValidationErrors | null> {
  //   const email = control.value;

  //   return of({
  //     emailTaken: true,
  //   });
  // }

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    const email = control.value;

    const httpCallObservable = new Observable<ValidationErrors | null>(
      (subscriber) => {
        if (email === 'Jonh@gmail.com') {
          subscriber.next({ emailTaken: true });
          subscriber.complete();
        }

        subscriber.next(null);
        subscriber.complete();
      }
    ).pipe(delay(3000));

    return httpCallObservable;
  }
}

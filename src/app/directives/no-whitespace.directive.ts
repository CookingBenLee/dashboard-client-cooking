import { Directive } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  selector: '[noWhitespace]',
  standalone:true,
  providers: [{ provide: NG_VALIDATORS, useExisting: NoWhitespaceDirective, multi: true }]
})
export class NoWhitespaceDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    if (control.value && typeof control.value === 'string') {
      const isWhitespace = !control.value.trim().length;
      return isWhitespace ? { 'whitespace': true } : null;
    }
    return null;
  }
}

import { Directive, HostBinding, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appPriceFormater]',
  standalone: true
})
export class PriceFormaterDirective implements OnChanges {

  @Input() priceValue: any;
  @HostBinding('textContent') formattedPrice: string;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['priceValue']) {
      this.formatContent();
    }
  }

  private formatContent() {
    let str = this.priceValue;

    if (str) {
      // Perform string replacements
      str = str.replace(/,/g, " ")
      //.replace(/\./g, ",");

      // Set the formatted content
      this.formattedPrice = str;
      console.log('Formatted content:', str);
    } else {
      this.formattedPrice = '';
    }
  }

}

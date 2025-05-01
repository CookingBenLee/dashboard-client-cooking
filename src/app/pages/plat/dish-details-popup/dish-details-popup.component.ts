import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Dishes } from 'src/app/services/dishes/Dishes';
import { PriceFormaterDirective } from 'src/app/directives/priceFormater/price-formater.directive';

@Component({
  selector: 'app-dish-details-popup',
  standalone: true,
  imports: [CommonModule, PriceFormaterDirective],
  templateUrl: './dish-details-popup.component.html',
  styleUrls: ['./dish-details-popup.component.scss']
})
export class DishDetailsPopupComponent {
  @Input() dish: Dishes | null = null;
  @Input() isVisible = false;
  @Output() onClose = new EventEmitter<void>();
  
  usercurrency = 'FCFA'; // Default currency

  closePopup() {
    this.isVisible = false;
    this.onClose.emit();
  }
} 
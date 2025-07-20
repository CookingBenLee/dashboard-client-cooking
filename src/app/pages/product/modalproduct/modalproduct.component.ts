import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Product } from 'src/app/entity/Product';
import { CommonModule } from '@angular/common'; // ✅ Important


@Component({
  selector: 'app-modalproduct',
  standalone: true,
  // imports: [],
  templateUrl: './modalproduct.component.html',
  styleUrl: './modalproduct.component.scss',
  imports: [
    CommonModule // ✅ Ajoute ceci
  ]
})
export class ModalproductComponent {
  data:Product;
  product: any;
  constructor(
      public config: DynamicDialogConfig) {
      this.data=this.config.data.product
        this.product = this.config.data;
    }


  ngOnInit(): void {
    console.log(this.data);
    console.log(this.product);
    
  }

}

import { Component } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Product } from 'src/app/entity/Product';

@Component({
  selector: 'app-modalproduct',
  standalone: true,
  imports: [],
  templateUrl: './modalproduct.component.html',
  styleUrl: './modalproduct.component.scss'
})
export class ModalproductComponent {
  data:Product;

  constructor(
      public config: DynamicDialogConfig) {
      this.data=this.config.data

    }


  ngOnInit(): void {
    console.log(this.data);
  }

}

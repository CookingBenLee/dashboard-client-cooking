import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';

@Component({
  selector: 'app-modalcategoryrecipe',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './modalcategoryrecipe.component.html',
  styleUrl: './modalcategoryrecipe.component.scss'
})
export class ModalcategoryrecipeComponent {

  data:CategoryDishes;

  constructor(public config: DynamicDialogConfig) {
    this.data=this.config.data
  }


  ngOnInit(): void {
    console.log(this.data);
  }
}

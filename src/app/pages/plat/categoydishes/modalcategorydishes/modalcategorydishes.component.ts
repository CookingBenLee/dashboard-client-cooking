import { Component } from '@angular/core';
import { DividerModule } from 'primeng/divider';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CategoryDishes } from 'src/app/services/categorydishes/CategoryDishes';

@Component({
  selector: 'app-modalcategorydishes',
  standalone: true,
  imports: [DividerModule],
  templateUrl: './modalcategorydishes.component.html',
  styleUrl: './modalcategorydishes.component.scss'
})
export class ModalcategorydishesComponent {
  data:CategoryDishes;

  constructor(public config: DynamicDialogConfig) {
    this.data=this.config.data
  }


  ngOnInit(): void {
    console.log(this.data);
  }
}

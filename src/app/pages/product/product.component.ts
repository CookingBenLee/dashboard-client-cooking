import { Component, OnInit } from '@angular/core';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [TabViewModule],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss'
})
export class ProductComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor(){}
}

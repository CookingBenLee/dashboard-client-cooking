import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { Product } from 'src/app/entity/Product';
import { Brand } from 'src/app/services/brand/Brand';
import { Category } from 'src/app/services/category/Category';
import { Conditioning } from 'src/app/services/conditioning/Conditioning';
import { Unit } from 'src/app/services/unit/Unit';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule,MatInputModule,MatDialogModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent implements OnInit {

  ngOnInit(): void {

  }

  constructor(){}

  products:Product[]=[]
  brands:Brand[]
  categorys:Category[]
  units:Unit[]
  conditionings:Conditioning[]


  motRecherche=''
  onSearch=false

  name:string
  code:string
  description:string
  price:number
  lostpercentage:number

  unit:Unit
  brand:Brand
  category:Category
  conditioning:Conditioning

  product: Product=new Product();
}

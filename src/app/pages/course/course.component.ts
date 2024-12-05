import { Component } from '@angular/core';
import { Address } from 'src/app/services/address/Address';
import { Category } from 'src/app/services/category/Category';
import { Currency } from 'src/app/services/currency/Currency';
import { Price } from 'src/app/services/price/Price';
import { Shop } from 'src/app/services/shop/Shop';

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [],
  templateUrl: './course.component.html',
  styleUrl: './course.component.scss'
})
export class CourseComponent {


  rows=5
  totalRows=0
  page=0;
  count=0;
  //first: number = 1;
  //maxS=8s;
  totalPages=0
  resClient:any
  //
  price:Price;

  showAddProduct=false

  motRecherche=''
  onSearch=false
  // distinctUnits:any[]=[]
  // realQs:any[]=[]
  // realQuantitys:any[]=[]


  reference:string
  quantity:number
  montant:any=0
  datePurchase:Date

  shop:Shop=new Shop()
  shops:Shop[]=[]
  addresss:Address[]=[]
  categorys:Category[]=[]
  category:Category=new Category()
  address:Address=new Address()

  currency:Currency=new Currency()
  currencys:Currency[]=[]

  
}

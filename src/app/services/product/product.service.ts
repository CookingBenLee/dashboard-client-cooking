import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Product } from 'src/app/entity/Product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private env=environment;

  constructor(private http: HttpClient) { }

  //create
  create(product:Product){
    return this.http.post<any>(`${this.env.apiUrl}/product/new`,product)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllProduct() {
    return this.http.get<any>(`${this.env.apiUrl}/product/getall`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }

  getAllValidated() {
    return this.http.get<any>(`${this.env.apiUrl}/product/getvalidated`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }

  getAll(idUser: number) {
    return this.http.get<any>(`${this.env.apiUrl}/product/getallbyuser/${idUser}`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }


  getByCode(nom: string) {
    return this.http.get<any>(`${this.env.apiUrl}/product/loadbyname/${nom}`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }

  getAllPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/product/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res as any)
        .then(data => data);
  }
  

  getActive() {
    return this.http.get<any>(`${this.env.apiUrl}/product/getactive`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }


  getActiveStock(userId: number) {
    return this.http.get<any>(`${this.env.apiUrl}/stock/getallbyuser/${userId}`)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }


  getActivePage(param:any,userId: number ) {
    return this.http.get<any>(`${this.env.apiUrl}/stock/getallpagebyuser/${userId}?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  getActivePageStock(params: any, userId: number) {
    const apiUrl = this.env.apiUrl.endsWith('/')
      ? this.env.apiUrl
      : this.env.apiUrl + '/';
  
    const url = `${apiUrl}stock/getallpagebyuserandbaserecipe/${userId}`;
    console.log("Final URL:", url);
  
    return this.http.get<any>(url, { params })
      .toPromise()
      .then(res => res.data as any)
      .catch(error => {
        console.error("Error in getActivePage:", error);
        throw error;
      });
  }
  
  

  getUndeletedByUserAndBaseRecipe(baseRecipe: boolean) {
    return this.http.get<any>(`${this.env.apiUrl}/product/getallbybaserecipe?baseRecipe=`+baseRecipe)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }

  getUndeletedByPageByUserAndBaseRecipe(param:any,baseRecipe: boolean ) {
    return this.http.get<any>(`${this.env.apiUrl}/product/getallpagegetallbybaserecipe?page=`+param['page']+'&size='+param['size']+'&baseRecipe='+baseRecipe)
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }
  

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/product/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);
  }

  rechercheParPage(mot:String,param:any, idUser: number) {
    return this.http.get<any>(`${this.env.apiUrl}/product/searchbypageanduser/${idUser}?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  byCategory(idCategory:any){
    return this.http.put<any>(`${this.env.apiUrl}/product/bycategory/${idCategory}`,null)
        .toPromise()
        .then(res => res.data as Product[])
        .then(data => data);

  }

  //update
  update(idproduct:number |undefined, product:Product){
    return this.http.put<any>(`${this.env.apiUrl}/product/update/${idproduct}`,product)
    .toPromise()
    .then()
    .then();
  }


  changeState(idproduct:number |undefined){
    return this.http.post<any>(`${this.env.apiUrl}/product/changestate/${idproduct}`,null)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteProduct(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/product/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }

  
}

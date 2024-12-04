import { Injectable } from '@angular/core';
import { Brand } from './Brand';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  createBrand(brand:Brand){
    return this.http.post<any>(`${this.env.apiUrl}/brand/new`,brand)
    .toPromise()
    .then()
    .then();
  }
  //read
  getAllBrands() {
    return this.http.get<any>(`${this.env.apiUrl}/brand/getall`)
        .toPromise()
        .then(res => res.data as Brand[])
        .then(data => data);
  }
  getAllBrandsPage(param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/brand/getallpage?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/brand/search?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Brand[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/brand/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //update
  updateBrand(idbrand:number |undefined, brand:Brand){
    return this.http.put<any>(`${this.env.apiUrl}/brand/update/${idbrand}`,brand)
    .toPromise()
    .then()
    .then();
  }

  ///delete
  deleteBrand(id:number | undefined) {
  return this.http.delete<any>(`${this.env.apiUrl}/brand/delete/${id}`)
  .toPromise()
        .then()
        .then();
  }
}

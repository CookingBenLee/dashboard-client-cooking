import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Price } from './Price';

@Injectable({
  providedIn: 'root'
})
export class PriceService {

  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  create(price:Price){
<<<<<<< HEAD
    return this.http.post<any>(`${this.env.apiUrl}/price/new`,price)
=======
    return this.http.post<any>(`${this.env.api}/price/new`,price)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
    .toPromise()
    .then()
    .then();
  }

  loadOrCreate(price:Price){
<<<<<<< HEAD
    return this.http.post<any>(`${this.env.apiUrl}/price/loadorcreate`,price)
=======
    return this.http.post<any>(`${this.env.api}/price/loadorcreate`,price)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
    .toPromise()
    .then()
    .then();
  }
  //read
  getAll() {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/getall`)
=======
    return this.http.get<any>(`${this.env.api}/price/getall`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  getAllPage(param:any) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/getallpage?page=`+param['page']+'&size='+param['size'])
=======
    return this.http.get<any>(`${this.env.api}/price/getallpage?page=`+param['page']+'&size='+param['size'])
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  recherche(mot:String) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/search?mot=${mot}`,)
=======
    return this.http.get<any>(`${this.env.api}/price/search?mot=${mot}`,)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }


  rechercheParPage(mot:String,param:any) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }

  //specific
  getAllByUser(idUser:number) {
    return this.http.get<any>(`${this.env.apiUrl}/price/getallbyuser/${idUser}`)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  getAllPageByUser(idUser:number,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/price/getallpage/${idUser}?page=`+param['page']+'&size='+param['size'])
        .toPromise()
        .then(res => res.data as any)
        .then(data => data);
  }

  rechercheByUser(idUser:number,mot:String) {
    return this.http.get<any>(`${this.env.apiUrl}/price/search/${idUser}?mot=${mot}`,)
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }


  rechercheParPageByUser(idUser:number,mot:String,param:any) {
    return this.http.get<any>(`${this.env.apiUrl}/price/searchbypage/${idUser}?mot=${mot}&page=${param['page']}&size=${param['size']}`)
=======
    return this.http.get<any>(`${this.env.api}/price/searchbypage?mot=${mot}&page=${param['page']}&size=${param['size']}`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
    .toPromise()
    .then(res => res.data as any)
    .then(data => data);
  }


  byShop(id:number |undefined) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/byshop/${id}`)
=======
    return this.http.get<any>(`${this.env.api}/price/byshop/${id}`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }

  byProduct(id:number |undefined) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/byproduct/${id}`)
=======
    return this.http.get<any>(`${this.env.api}/price/byproduct/${id}`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  byCurrency(id:number |undefined) {
<<<<<<< HEAD
    return this.http.get<any>(`${this.env.apiUrl}/price/bycurrency/${id}`)
=======
    return this.http.get<any>(`${this.env.api}/price/bycurrency/${id}`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
        .toPromise()
        .then(res => res.data as Price[])
        .then(data => data);
  }
  //update
  update(idprice:number |undefined, price:Price){
<<<<<<< HEAD
    return this.http.put<any>(`${this.env.apiUrl}/price/update/${idprice}`,price)
=======
    return this.http.put<any>(`${this.env.api}/price/update/${idprice}`,price)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
    .toPromise()
    .then()
    .then();
  }

  ///delete
  delete(id:number | undefined) {
<<<<<<< HEAD
  return this.http.delete<any>(`${this.env.apiUrl}/price/delete/${id}`)
=======
  return this.http.delete<any>(`${this.env.api}/price/delete/${id}`)
>>>>>>> 4bdd24468fe689b520870a7ad90bdb91e6b95d57
  .toPromise()
        .then()
        .then();
  }
}

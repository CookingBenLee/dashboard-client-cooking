import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginateService {

  constructor() { }
   ////v2 pagination
   getRequestParams(page:number,pageSize:number):any{
    console.log(page);

    let params:any={}
    //if(page){
      params['page']=page;
    //}

    //if(pageSize){
      params['size']=pageSize;
    //}
    return params
  }
}

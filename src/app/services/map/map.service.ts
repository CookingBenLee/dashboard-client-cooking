import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { Currency } from '../currency/Currency';

@Injectable({
  providedIn: 'root'
})
export class MapService {


  private env=environment;
  constructor(private http: HttpClient) { }

  //create
  getLatLong(address:string ){

      return this.http.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + address)
       // .catch(handleError);

    // const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`;
    // return this.http.get(apiUrl)


    // .toPromise()
    // .then(res => res as any)
    // .then(res => res);
    // .subscribe((response: any) => {
    //   if (response && response.length > 0) {
    //     const latitude = parseFloat(response[0].lat);
    //     const longitude = parseFloat(response[0].lon);

    //     this.initializeMap(latitude, longitude);
    //   }
    // });
  }
}

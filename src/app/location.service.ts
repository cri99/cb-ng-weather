import { Injectable } from '@angular/core';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  private _locations : string[] = [];
  
  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this._locations = JSON.parse(locString);
    }
  }

  get locations() {
    return this._locations;
  }

  addLocation(zipcode : string){
    if(!this.locations.includes(zipcode)) {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }

  removeLocation(zipcode : string){
    let index = this.locations.indexOf(zipcode);
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}

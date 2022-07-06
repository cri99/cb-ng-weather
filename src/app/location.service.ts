import { Injectable } from '@angular/core';
import { UtilsService } from './utils.service';
import { WeatherConditionInput } from './weather-condition.types';

export const LOCATIONS : string = "locations";

@Injectable()
export class LocationService {

  private _locations : WeatherConditionInput[] = [];
  
  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this._locations = JSON.parse(locString);
    }
  }

  get locations() {
    return this._locations;
  }

  private isLocationAlreadyPresent(newWeatherConditionInput: WeatherConditionInput): boolean {
    return this.locations.some(location => UtilsService.isSameWeatherLocationInput(location, newWeatherConditionInput))
  }

  addLocation(newWeatherConditionInput: WeatherConditionInput){
    if(newWeatherConditionInput && !this.isLocationAlreadyPresent(newWeatherConditionInput)) {
      this.locations.push(newWeatherConditionInput);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }

  removeLocation(weatherConditionToRemove: WeatherConditionInput){
    let index = this.locations.findIndex(currentValue => UtilsService.isSameWeatherLocationInput(currentValue, weatherConditionToRemove));
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}

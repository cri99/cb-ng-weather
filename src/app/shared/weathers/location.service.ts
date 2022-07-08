import { Injectable } from '@angular/core';
import { WeatherConditionInput } from './weather-condition.types';
import { UtilsService } from './weathers-utils.service';

export const LOCATIONS : string = "locations";

@Injectable()
export class WeatherConditionsStorageService {

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

  /**
   * Indicate if weather condition input is already saved in current saved locations
   * @param newWeatherConditionInput 
   * @returns 
   */
  private isLocationAlreadyPresent(newWeatherConditionInput: WeatherConditionInput): boolean {
    return this.locations.some(location => UtilsService.isSameWeatherLocationInput(location, newWeatherConditionInput))
  }

  /**
   * Save WeatherConditionInput (zip code and country code) on storage
   * @param newWeatherConditionInput 
   */
  addLocation(newWeatherConditionInput: WeatherConditionInput){
    if(newWeatherConditionInput && !this.isLocationAlreadyPresent(newWeatherConditionInput)) {
      this.locations.push(newWeatherConditionInput);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }

  /**
   * Remove saved WeatherConditionInput from storage
   * @param weatherConditionToRemove 
   */
  removeLocation(weatherConditionToRemove: WeatherConditionInput){
    let index = this.locations.findIndex(currentValue => UtilsService.isSameWeatherLocationInput(currentValue, weatherConditionToRemove));
    if (index !== -1){
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
    }
  }
}

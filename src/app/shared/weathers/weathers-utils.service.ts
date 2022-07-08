import { Injectable } from "@angular/core";
import { WeatherConditionInput } from "./weather-condition.types";


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  /**
   * Indicate if two weatherConditionInput are the same. It compares "countryCode" and "zipcode" in no case-sensitive
   * @param weatherConditionInputA 
   * @param weatherConditionInputB 
   * @returns true if are same weatherCondtionInput, false otherwise
   */
  static isSameWeatherLocationInput(weatherConditionInputA: WeatherConditionInput, weatherConditionInputB: WeatherConditionInput): boolean {
    return weatherConditionInputA.countryCode.toLowerCase() === weatherConditionInputB.countryCode.toLowerCase() && weatherConditionInputA.zipCode === weatherConditionInputB.zipCode; 
  }

}

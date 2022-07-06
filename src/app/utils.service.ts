import { Injectable } from "@angular/core";
import { WeatherConditionInput } from "./weather-condition.types";


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  static isSameWeatherLocationInput(weatherConditionInputA: WeatherConditionInput, weatherConditionInputB: WeatherConditionInput): boolean {
    return weatherConditionInputA.countryCode === weatherConditionInputB.countryCode && weatherConditionInputA.zipCode === weatherConditionInputB.zipCode; 
  }

}

import { Pipe, PipeTransform } from "@angular/core";
import { WeatherConditionData } from "./weather-condition.types";
import { WeatherService } from "./weather.service";

@Pipe({
    name: 'getWeatherConditionIconUrl'
})
export class getWeatherConditionIconUrlPipe implements PipeTransform {
    constructor(private weatherService: WeatherService) {}

    transform(weatherConditionData: WeatherConditionData, ...args: any[]): string {
        return this.weatherService.getWeatherIcon(weatherConditionData.weather[0].id); 
    }
    
}
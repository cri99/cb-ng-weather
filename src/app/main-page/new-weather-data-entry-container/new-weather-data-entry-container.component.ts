import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEFAULT_COUNTRY_CODE } from '@shared/commons/app.constants';
import { GenericError } from '@shared/commons/app.types';
import { WeatherConditionInput } from '@shared/weathers/weather-condition.types';
import { WeatherService } from '@shared/weathers/weather.service';
import { throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-weather-data-entry-container',
  templateUrl: './new-weather-data-entry-container.component.html',
  styleUrls: ['./new-weather-data-entry-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Smart component that wrap Input fields to add new Weather Condition Location
 */
export class NewWeatherDataEntryContainerComponent {

  newWeatherDataEntry : WeatherConditionInput = {
    zipCode: "",
    countryCode: DEFAULT_COUNTRY_CODE
  };

  weatherServiceError: GenericError;
  constructor(private weatherService : WeatherService) { }

  /**
   * @returns A function that adds a new weather data entry and reset zip code
   */
  addLocationFn = () => {
    return this.weatherService.addCurrentConditions(this.newWeatherDataEntry).pipe(
      tap(() => {
        // Reset zip code and error message if adding operations is successfull
        this.newWeatherDataEntry.zipCode = "";
        this.weatherServiceError = undefined;
      }),
      // Minimal error handling... 
      catchError(err => {
        if(err.message && err.level) {
          this.weatherServiceError = err; 
        } else {
          this.weatherServiceError = {level: 'error', message: 'Generic Error'};
        }
        return throwError(err);
      })
    )
  }

  onButtonStatusChanged(status) {
    console.log("Reactive Button Status Changed:", status);
  }
}

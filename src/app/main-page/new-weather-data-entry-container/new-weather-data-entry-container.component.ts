import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DEFAULT_LANGUAGE } from 'app/shared/commons/app.constants';
import { WeatherConditionInput } from 'app/shared/weathers/weather-condition.types';
import { WeatherService } from 'app/shared/weathers/weather.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-weather-data-entry-container',
  templateUrl: './new-weather-data-entry-container.component.html',
  styleUrls: ['./new-weather-data-entry-container.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewWeatherDataEntryContainerComponent {

  newWeatherDataEntry : WeatherConditionInput = {
    zipCode: "",
    countryCode: DEFAULT_LANGUAGE
  }


  constructor(private weatherService : WeatherService) { }

  addLocationFn = () => {
    return this.weatherService.addCurrentConditions(this.newWeatherDataEntry).pipe(
      tap(() => {
        this.newWeatherDataEntry.zipCode = "";
      })  
    )
  }

  onButtonStatusChanged(status) {
    console.log("Reactive Button Status Changed:", status);
  }
}

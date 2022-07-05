import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeatherService } from 'app/weather.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-new-weather-data-entry-container',
  templateUrl: './new-weather-data-entry-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewWeatherDataEntryContainerComponent {

  newWeatherDataEntry : {
    zipCode: string;
    cityCode: string; 
  } = {
    zipCode: "",
    cityCode: "it"
  }


  constructor(private weatherService : WeatherService) { }

  addLocationFn = () => {
    return this.weatherService.addCurrentConditions(this.newWeatherDataEntry.zipCode).pipe(
      tap(() => {
        this.newWeatherDataEntry.zipCode = "";
      })  
    )
  }

  onButtonStatusChanged(status) {
    console.log("Reactive Button Status Changed:", status);
  }
}

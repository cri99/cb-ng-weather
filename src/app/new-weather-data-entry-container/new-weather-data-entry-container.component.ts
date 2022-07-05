import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeatherService } from 'app/weather.service';

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

  addLocation(){
    this.weatherService.addCurrentConditions(this.newWeatherDataEntry.zipCode).subscribe(console.log);
    this.newWeatherDataEntry.zipCode = "";
  }

}

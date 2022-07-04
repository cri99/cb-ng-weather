import { ChangeDetectionStrategy, Component } from '@angular/core';
import { WeatherService } from 'app/weather.service';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZipcodeEntryComponent {

  constructor(private weatherService : WeatherService) { }

  addLocation(zipcode : string){
    this.weatherService.addCurrentConditions(zipcode);
  }

}

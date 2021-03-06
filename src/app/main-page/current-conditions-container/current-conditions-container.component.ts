import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { WeatherCondition } from '@shared/weathers/weather-condition.types';
import { WeatherService } from '@shared/weathers/weather.service';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
/**
 * Smart componet for current wheater conditions list
 */
export class CurrentConditionsContainerComponent implements OnInit {

  currentConditions$: Observable<WeatherCondition[]>;

  constructor(private weatherService : WeatherService, private router : Router) {
  }

  ngOnInit(): void {
    this.currentConditions$ = this.weatherService.getCurrentConditions();
  }

  showForecast({zip, data}: WeatherCondition){
    // Execute route navigation to forecast page with zip code as route params and country code as query params
    this.router.navigate(['/forecast', zip], {queryParams: {
      countryCode: data.sys.country
    }})
  }

  removeLocation({zip, data}: WeatherCondition) {
    this.weatherService.removeCurrentConditions({
      zipCode: zip,
      countryCode: data.sys.country
    });
  }


}

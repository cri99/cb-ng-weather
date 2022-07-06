import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {WeatherService} from "../weather.service";
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { WeatherCondition } from 'app/weather-condition.types';

@Component({
  selector: 'app-current-conditions-container',
  templateUrl: './current-conditions-container.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsContainerComponent implements OnInit {

  currentConditions$: Observable<WeatherCondition[]>;

  constructor(private weatherService : WeatherService, private router : Router) {
  }

  ngOnInit(): void {
    this.currentConditions$ = this.weatherService.getCurrentConditions();
  }

  showForecast({zip, data}: WeatherCondition){
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

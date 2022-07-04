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

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }

  removeLocation(zipCode: string) {
    this.weatherService.removeCurrentConditions(zipCode);
  }


}

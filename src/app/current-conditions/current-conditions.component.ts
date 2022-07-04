import { Component, OnInit } from '@angular/core';
import {WeatherService} from "../weather.service";
import {LocationService} from "../location.service";
import {Router} from "@angular/router";
import { Observable } from 'rxjs';
import { WeatherCondition } from 'app/weather-condition.types';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css']
})
export class CurrentConditionsComponent implements OnInit {

  currentConditions$: Observable<WeatherCondition[]>;

  constructor(private weatherService : WeatherService, private locationService : LocationService, private router : Router) {
  }

  ngOnInit(): void {
    this.currentConditions$ = this.weatherService.getCurrentConditions();
  }

  getCurrentConditions() {
    return this.weatherService.getCurrentConditions();
  }

  showForecast(zipcode : string){
    this.router.navigate(['/forecast', zipcode])
  }
}

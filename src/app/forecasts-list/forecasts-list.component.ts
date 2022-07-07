import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { Forecast, WeatherConditionInput } from 'app/shared/weathers/weather-condition.types';
import { WeatherService } from 'app/shared/weathers/weather.service';
import { Observable } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent implements OnInit {

  forecast$: Observable<Forecast>;

  constructor(private weatherService: WeatherService, private route : ActivatedRoute) {}

  ngOnInit(): void {

    this.forecast$ = this.route.params.pipe(
      withLatestFrom(this.route.queryParams), // Retrieving both route and query params
      map(([routeParams, queryParams]) => ({ 
        zipCode: routeParams['zipcode'],
        countryCode: queryParams['countryCode']
    } as WeatherConditionInput)), // Remapping params to WeatherConditionInput format
      // finally retrieving data and initiliazing forecast$ observable with Zip Code and Country Code
      switchMap(({zipCode, countryCode}) => this.weatherService.getForecast(zipCode, countryCode))
    );
  }

  
}

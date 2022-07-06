import { ChangeDetectionStrategy, Component } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent {

  forecast$: Observable<any>;

  constructor(private weatherService: WeatherService, route : ActivatedRoute) {

    this.forecast$ = route.params.pipe(
      withLatestFrom(route.queryParams),
      switchMap(([routeParams, queryParams]) => {
        const zipcode = routeParams['zipcode'];
        const countryCode = queryParams['countryCode'];

        return weatherService.getForecast(zipcode, countryCode);
      })
    );
  }
}

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { WeatherService } from 'app/shared/weathers/weather.service';
import { Observable } from 'rxjs';
import { switchMap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent implements OnInit {

  forecast$: Observable<any>;

  constructor(private weatherService: WeatherService, private route : ActivatedRoute) {}
  
  ngOnInit(): void {
    this.forecast$ = this.route.params.pipe(
      withLatestFrom(this.route.queryParams),
      switchMap(([routeParams, queryParams]) => {
        const zipcode = routeParams['zipcode'];
        const countryCode = queryParams['countryCode'];

        return this.weatherService.getForecast(zipcode, countryCode);
      })
    );
  }

  
}

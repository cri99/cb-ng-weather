import { ChangeDetectionStrategy, Component } from '@angular/core';
import {WeatherService} from '../weather.service';
import {ActivatedRoute} from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-forecasts-list',
  templateUrl: './forecasts-list.component.html',
  styleUrls: ['./forecasts-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ForecastsListComponent {

  zipcode: string;
  forecast$: Observable<any>;

  constructor(private weatherService: WeatherService, route : ActivatedRoute) {
    this.forecast$ = route.params.pipe(
      switchMap(params => {
        this.zipcode = params['zipcode'];
        return weatherService.getForecast(this.zipcode);
      })
    );
  }
}

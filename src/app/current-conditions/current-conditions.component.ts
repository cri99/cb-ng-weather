import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TrackByFunction } from '@angular/core';
import { WeatherCondition } from 'app/weather-condition.types';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent {

  @Output() onShowForecast = new EventEmitter();
  @Output() onRemoveWeatherCondition = new EventEmitter();

  private _currentConditions: WeatherCondition[];

  @Input() set currentConditions (newWeatherConditions: WeatherCondition[]) {
    this._currentConditions = newWeatherConditions;  
  }

  get currentConditions() {
    return this._currentConditions;
  }

  constructor() {
  }

  showForecast(zipcode : string){
    this.onShowForecast.emit(zipcode);
  }

  removeLocation(zipCode: string) {
    this.onRemoveWeatherCondition.emit(zipCode);
  }

  weatherConditionTrackByFn: TrackByFunction<WeatherCondition> = (index, weatherCondition) => {
    return weatherCondition.zip;
  }
}

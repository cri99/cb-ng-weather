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

  showForecast(weatherCondition : WeatherCondition){
    this.onShowForecast.emit(weatherCondition);
  }

  removeLocation(weatherCondition : WeatherCondition) {
    this.onRemoveWeatherCondition.emit(weatherCondition);
  }

  weatherConditionTrackByFn: TrackByFunction<WeatherCondition> = (index, weatherCondition) => {
    return weatherCondition.data.id;
  }
}

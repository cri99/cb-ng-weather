import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TrackByFunction } from '@angular/core';
import { WeatherCondition } from '@shared/weathers/weather-condition.types';

@Component({
  selector: 'app-current-conditions',
  templateUrl: './current-conditions.component.html',
  styleUrls: ['./current-conditions.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsComponent {

  /**
   * Event emitted when user wants to see forecast on some Weather Condition Item  
   */
  @Output() onShowForecast = new EventEmitter();

  /**
   * Event emitted when user wants to remove some Weather Condition Item  
   */
  @Output() onRemoveWeatherCondition = new EventEmitter();

  /**
   * Lists of current weather conditions
   */
  @Input() currentConditions: WeatherCondition[];

  constructor() {}

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

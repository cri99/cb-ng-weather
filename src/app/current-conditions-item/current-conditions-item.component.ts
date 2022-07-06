import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherCondition } from 'app/weather-condition.types';

@Component({
  selector: 'app-current-conditions-item',
  templateUrl: './current-conditions-item.component.html',
  styleUrls: ['./current-conditions-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsItemComponent {

  private _location: WeatherCondition;

  @Input() set weatherCondition(newWeatherCondition: WeatherCondition) {
    this._location = newWeatherCondition;
  } 

  @Output() onRemove = new EventEmitter();
  
  get location () {
    return this._location;
  }

  removeLocation(event: Event) {
    event.stopPropagation();
    this.onRemove.emit(this._location);
  }
}

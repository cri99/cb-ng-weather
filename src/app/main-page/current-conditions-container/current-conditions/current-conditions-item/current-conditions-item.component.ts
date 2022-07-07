import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { WeatherCondition } from 'app/shared/weathers/weather-condition.types';

@Component({
  selector: 'app-current-conditions-item',
  templateUrl: './current-conditions-item.component.html',
  styleUrls: ['./current-conditions-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsItemComponent {


  @Input() weatherCondition: WeatherCondition
  
  /**
   * Event emitted when users wants to remove current weather condition item
   */
  @Output() onRemove = new EventEmitter();
  
  removeLocation(event: Event) {
    // Since all item element is clickable, we need to stop click event propagation, 
    // otherwise navigation to the current forecast is activated
    event.stopPropagation();
    this.onRemove.emit(this.weatherCondition);
  }
}

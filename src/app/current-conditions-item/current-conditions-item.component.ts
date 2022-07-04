import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {Router} from "@angular/router";
import { WeatherCondition } from 'app/weather-condition.types';

@Component({
  selector: 'app-current-conditions-item',
  templateUrl: './current-conditions-item.component.html',
  styleUrls: ['./current-conditions-item.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CurrentConditionsItemComponent implements OnInit {

  private _location: WeatherCondition;

  @Input() set weatherCondition(newWeatherCondition: WeatherCondition) {
    this._location = newWeatherCondition;
  } 

  @Output() onRemove = new EventEmitter();
  
  get location () {
    return this._location;
  }


  constructor(private router : Router) {
  }

  ngOnInit(): void {
  }

  removeLocation() {
    this.onRemove.emit(this._location.zip);
  }
}

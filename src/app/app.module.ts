import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ZipcodeEntryComponent } from './new-weather-data-entry-container/zipcode-entry/zipcode-entry.component';
import {LocationService} from "./location.service";
import { ForecastsListComponent } from './forecasts-list/forecasts-list.component';
import {WeatherService} from "./weather.service";
import { CurrentConditionsComponent } from './current-conditions/current-conditions.component';
import { MainPageComponent } from './main-page/main-page.component';
import {RouterModule} from "@angular/router";
import {routing} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { CurrentConditionsItemComponent } from './current-conditions-item/current-conditions-item.component';
import { CurrentConditionsContainerComponent } from './current-conditions-container/current-conditions-container.component';
import { getWeatherConditionIconUrlPipe } from './get-weather-icon-url.pipe';
import { ReactiveStatusButtonComponent } from './reactive-status-button/reactive-status-button.component';
import { NewWeatherDataEntryContainerComponent } from './new-weather-data-entry-container/new-weather-data-entry-container.component';
import { CountryEntryComponent } from './new-weather-data-entry-container/country-entry/country-entry.component';

@NgModule({
  declarations: [
    AppComponent,
    CurrentConditionsContainerComponent,
    ZipcodeEntryComponent,
    ForecastsListComponent,
    CurrentConditionsComponent,
    MainPageComponent,
    CurrentConditionsItemComponent,
    getWeatherConditionIconUrlPipe,
    ReactiveStatusButtonComponent,
    NewWeatherDataEntryContainerComponent,
    CountryEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [LocationService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }

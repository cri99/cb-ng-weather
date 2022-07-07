import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule } from "@angular/router";
import { ServiceWorkerModule } from "@angular/service-worker";
import { environment } from "environments/environment";
import { AppComponent } from "./app.component";
import { routing } from "./app.routing";
import { ForecastsListComponent } from "./forecasts-list/forecasts-list.component";
import { CurrentConditionsContainerComponent } from "./main-page/current-conditions-container/current-conditions-container.component";
import { CurrentConditionsItemComponent } from "./main-page/current-conditions-container/current-conditions/current-conditions-item/current-conditions-item.component";
import { CurrentConditionsComponent } from "./main-page/current-conditions-container/current-conditions/current-conditions.component";
import { MainPageComponent } from "./main-page/main-page.component";
import { CountryEntryComponent } from "./main-page/new-weather-data-entry-container/country-entry/country-entry.component";
import { NewWeatherDataEntryContainerComponent } from "./main-page/new-weather-data-entry-container/new-weather-data-entry-container.component";
import { ZipcodeEntryComponent } from "./main-page/new-weather-data-entry-container/zipcode-entry/zipcode-entry.component";
import { ReactiveStatusButtonComponent } from "./shared/commons/components/reactive-status-button/reactive-status-button.component";
import { BoldMatchingText } from "./shared/commons/pipes/bold-search-text.pipe";
import { getWeatherConditionIconUrlPipe } from "./shared/weathers/get-weather-icon-url.pipe";
import { WeatherConditionsStorageService } from "./shared/weathers/location.service";
import { WeatherService } from "./shared/weathers/weather.service";


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
    CountryEntryComponent,
    BoldMatchingText
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    routing,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [WeatherConditionsStorageService, WeatherService],
  bootstrap: [AppComponent]
})
export class AppModule { }

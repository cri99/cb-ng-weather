import { Injectable } from '@angular/core';
import {BehaviorSubject, from, interval, Observable, OperatorFunction, Subject} from 'rxjs';
import {filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';
import { WeatherCondition, WeatherConditionData } from './weather-condition.types';
import { LocationService } from './location.service';

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';

  private static POLLING_RATE = 60 * 1000;

  private _addCurrentConditionEvent$ = new Subject<string>();
  private _removeCurrentConditionEvent$ = new Subject<string>();

  private _currentConditions$ = new BehaviorSubject<WeatherCondition[]>([]);

  constructor(
    private http: HttpClient,
    private locationService: LocationService
  ) {
    this.setupEventListeners();
    this.setupWeatherConditionsPolling();
    this.initializeSavedLocations();
  }

  private initializeSavedLocations() {
    from(this.locationService.locations).subscribe(zipCode => {
      this.addCurrentConditions(zipCode);
    })
  }

  private setupWeatherConditionsPolling() {
    interval(WeatherService.POLLING_RATE).pipe(
      withLatestFrom(this._currentConditions$),
      switchMap(([_, conditions]) => conditions),
      mergeMap((weatherConditionToUpdate => this.retrieveWeatherConditionByZipCode(weatherConditionToUpdate.zip)))
    ).subscribe(newWeatherCondition => {
      console.log("Updated data:", newWeatherCondition);
      this.updateCurrentConditions(newWeatherCondition);
    });
  }

  private setupEventListeners() {
    this.onAddCurrentConditionsEvent();
    this.onRemoveCurrentConditionsEvent();
  }

  private onAddCurrentConditionsEvent() {
    this._addCurrentConditionEvent$.pipe(
      filter(Boolean),
      this.filterIfZipCodeAlreadyExist(),
      mergeMap((zipCode: string) => this.retrieveWeatherConditionByZipCode(zipCode).pipe(
        map(weatherCondition => ({weatherCondition, zipCode}))
      )),
    ).subscribe(({weatherCondition, zipCode}) => {
      const currentConditions = [...this._currentConditions$.value];
      currentConditions.push(weatherCondition); 
      this._currentConditions$.next(currentConditions);
      this.locationService.addLocation(zipCode);
    });
  }

  private filterIfZipCodeAlreadyExist(): OperatorFunction<string, string> {
    return (sourceObs: Observable<string>) => 
      sourceObs.pipe(
        withLatestFrom(this._currentConditions$),
        filter(([zipCode, weatherConditions]) =>  {
          return weatherConditions.every(condition => condition.zip !== zipCode);
        }),
        map(([zipCode]) => zipCode)
      )
    
  }

  private onRemoveCurrentConditionsEvent() {
    this._removeCurrentConditionEvent$.pipe(
      filter(Boolean),
    ).subscribe((zipCodeToRemove : string) => {
      let currentConditions = [...this._currentConditions$.value];
      currentConditions = currentConditions.filter(condition => condition.zip !== zipCodeToRemove);
      this._currentConditions$.next(currentConditions);
      this.locationService.removeLocation(zipCodeToRemove);
    });
  }


  private retrieveWeatherConditionByZipCode(zipCode: string): Observable<WeatherCondition> {
    return this.http.get<WeatherConditionData>(`${WeatherService.URL}/weather?zip=${zipCode},it&units=metric&APPID=${WeatherService.APPID}`).pipe(
      map(weatherConditionData => {
        return {
          zip: zipCode,
          data: weatherConditionData
        };
      })
    )
  }

  addCurrentConditions(zipcode: string): void {
    this._addCurrentConditionEvent$.next(zipcode);
  }

  updateCurrentConditions(newWeatherCondition: WeatherCondition)
  updateCurrentConditions(newWeatherCondition: WeatherCondition, zipCode?: string) {
    const zipCodeOfElToUpdate = zipCode || newWeatherCondition.zip;
    if(!zipCodeOfElToUpdate) {

    }

    let currentConditions = [...this._currentConditions$.value];
    const weatherConditionToUpdateIdx = currentConditions.findIndex(condition => condition.zip === zipCodeOfElToUpdate);
    currentConditions[weatherConditionToUpdateIdx] = {...currentConditions[weatherConditionToUpdateIdx], ...newWeatherCondition};
    this._currentConditions$.next(currentConditions);
  }

  removeCurrentConditions(zipcode: string): void {
    this._removeCurrentConditionEvent$.next(zipcode);
  }

  getCurrentConditions(): Observable<WeatherCondition[]> {
    return this._currentConditions$.asObservable();
  }

  getForecast(zipcode: string): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipcode},it&units=metric&cnt=5&APPID=${WeatherService.APPID}`);

  }

  getWeatherIcon(id){
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else
      return WeatherService.ICON_URL + "art_clear.png";
  }

}

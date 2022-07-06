import { Injectable } from '@angular/core';
import {BehaviorSubject, from, interval, Observable, of, OperatorFunction, Subject, throwError} from 'rxjs';
import {delay, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';
import { WeatherCondition, WeatherConditionData, WeatherConditionInput } from './weather-condition.types';
import { WeatherConditionsStorageService } from './location.service';
import { DEFAULT_LANGUAGE } from './shared/app.constants';
import { UtilsService } from './utils.service';

@Injectable()
export class WeatherService {

  static URL = 'http://api.openweathermap.org/data/2.5';
  static APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  
  private static POLLING_RATE = 60 * 1000;


  private _currentConditions$ = new BehaviorSubject<WeatherCondition[]>([]);

  constructor(
    private http: HttpClient,
    private locationService: WeatherConditionsStorageService
  ) {
    this.setupWeatherConditionsPolling();
    this.initializeSavedLocations();
  }

  private initializeSavedLocations() {
    from(this.locationService.locations)
      .pipe(
        mergeMap(zipcode => this.addCurrentConditions(zipcode))
      ).subscribe();
  }

  private setupWeatherConditionsPolling() {
    interval(WeatherService.POLLING_RATE).pipe(
      withLatestFrom(this._currentConditions$),
      switchMap(([_, conditions]) => conditions),
      mergeMap((({zip, data}) => this.retrieveWeatherCondition(zip, data.sys.country)))
    ).subscribe(newWeatherCondition => {
      this.updateCurrentConditions(newWeatherCondition);
    });
  }


  private retrieveWeatherCondition(zipCode: string, countryCode = DEFAULT_LANGUAGE): Observable<WeatherCondition> {
    return this.http.get<WeatherConditionData>(`${WeatherService.URL}/weather?zip=${zipCode},${countryCode}&units=metric&APPID=${WeatherService.APPID}`).pipe(
      map(weatherConditionData => {
        return {
          zip: zipCode,
          data: weatherConditionData
        };
      })
    )
  }

  addCurrentConditions(weatherConditionInput: WeatherConditionInput): Observable<WeatherCondition> {
    return of(weatherConditionInput).pipe(
      withLatestFrom(this._currentConditions$),
      switchMap(([{zipCode, countryCode}, weatherConditions]) => {
        if(!zipCode) {
          return throwError("zipCode is undefined!");
        }

        const isCityAlreadyIncluded = weatherConditions.some(condition => UtilsService.isSameWeatherLocationInput({
            countryCode: condition.data.sys.country,
            zipCode: condition.zip
          }, weatherConditionInput
        ));

        if(isCityAlreadyIncluded) {
          return throwError("City Already Included!");
        }

        return this.retrieveWeatherCondition(zipCode, countryCode).pipe(
          map(newWeatherCondition => ({newWeatherCondition, allCurrentConditions: weatherConditions}))
        )
      }),
      map(({newWeatherCondition, allCurrentConditions}) => {
        allCurrentConditions.push(newWeatherCondition); 
        this._currentConditions$.next([...allCurrentConditions]);
        this.locationService.addLocation({...weatherConditionInput});
        return newWeatherCondition;
      })
    )
  }

  updateCurrentConditions(newWeatherCondition: WeatherCondition)
  updateCurrentConditions(newWeatherCondition: WeatherCondition, zipCode?: string, countryCode?: string) {
    const zipCodeOfElToUpdate = zipCode || newWeatherCondition.zip;
    const countryCodeOfElToUpdate = countryCode || newWeatherCondition.data.sys.country;

    let currentConditions = [...this._currentConditions$.value];
    const weatherConditionToUpdateIdx = currentConditions.findIndex(condition => condition.zip === zipCodeOfElToUpdate && condition.data.sys.country === countryCodeOfElToUpdate);
    currentConditions[weatherConditionToUpdateIdx] = {...currentConditions[weatherConditionToUpdateIdx], ...newWeatherCondition};
    this._currentConditions$.next(currentConditions);
  }

  removeCurrentConditions(weatherConditionToRemove: WeatherConditionInput): void {
    if(weatherConditionToRemove && weatherConditionToRemove.countryCode && weatherConditionToRemove.countryCode) {
      let currentConditions = [...this._currentConditions$.value];
      currentConditions = currentConditions.filter(condition => !UtilsService.isSameWeatherLocationInput(
        {
          countryCode: condition.data.sys.country,
          zipCode: condition.zip
        }, 
        weatherConditionToRemove
      ));
      this._currentConditions$.next(currentConditions);
      this.locationService.removeLocation(weatherConditionToRemove);
    }
  }

  getCurrentConditions(): Observable<WeatherCondition[]> {
    return this._currentConditions$.asObservable();
  }

  getForecast(zipcode: string, countryCode = DEFAULT_LANGUAGE): Observable<any> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get(`${WeatherService.URL}/forecast/daily?zip=${zipcode},${countryCode}&units=metric&cnt=5&APPID=${WeatherService.APPID}`);

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

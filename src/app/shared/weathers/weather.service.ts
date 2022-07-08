import { Injectable } from '@angular/core';
import {BehaviorSubject, from, iif, interval, Observable, of, throwError} from 'rxjs';
import {catchError, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import {HttpClient} from '@angular/common/http';
import { WeatherConditionsStorageService } from './location.service';
import { DEFAULT_COUNTRY_CODE } from '../commons/app.constants';
import { Forecast, WeatherCondition, WeatherConditionData, WeatherConditionInput } from './weather-condition.types';
import { UtilsService } from './weathers-utils.service';
import { GenericError } from '../commons/app.types';

@Injectable()
export class WeatherService {

  static readonly URL = 'http://api.openweathermap.org/data/2.5';
  static readonly APPID = '5a4b2d457ecbef9eb2a71e480b947604';
  static readonly ICON_URL = 'https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/';
  
  /**
   * Current Weather Conditions refresh rate in milliseconds 
   */
  private static readonly REFRESH_POLLING_RATE = 30 * 1000; 

  private _currentConditions$ = new BehaviorSubject<WeatherCondition[]>([]);

  constructor(
    private http: HttpClient,
    private locationService: WeatherConditionsStorageService
  ) {
    this.setupWeatherConditionsPolling();
    this.initializeSavedLocations();
  }

  /**
   * Retrieve and initialize saved locations from storage
   */
  private initializeSavedLocations(): void {
    from(this.locationService.locations) // For every saved locations in storage
      .pipe( 
        // Adding weather condition
        mergeMap(weatherCondition => this.addCurrentConditions(weatherCondition)) 
      ).subscribe();
  }

  /**
   * Starts polling for refresh all weather conditions
   */
  private setupWeatherConditionsPolling(): void {
    // Creating an observable that emits event every REFRESH_POLLING_RATE milliseconds
    interval(WeatherService.REFRESH_POLLING_RATE).pipe(
      withLatestFrom(this._currentConditions$), // retrieving current weather conditions
      switchMap(([_, conditions]) => conditions), // Remapping because we don't care about values emitted by interval. 
      // For every current weather conditions, re-load weather condition info 
      mergeMap((({zip, data}) => this.loadWeatherCondition(zip, data.sys.country))) 
    ).subscribe(newWeatherCondition => {
      console.debug(`Updating weather condition of ${newWeatherCondition.data.name} [${newWeatherCondition.zip}] in ${newWeatherCondition.data.sys.country}`);
      // and finally updating value in current weather conditions list
      this.updateCurrentConditions(newWeatherCondition);
    });
  }


  /**
   * Load weather condition data of a city by Zip Code and country code from Open Weather API
   */
  private loadWeatherCondition(zipCode: string, countryCode = DEFAULT_COUNTRY_CODE): Observable<WeatherCondition> {
    return this.http.get<WeatherConditionData>(`${WeatherService.URL}/weather?zip=${zipCode},${countryCode}&units=metric&APPID=${WeatherService.APPID}`).pipe(
      map(weatherConditionData => {
        return {
          zip: zipCode,
          data: weatherConditionData
        };
      }),
      catchError(err => {
        if(err?.error?.message) {
          const loadWeatherConditionError: GenericError = {level: 'error', message: err.error.message};
          return throwError(loadWeatherConditionError); 
        }
        return throwError(err);
      })
    )
  }

  /**
   * Load and add new weather conditions to current conditions list 
   * @param weatherConditionInput 
   * @returns 
   */
  addCurrentConditions(weatherConditionInput: WeatherConditionInput): Observable<WeatherCondition> {
    return iif(
      () => !!weatherConditionInput,
      of(weatherConditionInput).pipe(
        withLatestFrom(this._currentConditions$),  // retrieving current weather conditions
        switchMap(([{zipCode, countryCode}, weatherConditions]) => {
          if(!zipCode) {
            const zipCodeUndefinedError: GenericError = {level: 'error', message: "Zip Code must be defined"}
            return throwError(zipCodeUndefinedError);
          }
  
          // Control if the city to add is already included in current conditions list. It compares both Zip Code and Country Code
          const isCityAlreadyIncluded = weatherConditions.some(condition => UtilsService.isSameWeatherLocationInput({
              countryCode: condition.data.sys.country,
              zipCode: condition.zip
            }, weatherConditionInput
          ));
  
          // If the city is already has already been added, it is not re-added and a warning is triggered
          if(isCityAlreadyIncluded) {
            const cityAlreadyAddedWarning: GenericError = {level: 'warning', message: "City already added"}
            return throwError(cityAlreadyAddedWarning);
          }
  
          // Loading new city weather condition data
          return this.loadWeatherCondition(zipCode, countryCode).pipe(
            map(newWeatherCondition => ({newWeatherCondition, allCurrentConditions: weatherConditions}))
          )
        }),
        map(({newWeatherCondition, allCurrentConditions}) => {
          // Push new elemen in current weather conditions
          allCurrentConditions.push(newWeatherCondition); 
          this._currentConditions$.next([...allCurrentConditions]);
          // Save new element location info in local storage 
          this.locationService.addLocation({...weatherConditionInput});
          return newWeatherCondition;
        })
      ),

      throwError({ level: 'error', message: '"weatherConditionInput" must be defined' } as GenericError)
      )
  
  }

  /**
   * Update data of weather condition in curent conditions list
   * @param newWeatherCondition 
   */
  updateCurrentConditions(newWeatherCondition: WeatherCondition): void
  updateCurrentConditions(newWeatherCondition: WeatherCondition, zipCode?: string, countryCode?: string): void {
    const zipCodeOfElToUpdate = zipCode || newWeatherCondition.zip;
    const countryCodeOfElToUpdate = countryCode || newWeatherCondition.data.sys.country;

    let currentConditions = [...this._currentConditions$.value];
    // Find index of element to update by zip code and country code
    const weatherConditionToUpdateIdx = currentConditions.findIndex(condition => condition.zip === zipCodeOfElToUpdate && condition.data.sys.country === countryCodeOfElToUpdate);
    // Patch update of element in weather conditons array
    currentConditions[weatherConditionToUpdateIdx] = {...currentConditions[weatherConditionToUpdateIdx], ...newWeatherCondition};
    this._currentConditions$.next(currentConditions);
  }

  /**
   * Remove a Weather Condition in curent conditions list by zip code and country code (WeatherConditionInput)
   * @param weatherConditionToRemove 
   */
  removeCurrentConditions(weatherConditionToRemove: WeatherConditionInput): void {
    if(weatherConditionToRemove && weatherConditionToRemove.countryCode && weatherConditionToRemove.countryCode) {
      // Copy of current conditions
      let currentConditions = [...this._currentConditions$.value];
      // Filtering conditions by zip code and country code to remove specified weatherConditionToRemove
      currentConditions = currentConditions.filter(condition => !UtilsService.isSameWeatherLocationInput(
        {
          countryCode: condition.data.sys.country,
          zipCode: condition.zip
        }, 
        weatherConditionToRemove
      ));
      
      this._currentConditions$.next(currentConditions);
      // Remove weather condition from storage
      this.locationService.removeLocation(weatherConditionToRemove);
    }
  }

  getCurrentConditions(): Observable<WeatherCondition[]> {
    return this._currentConditions$.asObservable();
  }

  /**
   * Load Forecast data by zip code and country code from Open Wheater API 
   */
  loadForecast(zipcode: string, countryCode = DEFAULT_COUNTRY_CODE): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    return this.http.get<Forecast>(`${WeatherService.URL}/forecast/daily?zip=${zipcode},${countryCode}&units=metric&cnt=5&APPID=${WeatherService.APPID}`);

  }

  /**
   * Get Weather icon source url based on weather condition id based on Open Weather API
   */
  getWeatherIcon(id: number): string {
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

import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Country, CountryResult } from "./countries.types";
import { ALL_COUNTRIES } from "./country-data-store";

@Injectable()
export class CountryEntryService{
    private static ALL_COUNTRIES = ALL_COUNTRIES;
    private _filteredCountries$ = new BehaviorSubject<Country[]>(ALL_COUNTRIES);


    getFilteredCountries$() : Observable<Country[]> {
        return this._filteredCountries$.asObservable();
    }

    updateCountryFilter(countryName: string): void {
        const filteredCountries = ALL_COUNTRIES.filter(
            country => country.name.toLowerCase().includes(countryName.toLowerCase())
        );

        this._filteredCountries$.next(filteredCountries);
    }
}
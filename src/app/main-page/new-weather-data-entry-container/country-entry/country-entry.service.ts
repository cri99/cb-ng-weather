import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Country } from "./countries.types";
import { ALL_COUNTRIES } from "./country-data-store";

@Injectable()
export class CountryEntryService{
    private _filteredCountries$ = new BehaviorSubject<Country[]>(ALL_COUNTRIES);


    findCountryByCode(countryCode: string) {
        return ALL_COUNTRIES.find(country => (country.code.toLowerCase() === countryCode.toLowerCase()) 
                                            || (country.code3.toLowerCase() === countryCode.toLowerCase()));
    }

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
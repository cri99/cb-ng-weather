import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Country } from "./countries.types";
import { ALL_COUNTRIES } from "./country-data-store";

@Injectable()
export class CountryEntryService{
    private _filteredCountries$ = new BehaviorSubject<Country[]>(ALL_COUNTRIES);

    /**
     * @returns the Country with given code
     * @param countryCode 
     */
    findCountryByCode(countryCode: string): Country {
        return ALL_COUNTRIES.find(country => (country.code.toLowerCase() === countryCode?.toLowerCase()) 
                                            || (country.code3.toLowerCase() === countryCode?.toLowerCase()));
    }

    /**
     * @returns current filtered countries 
     */
    getFilteredCountries$() : Observable<Country[]> {
        return this._filteredCountries$.asObservable();
    }

    /**
     * Updates the list of available countries based on country name not-case sensitive research.
     * @param countryName 
     */
    updateCountryFilter(countryName: string): void {
        const filteredCountries = ALL_COUNTRIES.filter(
            country => country.name.toLowerCase().includes(countryName.toLowerCase())
        );

        this._filteredCountries$.next(filteredCountries);
    }
}
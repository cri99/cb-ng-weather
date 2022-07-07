import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { delay, filter } from 'rxjs/operators';
import { Country } from './countries.types';
import { CountryEntryService } from './country-entry.service';

@Component({
  selector: 'app-country-entry',
  templateUrl: './country-entry.component.html',
  styleUrls: ['./country-entry.component.css'],
  providers: [CountryEntryService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CountryEntryComponent implements OnInit {
  /**
   * Country name value inserted by user
   */
  countryName: string = "";

  /**
   * Last valid selected Country 
   */
  private _currentCountry: Country;

  /**
   * Country code. Ex: "IT" for Italy.
   */
  @Input() set countryCode(newCountryCode: string) {
    if(newCountryCode) {
      // On new valid country code input, checking if there is a country associated with it.
      const countryResult = this.countryService.findCountryByCode(newCountryCode);
      if(countryResult) {
        // The country found is settled as current country
        this._currentCountry = countryResult;
        // and of course also country name is settled
        this.selectedCountryChanged(countryResult.name);
      }
    }
    
  }

  @Output() countryCodeChange = new EventEmitter<string>();

  filteredCountries$: Observable<Country[]>
  showCountryList: boolean = false;

  /**
   * Emits event when user click outside of country name input (including when click on country suggestion list)
   */
  private _onCountryLostFocus$ = new Subject<void>();

  constructor(
    private countryService: CountryEntryService, 
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this.filteredCountries$ = this.countryService.getFilteredCountries$();

    this.setupHideCountryListAfterCountryNameLostFocus();
  }

  private setupHideCountryListAfterCountryNameLostFocus(): void {
    // when user is clicking outside of country name text input
    this._onCountryLostFocus$.pipe(
      // if country list is shown
      filter(() => this.showCountryList === true),
      // waiting for 100ms before hide country list, that's because otherwise list is removed 
      // from DOM before eventually list selected country is settled as current country.
      // Ex: 1. User type "Ita" in country name input
      //     2. Country lists is showing "Italy, Mauritania, etc"
      //     3. User tring to click on "Italy" element, but just before country lists would have been removed from the DOM if there was no delay
      delay(100) 
    ).subscribe(() => {
      // Setting as current country name the last valid selected country.
      this.countryName = this._currentCountry.name;
      this.showCountryList = false;

      // Triggering local change detection to update view
      this.cdr.detach();
      this.cdr.detectChanges();
      this.cdr.reattach();
    });
  }


  onCountryInputFocus() {
    this.showCountryList = true;
  }

  onCountryInputLostFocus() {
    this._onCountryLostFocus$.next();
  }

  /**
   * Called When selected country name is changed
   * @param countryName 
   */
  selectedCountryChanged(countryName: string) {
    this.countryName = countryName;
    // Updating country list filter based on new country name
    this.countryService.updateCountryFilter(countryName);
  }

  /**
   * Called when a country is selected from suggestion list
   * @param selectedCountry 
   */
  onCountrySelected(selectedCountry: Country) {
    this.selectedCountryChanged(selectedCountry.name);
    this._currentCountry = selectedCountry;
    this.countryCodeChange.emit(selectedCountry.code);
    // Hiding country list because is no longer needed
    this.showCountryList = false;
  }

}

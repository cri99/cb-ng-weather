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
  countryName: string = "";
  private _currentCountry: Country;

  @Input() set countryCode(newCountryCode: string){
    const countryResult = this.countryService.findCountryByCode(newCountryCode);
    if(countryResult) {
      this._currentCountry = countryResult;
      this.countryInputChanged(countryResult.name);
    }
  }

  @Output() countryCodeChange = new EventEmitter<string>();

  filteredCountries$: Observable<Country[]>
  showCountryList: boolean = false;
  private _onCountryLostFocus$ = new Subject<void>();
  private _onHideCountryList$: Observable<void>;

  constructor(
    private countryService: CountryEntryService, 
    private cdr: ChangeDetectorRef
  ) { }


  ngOnInit(): void {
    this._onHideCountryList$ = this._onCountryLostFocus$.pipe(
      filter(() => this.showCountryList === true),
      delay(100)
    );

    this._onHideCountryList$.subscribe(() => {
      this.countryName = this._currentCountry.name;
      this.showCountryList = false;
      // Triggering local change detection
      this.cdr.detach();
      this.cdr.detectChanges();
      this.cdr.reattach();
    });

    this.filteredCountries$ = this.countryService.getFilteredCountries$();
  }


  onCountryInputFocus() {
    this.showCountryList = true;
  }

  onCountryLostFocus() {
    this._onCountryLostFocus$.next();
  }

  countryInputChanged(countryName: string) {
    this.countryName = countryName;
    this.countryService.updateCountryFilter(countryName);
  }

  onCountrySelected(selectedCountry: Country) {
    this.countryInputChanged(selectedCountry.name);
    this._currentCountry = selectedCountry;
    this.countryCodeChange.emit(selectedCountry.code);
    this.showCountryList = false;
  }

}

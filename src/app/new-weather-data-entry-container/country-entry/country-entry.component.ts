import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
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

  @Input() set countryCode(newCountryCode: string){
    const countryResult = this.countryService.findCountryByCode(newCountryCode);
    if(countryResult) {
      this.countryInputChanged(countryResult.name);
    }
  }

  @Output() countryCodeChange = new EventEmitter<string>();

  filteredCountries$: Observable<Country[]>
  showCountryList = false;

  constructor(private countryService: CountryEntryService) { }


  ngOnInit(): void {
    this.filteredCountries$ = this.countryService.getFilteredCountries$();
  }


  onCountryInputFocus() {
    this.showCountryList = true;
  }

  countryInputChanged(countryName: string) {
    this.countryName = countryName;
    this.countryService.updateCountryFilter(countryName);
  }

  onCountrySelected(selectedCountry: Country) {
    this.countryInputChanged(selectedCountry.name);
    this.showCountryList = false;
    this.countryCodeChange.emit(selectedCountry.code);
  }

}

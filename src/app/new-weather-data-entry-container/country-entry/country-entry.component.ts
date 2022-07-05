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

  @Input() countryCode: string;
  @Output() countryCodeChange = new EventEmitter<string>();

  filteredCountries$: Observable<Country[]>
  showCountryList = false;

  constructor(private countryService: CountryEntryService) { }


  ngOnInit(): void {
    this.filteredCountries$ = this.countryService.getFilteredCountries$();
  }


  countryInputChanged(countryName: string) {
    this.countryService.updateCountryFilter(countryName);
  }

}

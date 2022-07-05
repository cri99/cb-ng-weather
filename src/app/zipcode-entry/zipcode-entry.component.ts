import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-zipcode-entry',
  templateUrl: './zipcode-entry.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ZipcodeEntryComponent {

  @Input() zipCode: string;
  @Output() zipCodeChange = new EventEmitter<string>();

  constructor() { }
}

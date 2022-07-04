import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter,delay, mapTo, } from "rxjs/operators";

@Component({
    selector: 'app-reactive-status-button',
    templateUrl: './reactive-status-button.component.html',
    styleUrls: ['./reactive-status-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveStatusButtonComponent implements OnInit {
    readonly BUTTON_STATUS = BUTTON_STATUS;
    @Input() asyncTask$: Observable<any> = of(void 0);
    @Output() statusChange = new EventEmitter<ButtonStatus>();

    currentStatus$: BehaviorSubject<ButtonStatus> = new BehaviorSubject<ButtonStatus>(BUTTON_STATUS.DEFAULT);
    onDoneStatus$: Observable<void>;

    ngOnInit(): void {
        this.setupOnStatusChangeEventListener();
    }

    private setupOnStatusChangeEventListener() {
        this.onDoneStatus$ = this.currentStatus$.pipe(filter(status => status === BUTTON_STATUS.DONE), mapTo(void 0));
        
        this.onDoneStatus$.pipe(
            delay(500)
        ).subscribe(() => {
            this.changeCurrentStatus(BUTTON_STATUS.DEFAULT);
        });


        this.currentStatus$.asObservable().subscribe(newStatus => {
            this.statusChange.emit(newStatus);
        });

    
    }

    executeTask(): void {
        this.changeCurrentStatus(BUTTON_STATUS.WORKING);
        this.asyncTask$.subscribe({
            complete: () => {
                this.changeCurrentStatus(BUTTON_STATUS.DONE);
            }
        })
    }

    private changeCurrentStatus(newStatus: ButtonStatus) {
        this.currentStatus$.next(newStatus);
    }
}

export const BUTTON_STATUS: {
    WORKING: WorkingStatus,
    DONE: DoneStatus,
    DEFAULT: DefaultStatus
} = {
    WORKING: 'Working',
    DONE: 'Done',
    DEFAULT: 'Default'
}

export type WorkingStatus = 'Working';
export type DoneStatus = 'Done';
export type DefaultStatus = 'Default';
export type ButtonStatus = WorkingStatus | DoneStatus | DefaultStatus;



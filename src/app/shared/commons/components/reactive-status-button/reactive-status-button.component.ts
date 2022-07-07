import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, TemplateRef } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { filter,delay, mapTo, skip } from "rxjs/operators";

@Component({
    selector: 'app-reactive-status-button',
    templateUrl: './reactive-status-button.component.html',
    styleUrls: ['./reactive-status-button.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReactiveStatusButtonComponent implements OnInit {
    readonly BUTTON_STATUS = BUTTON_STATUS;

    /**
     * @returns an observable to subscribe to on button click. It is the async task related to the button
     */
    @Input() asyncTaskFn: (...params: any[]) => Observable<any> = () => of(void 0);

    /**
     * Emit event to the parent component when button status change
     */
    @Output() statusChange = new EventEmitter<ButtonStatus>();

    /**
     * Used to emit new button status
     */
    currentStatus$: BehaviorSubject<ButtonStatus> = new BehaviorSubject<ButtonStatus>(BUTTON_STATUS.DEFAULT);
    
    /**
     * Emit event when button status change on "Done"
     */
    onDoneStatus$: Observable<void>;

    /**
     * "Done" status duration in milliseconds
     */
    @Input() doneStatusDuration = 500;

    /**
     * Default content to render
     */
    @Input() defaultContent: TemplateRef<any>;
    /**
     * Content to render when async task is executing
     */
    @Input() workingContent: TemplateRef<any>;

    /**
     * Content to render when async task is completed 
     */
    @Input() doneContent: TemplateRef<any>;


    ngOnInit(): void {
        this.setupOnStatusChangeEventListener();
    }

    private setupOnStatusChangeEventListener() {
        this.onDoneStatus$ = this.currentStatus$.pipe(
            filter(status => status === BUTTON_STATUS.DONE), 
            mapTo(void 0)
        );
        
        // When button status change to "Done" 
        this.onDoneStatus$.pipe(
            delay(this.doneStatusDuration) // waiting for doneStatusDuration ms
        ).subscribe(() => {
            // and in the end reset button status to "Default"
            this.changeCurrentStatus(BUTTON_STATUS.DEFAULT);
        });

        this.currentStatus$.asObservable().pipe(skip(1)).subscribe(newStatus => {
            // Emits button status change to parent, except the first "Default" state
            this.statusChange.emit(newStatus);
        });
    }

    /**
     * Execute task related to this button and trigger button status changes
     */
    executeTask(): void {
        this.changeCurrentStatus(BUTTON_STATUS.WORKING);
        this.asyncTaskFn().subscribe({
            complete: () => {
                this.changeCurrentStatus(BUTTON_STATUS.DONE);
            },
            error: (error) => {
                this.changeCurrentStatus(BUTTON_STATUS.DEFAULT);
                throw new Error(error);
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



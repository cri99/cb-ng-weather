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

    @Input() asyncTaskFn: (...params: any[]) => Observable<any> = () => of(void 0);
    @Output() statusChange = new EventEmitter<ButtonStatus>();

    currentStatus$: BehaviorSubject<ButtonStatus> = new BehaviorSubject<ButtonStatus>(BUTTON_STATUS.DEFAULT);
    onDoneStatus$: Observable<void>;

    @Input() doneStatusDuration = 500;

    @Input() defaultContent: TemplateRef<any>;
    @Input() workingContent: TemplateRef<any>;
    @Input() doneContent: TemplateRef<any>;


    ngOnInit(): void {
        this.setupOnStatusChangeEventListener();
    }

    private setupOnStatusChangeEventListener() {
        this.onDoneStatus$ = this.currentStatus$.pipe(
            filter(status => status === BUTTON_STATUS.DONE), 
            mapTo(void 0)
        );
        
        this.onDoneStatus$.pipe(
            delay(this.doneStatusDuration)
        ).subscribe(() => {
            this.changeCurrentStatus(BUTTON_STATUS.DEFAULT);
        });

        this.currentStatus$.asObservable().pipe(skip(1)).subscribe(newStatus => {
            this.statusChange.emit(newStatus);
        });
    }

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



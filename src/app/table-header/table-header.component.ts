import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding, HostListener,
  Input, OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {TableDataService} from "../services/table-data.service";
import {Observable, Subject, takeUntil, tap} from "rxjs";
import {ActiveSortField} from "../interfaces/active-sort-field";
import {SortingMethod} from "../interfaces/sorting-method";

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableHeaderComponent implements OnInit, OnDestroy{

  @Input() field: string;
  @Output() sortChange = new EventEmitter<{field: string, sortMethod:SortingMethod}>();

  @HostListener("click") onClick() {
    this.isActive = false;
    if(this.sortBy === 'none'){
      this.sortBy ='descending'
    }
    this.sortBy = this.sortBy === 'ascending'? 'descending' : 'ascending';
    this.ref.markForCheck();
    this.tableDataService.replaceActiveField(this.field, this.headerId);
    this.sortChange.emit({field:this.field, sortMethod:this.sortBy});
  }

  @HostBinding("class.active")
  primaryClass = false;
  isActive = false;
  sortBy: SortingMethod = 'none';
  activeSortField$ : Observable<ActiveSortField> = this.tableDataService.activeSortField$;

  private headerId : string;
  private destroy$ = new Subject<void>();

  constructor(
    private tableDataService:TableDataService,
    private ref: ChangeDetectorRef,
    ) {
  }

  ngOnInit() {
    if(this.field.length){
      this.headerId = this.field + (Date.now() - Math.trunc(Math.random() * 100)) ;
    }
    this.activeSortField$.pipe(
      tap((sortField: ActiveSortField) => {
        this.primaryClass = false;
        if(sortField.elementId !== this.headerId){
          this.sortBy = 'none';
          this.ref.markForCheck();
        }
        this.isActive =  sortField.elementId === this.headerId;
      }),
      tap((sortField: ActiveSortField) => {
        if(this.isActive){
          this.primaryClass = this.field === sortField.field;
          this.ref.markForCheck();
        }
      }),
      takeUntil(this.destroy$),
    ).subscribe()
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

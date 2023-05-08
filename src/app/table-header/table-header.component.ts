import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostBinding, HostListener,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {TableDataService} from "../services/table-data.service";
import {Observable, tap} from "rxjs";
import {ActiveSortField} from "../interfaces/active-sort-field";
import {SortingMethod} from "../interfaces/sorting-method";

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableHeaderComponent implements OnInit{

  @Input() field: string;
  @Output() toSort = new EventEmitter<{field: any, sortMethod:SortingMethod}>();

  @HostListener("click") onClick() {
    this.isActive = false;
    if(this.sortBy === 'none'){
      this.sortBy ='descending'
    }
    this.sortBy === 'ascending'? this.sortBy ='descending' : this.sortBy = 'ascending';
    this.ref.markForCheck();
    this.tableDataService.replaceActiveField(this.field, this.elementRef.nativeElement);
    this.toSort.emit({field:this.field, sortMethod:this.sortBy});
  }

  @HostBinding("class.active")
  primaryClass: boolean = false;

  @ViewChild("el") headerEl: ElementRef|undefined;

  isActive = false;
  sortBy: SortingMethod = 'none';
  activeSortField$ : Observable<ActiveSortField> = this.tableDataService.activeSortField$;

  constructor(
    private tableDataService:TableDataService,
    private ref: ChangeDetectorRef,
    private elementRef: ElementRef
    ) {
  }

  ngOnInit() {
    this.activeSortField$.pipe(
      tap((sortField: ActiveSortField) => {
        this.primaryClass = false;
        if(sortField.element !== this.elementRef.nativeElement){
          this.sortBy = 'none';
          this.ref.markForCheck();
        }
        sortField.element === this.elementRef.nativeElement ? this.isActive = true : this.isActive = false;

      }),
      tap((sortField: ActiveSortField) => {
        if(this.headerEl && this.isActive){
          this.field === sortField.field ? this.primaryClass = true : this.primaryClass = false;
          this.ref.markForCheck();
        }
      })
    ).subscribe()
  }
}

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {pairwise, startWith, Subject, takeUntil, tap} from "rxjs";
import {PaginatorData} from "../interfaces/paginator-data";

@Component({
  selector: 'app-table-paginator',
  templateUrl: './table-paginator.component.html',
  styleUrls: ['./table-paginator.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TablePaginatorComponent implements OnInit, OnDestroy {

  @Input() pageSizeOptions: number[] = [];
  @Input() set length(value: number){
    if(value === 0){
      return
    }
    this.tableLength = value;
    this.pageSizeControl.setValue(this.pageSizeOptions[0],  {
      emitEvent: false,
      onlySelf: true
    });

    this.changePagination(this.startItemIndex, this.pageSizeControl.value);
    this.ref.markForCheck();
  };

  @Output() changeTablePagination = new EventEmitter<PaginatorData>();

  pageSizeControl = this.fb.nonNullable.control<number>(0);
  tableLength = 0;
  pageIndex = 0;
  private destroy$ = new Subject<void>();

  get startItemIndex(): number{
    return this.pageIndex * this.pageSizeControl.value
  }
  get endItemIndex():number {
    return this.startItemIndex + this.pageSizeControl.value;
  }
  get isFirstPage(): boolean {
  return this.pageIndex === 0;
  }
  get isLastPage(): boolean {
    return (this.pageIndex + 1) * this.pageSizeControl.value >= this.tableLength
  }

  constructor(
    private fb: FormBuilder,
    private ref: ChangeDetectorRef
  ) {
  }

  ngOnInit():void {
    this.pageSizeControl.valueChanges.pipe(
      startWith(this.pageSizeControl.value),
      pairwise(),
      tap(([prev,next]:number[]) => {
        this.pageIndex = Math.floor((this.pageIndex * prev) / next)
        this.changePagination(this.startItemIndex, next);
        this.ref.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe()

  }

  changePagination(startItemIndex: number, pageSize : number ):void{
    const paginatorData: PaginatorData = {
      startItemIndex : startItemIndex,
      pageSize : pageSize,
    }
    this.changeTablePagination.emit(paginatorData);
    this.ref.markForCheck();
  }

  goFirstPage():void{
    this.pageIndex = 0;
    this.changePagination(this.startItemIndex,this.pageSizeControl.value)
  }

  nextPage():void{
    if(this.endItemIndex >= this.tableLength){
      return
    }
    this.pageIndex++;
    this.changePagination(this.startItemIndex,this.pageSizeControl.value);
  }

  prevPage():void{
    if(this.startItemIndex <= 0){
      return
    }
    this.pageIndex--;
    this.changePagination(this.startItemIndex,this.pageSizeControl.value);
  }

  goLastPage():void{
    if(this.endItemIndex >= this.tableLength){
      return
    }
    this.pageIndex = (this.tableLength - this.pageSizeControl.value) / this.pageSizeControl.value;
    this.changePagination(this.startItemIndex,this.pageSizeControl.value);
  }

  ngOnDestroy():void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

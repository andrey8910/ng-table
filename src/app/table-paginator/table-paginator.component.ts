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
import { Subject, takeUntil, tap} from "rxjs";
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

    this.changePagination(this.startItemIndex, this.pageIndex, this.pageSizeControl.value,value);
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
      tap((size:number) => {
        if(this.startItemIndex >= this.tableLength){
          return
        }

        if(this.startItemIndex <= this.tableLength  - size){
          this.changePagination(this.startItemIndex, this.pageIndex,size,this.tableLength);
        }
        this.ref.markForCheck();
      }),
      takeUntil(this.destroy$)
    ).subscribe()

  }

  changePagination(startItemIndex: number,pageIndex: number, pageSize : number, length: number):void{
    const paginatorData: PaginatorData = {
      startItemIndex : startItemIndex,
      pageIndex : pageIndex,
      pageSize : pageSize,
      tableLength : length
    }
    this.changeTablePagination.emit(paginatorData);
    this.ref.markForCheck();
  }

  goFirstPage():void{
    this.pageIndex = 0;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength)
  }

  nextPage():void{
    if(this.endItemIndex >= this.tableLength){
      return
    }
    this.pageIndex++;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
  }

  prevPage():void{
    if(this.startItemIndex <= 0){
      return
    }
    this.pageIndex--;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
  }

  goLastPage():void{
    if(this.endItemIndex >= this.tableLength){
      return
    }
    this.pageIndex = (this.tableLength - this.pageSizeControl.value) / this.pageSizeControl.value;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
  }

  ngOnDestroy():void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

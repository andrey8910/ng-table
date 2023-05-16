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
    this.endItemIndex = this.startItemIndex + this.pageSizeControl.value;
    this.changePagination(this.startItemIndex, this.pageIndex, this.pageSizeControl.value,value);
    if(this.pageIndex === 0){
      this.isFirstPage = true;
    }
    this.ref.markForCheck();
  };

  @Output() changeTablePagination = new EventEmitter<PaginatorData>();

  pageSizeControl = this.fb.nonNullable.control<number>(0);
  pageIndex = 0;
  startItemIndex = 0;
  endItemIndex = 0;
  tableLength = 0;
  isFirstPage = false;
  isLastPage = false;

  private destroy$ = new Subject<void>();

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

        this.isLastPage = this.startItemIndex >= this.tableLength  - size;
        this.isFirstPage = this.pageIndex <= 0;


        if(this.startItemIndex <= this.tableLength  - size){
          this.pageIndex = Math.round(this.startItemIndex / size);
          this.endItemIndex = this.startItemIndex + this.pageSizeControl.value;
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
    this.endItemIndex = this.startItemIndex + this.pageSizeControl.value;
    this.changeTablePagination.emit(paginatorData);
    this.ref.markForCheck();
  }

  goFirstPage():void{
    this.pageIndex = 0;
    this.startItemIndex =0;
    this.isFirstPage = true;
    this.isLastPage = false;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength)
  }

  nextPage():void{
    if(this.pageIndex >= this.tableLength / this.pageSizeControl.value - 1){
      this.isLastPage = true;
      return
    }
    this.pageIndex++;
    this.isFirstPage = false;
    if(this.startItemIndex < this.tableLength){
      this.startItemIndex += this.pageSizeControl.value;
    }

    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
  }

  prevPage():void{
    if(this.pageIndex <= 0){
      this.isFirstPage = true;
      return
    }

    if(this.startItemIndex < this.pageSizeControl.value){
      this.startItemIndex = 0;
      this.pageIndex = 0;
      this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
      return
    }

    if(this.startItemIndex > 0){
      this.pageIndex--;
      this.isLastPage = false;
      this.startItemIndex -= this.pageSizeControl.value;
      this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
    }
  }

  goLastPage():void{
    if(this.pageIndex >= this.tableLength / this.pageSizeControl.value - 1){
      return
    }
    this.pageIndex = (this.tableLength - this.pageSizeControl.value) / this.pageSizeControl.value;
    this.startItemIndex = this.tableLength - this.pageSizeControl.value;
    this.isLastPage = true;
    this.isFirstPage = false;
    this.changePagination(this.startItemIndex,this.pageIndex,this.pageSizeControl.value,this.tableLength);
  }

  ngOnDestroy():void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

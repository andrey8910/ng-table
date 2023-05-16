import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TableDataService} from "../services/table-data.service";
import {SortingMethod} from "../interfaces/sorting-method";
import {PaginatorData} from "../interfaces/paginator-data";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent {
  @Input() set tableDataSource(valueParam:Record<string, any>[] | null) {
    if(!valueParam){
      return
    }
    this._tableData = valueParam;
    if(this.tableFields.length === 0 && valueParam.length){
      this.tableDataSourceLength = valueParam.length
      this.tableFields = Object.keys(valueParam[0]);
      this.tableFieldsControl.setValue(this.tableFields.slice(0, this.defaultNumberFields));
    }
    this.ref.markForCheck();
  };

  @Input() defaultNumberFields: number;
  @Input() pagination: boolean;

  tableFields: string[] = [];
  tableFieldsControl = this.fb.nonNullable.control(['']);
  tableDataSourceLength: number;
  startItemIndex = 0;
  tablePagination: Record<string, any>[] = [];

  private _tableData : Record<string, any>[];

  get tableDataSource(): Record<string, any>[]{
    if(!this._tableData){
      return []
    }
    return this._tableData;
  }

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private tableDataService: TableDataService,
  ) {
  }

  public sortBy(toSort: { field: string, sortMethod: SortingMethod }): void {
   if(!this.tableDataSource){
     return
   }
   if(!this.pagination){
     this.tableDataSource = [...this.tableDataService.sortData(this.tableDataSource, toSort.field, toSort.sortMethod)];
     this.ref.markForCheck();
     return;
   }
   this.tablePagination = [...this.tableDataService.sortData(this.tablePagination, toSort.field, toSort.sortMethod)];
   this.ref.markForCheck();
  }

  changePagination(dataPaginator : PaginatorData){

    if(!this.tableDataSource){
      return
    }

    if(this.tableDataSource.length){
     this.tablePagination = [...this.tableDataService.changePagination(this.tableDataSource, dataPaginator)];
     this.ref.markForCheck();
    }

  }
}

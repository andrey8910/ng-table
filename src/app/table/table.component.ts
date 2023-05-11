import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TableDataService} from "../services/table-data.service";
import {SortingMethod} from "../interfaces/sorting-method";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class TableComponent {
  @Input() set tableDataSource(valueParam:Record<string, any>[] | null) {
    if(!valueParam || valueParam.length === 0){
      return
    }
    this._tableData = valueParam;
    if(this.tableFields.length === 0){
      this.tableFields = Object.keys(valueParam[0]);
      this.tableFieldsControl.setValue(this.tableFields.slice(0, this.defaultNumberFields));
    }
  };

  @Input() defaultNumberFields: number;

  tableFields: string[] = [];
  tableFieldsControl = this.fb.nonNullable.control(['']);

  private _tableData : Record<string, any>[] | null;

  get tableDataSource(): Record<string, any>[] | null{
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
   this.tableDataSource = [...this.tableDataService.sortData(this.tableDataSource, toSort.field, toSort.sortMethod)];
   this.ref.markForCheck();
  }
}

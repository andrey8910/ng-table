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
  @Input('tableSource') set tableDataSource(valueParam:Record<string, any>[] | null) {
    if(!valueParam || valueParam.length === 0){
      return
    }
    this._tableData = valueParam;
    this.tableFields = Object.keys(this._tableData[0]);
    //console.log(this.tableFields, Date.now())
    this.tableFieldsControl.setValue(this.tableFields.slice(0, this.defaultNumberFields));
  };

  @Input() defaultNumberFields: number;

  tableData: Record<string, any>[] = [];
  tableFields: string[] = [];
  tableFieldsControl = this.fb.nonNullable.control(['']);
  tableCreationTime = Date.now();

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

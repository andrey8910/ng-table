import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges
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
export class TableComponent<T> implements  OnChanges {
  @Input('tableData$') tableDataSource : T[]|null;
  @Input() defaultFields: number;

  sortToggle = false;
  tableData : any[] = [];
  tableFields : string[] = [];

  tableFieldsControl = this.fb.nonNullable.control(['']);

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
    private tableDataService: TableDataService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if(this.tableDataSource && this.tableDataSource.length){
      const firstItem = this.tableDataSource[0];
      if(firstItem){
        this.tableFields = Object.keys(firstItem);
        this.tableFieldsControl.setValue(this.tableFields.slice(0,this.defaultFields));
      }
      this.tableData = [...this.tableDataSource];
      this.ref.markForCheck();
    }
  }

  public sortBy(toSort: {field:string,sortMethod:SortingMethod}):void{
    this.tableData = [...this.tableDataService.sortData(this.tableData, toSort.field, toSort.sortMethod)];
    this.ref.markForCheck();
  }
}

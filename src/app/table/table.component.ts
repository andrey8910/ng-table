import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {TableDataService} from "../services/table-data.service";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, OnChanges {
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


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.tableDataSource && this.tableDataSource.length){
      const firstItem = this.tableDataSource[0];
      if(firstItem){
        this.tableFields = Object.keys(firstItem);
        this.tableFieldsControl.setValue(this.tableFields.slice(0,this.defaultFields));
      }
      this.tableData = [...this.tableDataSource, ...this.tableData];
      this.ref.markForCheck();
    }
  }

  public sortBy(target: EventTarget | null):void{

    const sortBtn = target as HTMLElement;
    const sortHeaders = document.querySelectorAll('.table-header');

    sortHeaders.forEach(el => {
      if(el.classList.contains('active')){
        el.classList.remove('active');
      }
      if(el !== sortBtn){
        el.removeAttribute('data-sortbyvalue');
      }
      this.ref.markForCheck();
    })

    if(sortBtn.dataset['sortheadervalue']){
      sortBtn.dataset['sortbyvalue'] === 'up' ? sortBtn.dataset['sortbyvalue'] = 'down' : sortBtn.dataset['sortbyvalue'] = 'up';
      this.tableData = [...this.tableDataService.sortData(this.tableData, sortBtn.dataset['sortheadervalue'], sortBtn.dataset['sortbyvalue'])];
      sortBtn.classList.add('active');
      this.ref.markForCheck();
    }

  }

}

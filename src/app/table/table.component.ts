import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {FormBuilder} from "@angular/forms";


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent<T> implements OnInit, OnChanges {
  @Input('tableData$') tableDataSource : T[]|null;

  sortToggle = false;
  tableData : any[] = [];
  tableFields : string[] = [];

  tableFieldsControl = this.fb.nonNullable.control(['']);

  constructor(
    private ref: ChangeDetectorRef,
    private fb: FormBuilder,
  ) {}


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if(this.tableDataSource && this.tableDataSource.length){
      const firstItem = this.tableDataSource[0];
      if(firstItem){
        this.tableFields = Object.keys(firstItem);
        this.tableFieldsControl.setValue(this.tableFields.slice(0,5));
      }
      this.tableData = [...this.tableDataSource, ...this.tableData];
      this.ref.markForCheck();
    }
  }

  public sortBy(target: EventTarget | null):void{

    const sortBtn = target as HTMLElement;
    const sortHeaders = document.querySelectorAll('.table-header');
    const dataHeader = sortBtn.dataset['sortheadervalue'];
    const dataSortBy = sortBtn.dataset['sortbyvalue'];

    sortHeaders.forEach(el => {
      if(el.classList.contains('active')){
        el.classList.remove('active');
        this.ref.markForCheck();
      }
      if(el !== sortBtn){
        el.removeAttribute('data-sortbyvalue');
      }
    })

    if(!dataSortBy && dataHeader){
      sortBtn.dataset['sortbyvalue'] = 'up';
      this.ref.markForCheck();
    }


    if(sortBtn.dataset['sortbyvalue'] && dataHeader){
      dataSortBy === 'up' ? sortBtn.dataset['sortbyvalue'] = 'down' : sortBtn.dataset['sortbyvalue'] = 'up';
      this.ref.markForCheck();
      this.sort(dataHeader, sortBtn.dataset['sortbyvalue']);
    }

    sortBtn.classList.add('active');


  }

  private sort(what: string, how: string): void {
    if(!this.tableData.length){
      return
    }
    if(how == 'up' && this.tableData.length){
      this.tableData.sort((a, b) => a[what] < b[what] ? 1 : -1);
      this.ref.markForCheck();
    }

    if(how == 'down'){
      this.tableData.sort((a, b) => a[what] > b[what] ? 1 : -1);
      this.ref.markForCheck();
    }

  }

}

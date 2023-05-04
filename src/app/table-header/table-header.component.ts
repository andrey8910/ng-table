import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent {

  @Input() field: string;
  @Output() onSort = new EventEmitter<EventTarget | null>();

  public sortBy(target: EventTarget | null){
    this.onSort.emit(target)
  }

}

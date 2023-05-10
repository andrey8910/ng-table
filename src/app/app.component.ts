import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {TableDataService} from "./services/table-data.service";
import {Observable} from "rxjs";
import {ProductData} from "./interfaces/product-data";
import {UsersData} from "./interfaces/users-data";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class AppComponent implements OnInit{
  title = 'ng-table';

  showProductsNotFound = false;
  allProductsData$: Observable<ProductData[]>;
  allUsersData$: Observable<UsersData[]>;

  constructor(
    private tableDataService: TableDataService,
  ) {
  }

  ngOnInit() {
    this.tableDataService.loadAllProducts();
    this.tableDataService.loadAllUsers();
    this.allProductsData$ = this.tableDataService.allProductsData$
    this.allUsersData$ = this.tableDataService.allUsersData$
  }

}

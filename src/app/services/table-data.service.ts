import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, tap} from "rxjs";
import {AllProductsData} from "../interfaces/all-products-data";
import {ProductData} from "../interfaces/product-data";
import {AllUsersData} from "../interfaces/all-users-data";
import {UsersData} from "../interfaces/users-data";

@Injectable({
  providedIn: 'root'
})
export class TableDataService {

  private allProductsData = new BehaviorSubject<ProductData[]>([]);
  readonly allProductsData$ = this.allProductsData.asObservable();

  private allUsersData = new BehaviorSubject<UsersData[]>([]);
  readonly allUsersData$ = this.allUsersData.asObservable();

  constructor(private httpClient : HttpClient) { }

  loadAllProducts(): void{
     this.httpClient.get<AllProductsData>('https://dummyjson.com/products?limit=100').pipe(
       tap((allProducts: AllProductsData) => {
         this.allProductsData.next(Object.assign([], allProducts.products));
       }),
       catchError((err) => {
         throw 'error in source. Details: ' + err;
       })
     ).subscribe();
  }

  loadAllUsers(): void{
    this.httpClient.get<AllUsersData>('https://dummyjson.com/users?limit=100').pipe(
      tap((allUsersData: AllUsersData) => {
        this.allUsersData.next(Object.assign([], allUsersData.users));
      }),
      catchError((err) => {
        throw 'error in source. Details: ' + err;
      })
    ).subscribe();
  }

  sortData(sortData: any[], field:string, sortBy: string ):ProductData[] | UsersData[]{

    if(!sortData){
      return []
    }

    if(sortBy === 'up' ){
      return sortData.sort((a , b) => a[field] > b[field] ? 1 : -1);
    }

    if(sortBy === 'down'){
      return sortData.sort((a , b) => a[field] < b[field] ? 1 : -1);
    }
    return sortData
  }

}

import { Injectable } from '@angular/core';
import { Table } from 'primeng/table';

@Injectable({
  providedIn: 'root'
})
export class TableShortService {

  constructor() { }

  clear(table: Table) {
    table.clear();
  }
}

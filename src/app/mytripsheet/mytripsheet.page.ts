import { Component, OnInit } from '@angular/core';
import {formatDate } from '@angular/common';

@Component({
  selector: 'app-mytripsheet',
  templateUrl: './mytripsheet.page.html',
  styleUrls: ['./mytripsheet.page.scss'],
})
export class MytripsheetPage implements OnInit {

  today= new Date();
  maxdate= new Date();
  dbdate='';
  maxDate=this.maxdate.setMonth(this.maxdate.getMonth()+2);

  fromdate:any;
  todate:any;
  constructor() { }

  ngOnInit() {

    this.dbdate = formatDate(this.today, 'yyyy-MM-dd', 'en-US', '+0530');
    this.fromdate=this.dbdate;
    this.todate=this.dbdate;
  }

}

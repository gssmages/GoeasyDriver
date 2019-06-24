import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripsummaryPage } from './mytripsummary.page';

describe('MytripsummaryPage', () => {
  let component: MytripsummaryPage;
  let fixture: ComponentFixture<MytripsummaryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripsummaryPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripsummaryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

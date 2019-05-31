import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MytripsheetPage } from './mytripsheet.page';

describe('MytripsheetPage', () => {
  let component: MytripsheetPage;
  let fixture: ComponentFixture<MytripsheetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MytripsheetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MytripsheetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

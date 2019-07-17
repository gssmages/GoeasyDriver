import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AreamodalComponent } from './areamodal.component';

describe('AreamodalComponent', () => {
  let component: AreamodalComponent;
  let fixture: ComponentFixture<AreamodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AreamodalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AreamodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

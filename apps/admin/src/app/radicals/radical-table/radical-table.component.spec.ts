import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicalTableComponent } from './radical-table.component';

describe('RadicalTableComponent', () => {
  let component: RadicalTableComponent;
  let fixture: ComponentFixture<RadicalTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadicalTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicalTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

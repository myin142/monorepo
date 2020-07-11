import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RadicalsComponent } from './radicals.component';

describe('RadicalsComponent', () => {
  let component: RadicalsComponent;
  let fixture: ComponentFixture<RadicalsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RadicalsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RadicalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

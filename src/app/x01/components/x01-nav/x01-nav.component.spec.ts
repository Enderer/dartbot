import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { X01NavComponent } from './x01-nav.component';

xdescribe('X01NavComponent', () => {
  let component: X01NavComponent;
  let fixture: ComponentFixture<X01NavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ X01NavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(X01NavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

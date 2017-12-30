import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { X01GameboardComponent } from './x01-gameboard.component';

xdescribe('X01GameboardComponent', () => {
  let component: X01GameboardComponent;
  let fixture: ComponentFixture<X01GameboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ X01GameboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(X01GameboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

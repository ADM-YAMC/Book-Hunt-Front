import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WiewBookComponent } from './wiew-book.component';

describe('WiewBookComponent', () => {
  let component: WiewBookComponent;
  let fixture: ComponentFixture<WiewBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WiewBookComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WiewBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutorSettingsComponent } from './autor-settings.component';

describe('AutorSettingsComponent', () => {
  let component: AutorSettingsComponent;
  let fixture: ComponentFixture<AutorSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutorSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AutorSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTabModalComponent } from './select-tab-modal.component';

describe('SelectTabModalComponent', () => {
  let component: SelectTabModalComponent;
  let fixture: ComponentFixture<SelectTabModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectTabModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTabModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

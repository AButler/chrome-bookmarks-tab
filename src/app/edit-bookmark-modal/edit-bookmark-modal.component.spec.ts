import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBookmarkModalComponent } from './edit-bookmark-modal.component';

describe('EditBookmarkModalComponent', () => {
  let component: EditBookmarkModalComponent;
  let fixture: ComponentFixture<EditBookmarkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBookmarkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBookmarkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

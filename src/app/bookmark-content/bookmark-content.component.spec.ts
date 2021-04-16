import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarkContentComponent } from './bookmark-content.component';

describe('BookmarkContentComponent', () => {
  let component: BookmarkContentComponent;
  let fixture: ComponentFixture<BookmarkContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookmarkContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookmarkContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

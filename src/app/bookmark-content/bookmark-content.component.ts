import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkData, BookmarkItem } from '../bookmarks';
import { EditBookmarkModalComponent } from '../edit-bookmark-modal/edit-bookmark-modal.component';

@Component({
  selector: 'app-bookmark-content',
  templateUrl: './bookmark-content.component.html',
  styleUrls: ['./bookmark-content.component.scss']
})
export class BookmarkContentComponent implements OnInit {
  @Input() editMode!: boolean;
  @Input() bookmarks!: BookmarkData;

  constructor(private modalService: NgbModal) {}

  ngOnInit(): void {}

  async selectItem(item: BookmarkItem): Promise<void> {
    if (!this.editMode) {
      return;
    }

    //alert(`item selected: [${item.id}] ${item.title}`);
    const modal = this.modalService.open(EditBookmarkModalComponent);
    modal.componentInstance.item = { ...item };

    const result = await modal.result;

    if (result === 'save') {
      const updatedItem = modal.componentInstance.item as BookmarkItem;

      item.title = updatedItem.title;
      item.href = updatedItem.href;
    }
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkData, BookmarkItem, Column } from '../bookmarks';
import { EditBookmarkModalComponent } from '../edit-bookmark-modal/edit-bookmark-modal.component';
import { EditColumnModalComponent } from '../edit-column-modal/edit-column-modal.component';
import { SimpleflakeService } from '../simpleflake.service';

@Component({
  selector: 'app-bookmark-content',
  templateUrl: './bookmark-content.component.html',
  styleUrls: ['./bookmark-content.component.scss']
})
export class BookmarkContentComponent implements OnInit {
  @Input() editMode!: boolean;
  @Input() bookmarks!: BookmarkData;

  constructor(
    private simpleflakeService: SimpleflakeService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  async addColumn() {
    if (!this.editMode) {
      return;
    }

    const column: Column = {
      id: this.simpleflakeService.generate(),
      header: '',
      items: []
    };

    const modal = this.modalService.open(EditColumnModalComponent);
    modal.componentInstance.isNew = true;
    modal.componentInstance.column = { ...column };

    const result = await modal.result;

    if (result === 'save') {
      const newColumn = modal.componentInstance.column as Column;
      this.bookmarks.columns.push(newColumn);
    }
  }

  async editColumn(column: Column) {
    if (!this.editMode) {
      return;
    }

    const modal = this.modalService.open(EditColumnModalComponent);
    modal.componentInstance.column = { ...column };

    const result = await modal.result;

    if (result === 'save') {
      const updatedColumn = modal.componentInstance.column as Column;

      column.header = updatedColumn.header;
    }
  }

  async addItem(column: Column): Promise<void> {
    if (!this.editMode) {
      return;
    }

    const item: BookmarkItem = {
      id: this.simpleflakeService.generate(),
      title: '',
      href: ''
    };

    const modal = this.modalService.open(EditBookmarkModalComponent);
    modal.componentInstance.isNew = true;
    modal.componentInstance.item = { ...item };

    const result = await modal.result;

    if (result === 'save') {
      const newItem = modal.componentInstance.item as BookmarkItem;
      column.items.push(newItem);
    }
  }

  async selectItem(item: BookmarkItem): Promise<void> {
    if (!this.editMode) {
      return;
    }

    const modal = this.modalService.open(EditBookmarkModalComponent);
    modal.componentInstance.item = { ...item };

    const result = await modal.result;

    if (result === 'save') {
      const updatedItem = modal.componentInstance.item as BookmarkItem;

      item.title = updatedItem.title;
      item.href = updatedItem.href;
      item.image = updatedItem.image;
    }
  }
}

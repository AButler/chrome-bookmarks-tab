import { Component, Input, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DndDropEvent } from 'ngx-drag-drop';
import { NgxSpinnerService } from 'ngx-spinner';
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
  dragging: boolean = false;
  navigatingBookmark?: BookmarkItem;

  constructor(
    private simpleflakeService: SimpleflakeService,
    private modalService: NgbModal,
    private spinnerService: NgxSpinnerService
  ) {}

  ngOnInit(): void {}

  onBookmarkClicked(item: BookmarkItem) {
    this.navigatingBookmark = item;
    this.spinnerService.show(item.id);
  }

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

    switch (result) {
      case 'save':
        const updatedItem = modal.componentInstance.item as BookmarkItem;

        item.title = updatedItem.title;
        item.href = updatedItem.href;
        item.image = updatedItem.image;
        break;
      case 'delete':
        const column = this.bookmarks.columns.find(
          c => !!c.items.find(i => i === item)
        );

        if (!column) {
          return;
        }

        await this.removeItem(column, item);
        break;
    }
  }

  async removeItem(column: Column, item: BookmarkItem): Promise<void> {
    if (!this.editMode) {
      return;
    }

    const index = column.items.indexOf(item);
    column.items.splice(index, 1);
  }

  onDragged(item: BookmarkItem, column: Column) {
    const index = column.items.indexOf(item);
    column.items.splice(index, 1);
  }

  onDrop(event: DndDropEvent, column: Column) {
    const index =
      typeof event.index === 'undefined'
        ? column.items.length
        : event.index - 1;

    column.items.splice(index, 0, event.data);
  }

  onDropNewColumn(event: DndDropEvent) {
    const newColumn: Column = {
      id: this.simpleflakeService.generate(),
      header: 'New Column',
      items: [event.data]
    };

    this.bookmarks.columns.push(newColumn);
  }
}

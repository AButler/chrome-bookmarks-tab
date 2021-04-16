import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkItem } from '../bookmarks';

@Component({
  selector: 'app-edit-bookmark-modal',
  templateUrl: './edit-bookmark-modal.component.html',
  styleUrls: ['./edit-bookmark-modal.component.scss']
})
export class EditBookmarkModalComponent implements OnInit {
  @Input() item!: BookmarkItem;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}

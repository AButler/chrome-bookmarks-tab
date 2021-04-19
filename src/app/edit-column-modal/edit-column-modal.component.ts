import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Column } from '../bookmarks';

@Component({
  selector: 'app-edit-column-modal',
  templateUrl: './edit-column-modal.component.html',
  styleUrls: ['./edit-column-modal.component.scss']
})
export class EditColumnModalComponent implements OnInit {
  @Input() column!: Column;
  @Input() isNew: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}

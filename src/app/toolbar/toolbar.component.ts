import { EventEmitter } from '@angular/core';
import { Output } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {
  @Input() editMode!: boolean;
  @Output() editModeChanged = new EventEmitter<boolean>();
  @Output() import = new EventEmitter();
  @Output() export = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  toggleEditMode() {
    this.editMode = !this.editMode;
    this.editModeChanged.emit(this.editMode);
  }
}

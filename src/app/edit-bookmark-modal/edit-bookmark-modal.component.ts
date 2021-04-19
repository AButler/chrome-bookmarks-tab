import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkItem } from '../bookmarks';

@Component({
  selector: 'app-edit-bookmark-modal',
  templateUrl: './edit-bookmark-modal.component.html',
  styleUrls: ['./edit-bookmark-modal.component.scss']
})
export class EditBookmarkModalComponent implements OnInit {
  @ViewChild('imageFile') imageFile!: ElementRef<HTMLInputElement>;
  @Input() item!: BookmarkItem;
  @Input() isNew: boolean = false;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  removeImage() {
    delete this.item.image;
  }

  imageFileChanged(e: Event) {
    const input = this?.imageFile?.nativeElement;
    if (!input) {
      console.error('could not find input');
    }

    console.log('input file changed', e);

    const file = input?.files?.item(0);

    const reader = new FileReader();

    reader.addEventListener(
      'load',
      () => {
        this.item.image = reader.result as string;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }

    this.imageFile.nativeElement.value = '';
  }
}

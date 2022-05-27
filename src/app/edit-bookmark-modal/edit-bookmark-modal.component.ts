import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BookmarkItem } from '../bookmarks';
import { SelectTabModalComponent } from '../select-tab-modal/select-tab-modal.component';

@Component({
  selector: 'app-edit-bookmark-modal',
  templateUrl: './edit-bookmark-modal.component.html',
  styleUrls: ['./edit-bookmark-modal.component.scss']
})
export class EditBookmarkModalComponent implements OnInit {
  @ViewChild('imageFile') imageFile!: ElementRef<HTMLInputElement>;
  @Input() item!: BookmarkItem;
  @Input() isNew = false;

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  removeImage(): void {
    delete this.item.image;
  }

  imageFileChanged(e: Event): void {
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

  async captureScreenshot(item: BookmarkItem): Promise<void> {
    const modal = this.modalService.open(SelectTabModalComponent, {
      size: 'xl'
    });
    modal.componentInstance.item = item;

    const result = await modal.result;

    if (result === 'select') {
      const newImage = modal.componentInstance.image;
      this.item.image = newImage;
    }
  }
}

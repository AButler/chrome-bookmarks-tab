import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CroppedEvent } from 'ngx-photo-editor';
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
  imageBase64 = '';

  constructor(
    public activeModal: NgbActiveModal,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {}

  removeImage(): void {
    delete this.item.image;
  }

  async imageFileChanged(e: Event): Promise<void> {
    const input = this?.imageFile?.nativeElement;

    if (!input) {
      console.error('could not find input');
      return;
    }

    const newImage = await this.readFileAsBase64(input);

    this.imageBase64 = newImage;

    input.value = '';
  }

  imageCropped(event: CroppedEvent): void {
    this.imageBase64 = '';
    this.item.image = event.base64;
  }

  async captureScreenshot(item: BookmarkItem): Promise<void> {
    const modal = this.modalService.open(SelectTabModalComponent, {
      size: 'xl'
    });
    modal.componentInstance.item = item;

    const result = await modal.result;

    if (result === 'select') {
      const newImage = modal.componentInstance.image;
      this.imageBase64 = newImage;
    }
  }

  async readFileAsBase64(input: HTMLInputElement): Promise<string> {
    if (!input) {
      return Promise.reject('could not find input');
    }

    const file = input.files?.item(0);
    if (!file) {
      return Promise.reject('no file');
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.addEventListener(
        'load',
        () => {
          resolve(reader.result as string);
        },
        false
      );

      try {
        reader.readAsDataURL(file);
      } catch (e) {
        reject(e);
      }
    });
  }
}

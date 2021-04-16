import { Component, ElementRef, ViewChild } from '@angular/core';
import { BookmarkData, BookmarkItem } from './bookmarks';
import { ExportedBookmarks } from './exported-bookmarks';
import { ImportExportService } from './import-export.service';

function downloadObjectAsJson(data: ExportedBookmarks, filename: string): void {
  const json = JSON.stringify(data);

  var dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
  var htmlAnchor = document.createElement('a');
  htmlAnchor.setAttribute('href', dataStr);
  htmlAnchor.setAttribute('download', filename);
  document.body.appendChild(htmlAnchor);
  htmlAnchor.click();
  htmlAnchor.remove();
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @ViewChild('importFile') importFile!: ElementRef<HTMLInputElement>;

  title = 'chrome-bookmarks-tab';
  editMode = false;
  bookmarks: BookmarkData;

  constructor(private importExportService: ImportExportService) {
    this.bookmarks = importExportService.getDefaultData();
    this.load();
  }

  private load() {
    try {
      const bookmarks = this.importExportService.load();

      if (!bookmarks) {
        this.bookmarks = this.importExportService.getDefaultData();
        this.editMode = true;
        return;
      }

      this.bookmarks = bookmarks;
      this.editMode = false;
    } catch (e) {
      console.warn('invalid data');
      this.bookmarks = this.importExportService.getDefaultData();
      this.editMode = true;
    }
  }

  editModeChanged(newEditMode: boolean) {
    this.editMode = newEditMode;
  }

  import() {
    this.importFile.nativeElement.click();
  }

  export() {
    const exportedData = this.importExportService.export(this.bookmarks);

    downloadObjectAsJson(exportedData, 'bookmark-data.json');
  }

  save() {
    alert('save');
  }

  cancelSave() {
    this.load();
  }

  selectItem(item: BookmarkItem) {
    if (!this.editMode) {
      return;
    }
    alert(`item selected: [${item.id}] ${item.title}`);
  }

  importFileChanged(evt: Event) {
    const input = this?.importFile?.nativeElement;
    if (!input) {
      console.error('could not find input');
    }

    console.log('input file changed', evt);

    const file = input?.files?.item(0);
    if (!file) {
      console.warn('no file selected');
      return;
    }

    const fileReader = new FileReader();

    fileReader.onload = _ => {
      const data = fileReader.result as string;

      try {
        this.bookmarks = this.importExportService.import(data);
        this.editMode = false;
      } catch (e) {
        console.error('error importing', e);
      } finally {
        this.importFile.nativeElement.value = '';
      }
    };

    fileReader.readAsText(file);
  }
}

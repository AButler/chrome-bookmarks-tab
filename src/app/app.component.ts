import { Component, ElementRef, ViewChild } from '@angular/core';
import { BookmarkData, BookmarkItem } from './bookmarks';
import { ExportedBookmarks } from './exported-bookmarks';
import { ImportExportService } from './import-export.service';

function downloadObjectAsJson(data: ExportedBookmarks, filename: string): void {
  const json = JSON.stringify(data);

  const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(json)}`;
  const htmlAnchor = document.createElement('a');
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

  private load(): void {
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

  editModeChanged(newEditMode: boolean): void {
    this.editMode = newEditMode;
  }

  import(): void {
    this.importFile.nativeElement.click();
  }

  export(): void {
    const exportedData = this.importExportService.export(this.bookmarks);

    downloadObjectAsJson(exportedData, 'bookmark-data.json');
  }

  save(): void {
    const exportedData = this.importExportService.export(this.bookmarks);
    this.bookmarks = this.importExportService.import(
      JSON.stringify(exportedData)
    );
    this.editMode = false;
  }

  cancelSave(): void {
    this.load();
  }

  importFileChanged(evt: Event): void {
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

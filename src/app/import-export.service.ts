import { Injectable } from '@angular/core';
import { BookmarkData, BookmarkItem, Column } from './bookmarks';
import { ExportedBookmarks } from './exported-bookmarks';

@Injectable({
  providedIn: 'root'
})
export class ImportExportService {
  constructor() {}

  import(data: string): BookmarkData {
    const json = JSON.parse(data);

    if (!json || !json.metaData || json.metaData.version !== 1) {
      throw new Error('invalid import file');
    }

    const ids: string[] = [];
    const bookmarks: BookmarkData = { columns: [] };

    if (!json.bookmarks || !json.bookmarks.columns) {
      throw new Error('no bookmarks in file');
    }

    for (const importedColumn of json.bookmarks.columns) {
      if (!importedColumn.id) {
        continue;
      }

      if (ids.find(x => x === importedColumn.id)) {
        throw new Error(`duplicate id: ${importedColumn.id}`);
      }
      ids.push(importedColumn.id);

      const column: Column = {
        id: importedColumn.id,
        header: importedColumn.header,
        items: []
      };

      for (const importedItem of importedColumn.items) {
        if (!importedItem.id || !importedItem.href) {
          continue;
        }

        if (ids.find(x => x === importedItem.id)) {
          throw new Error(`duplicate id: ${importedItem.id}`);
        }
        ids.push(importedColumn.id);

        const item: BookmarkItem = {
          id: importedItem.id,
          title: importedItem.title,
          href: importedItem.href
        };

        column.items.push(item);
      }

      bookmarks.columns.push(column);
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    if (json.images) {
      for (const imageKey in json.images) {
        if (ids.find(x => x === imageKey)) {
          console.warn('image not referenced, skipping');
          continue;
        }

        const imageData = json.images[imageKey];
        if (
          typeof imageData !== 'string' ||
          !imageData.startsWith('data:image/')
        ) {
          console.warn(`invalid image ${imageKey}`);
          continue;
        }

        localStorage.setItem(`img-${imageKey}`, imageData);
      }
    }

    //TODO: clean up images that are no longer referenced
    this.applyImages(bookmarks);

    return bookmarks;
  }

  export(data: BookmarkData): ExportedBookmarks {
    const bookmarks = JSON.parse(JSON.stringify(data));
    const images: any = {};

    for (const bookmark of bookmarks.columns) {
      delete bookmark.$$hashKey;

      for (const item of bookmark.items) {
        if (item.image) {
          images[item.id] = item.image;
        }

        delete item.$$hashKey;
        delete item.image;
      }
    }

    const exportedData: ExportedBookmarks = {
      bookmarks: bookmarks,
      images: images,
      metaData: {
        exportedOn: new Date().toISOString(),
        version: 1
      }
    };

    return exportedData;
  }

  load(): BookmarkData | null {
    const bookmarksData = localStorage.getItem('bookmarks');
    if (!bookmarksData) {
      return null;
    }

    const bookmarks = JSON.parse(bookmarksData);
    this.applyImages(bookmarks);

    return bookmarks;
  }

  getDefaultData(): BookmarkData {
    return { columns: [] };
  }

  private applyImages(bookmarks: BookmarkData) {
    for (const bookmark of bookmarks.columns) {
      for (const item of bookmark.items) {
        const image = localStorage.getItem(`img-${item.id}`);
        if (image) {
          item.image = image;
        } else {
          delete item.image;
        }
      }
    }
  }
}

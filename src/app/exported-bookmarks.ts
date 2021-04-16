export interface ExportedBookmarkItem {
  id: string;
  title: string;
  href: string;
}

export interface ExportedColumn {
  id: string;
  header: string;
  items: ExportedBookmarkItem[];
}

export interface ExportedBookmarkData {
  columns: ExportedColumn[];
}

export interface ExportedBookmarks {
  bookmarks: ExportedBookmarkData;
  images: { [key: string]: string };
  metaData: {
    exportedOn: string;
    version: number;
  };
}

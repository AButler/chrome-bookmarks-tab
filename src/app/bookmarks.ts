export interface BookmarkItem {
  id: string;
  title: string;
  href: string;
  image?: string;
}

export interface Column {
  id: string;
  header: string;
  items: BookmarkItem[];
}

export interface BookmarkData {
  columns: Column[];
}

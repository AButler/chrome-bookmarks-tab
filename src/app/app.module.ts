import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FooterComponent } from './footer/footer.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BannerComponent } from './banner/banner.component';
import { BookmarkContentComponent } from './bookmark-content/bookmark-content.component';
import { EditBookmarkModalComponent } from './edit-bookmark-modal/edit-bookmark-modal.component';
import { FormsModule } from '@angular/forms';
import { EditColumnModalComponent } from './edit-column-modal/edit-column-modal.component';
import { DndModule } from 'ngx-drag-drop';
import { SelectTabModalComponent } from './select-tab-modal/select-tab-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    ToolbarComponent,
    BannerComponent,
    BookmarkContentComponent,
    EditBookmarkModalComponent,
    EditColumnModalComponent,
    SelectTabModalComponent
  ],
  imports: [BrowserModule, FormsModule, NgbModule, DndModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

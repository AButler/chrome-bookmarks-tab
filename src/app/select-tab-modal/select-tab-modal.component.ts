import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import 'chrome-extension-async';
import { DummyImageService } from '../dummy-image.service';

interface TabCollection {
  index: number;
  tabs: Tab[];
}

interface Tab {
  title: string;
  id: number;
  url: string;
  index: number;
  windowId: number;
}

@Component({
  selector: 'app-select-tab-modal',
  templateUrl: './select-tab-modal.component.html',
  styleUrls: ['./select-tab-modal.component.scss']
})
export class SelectTabModalComponent implements OnInit {
  private isDevMode = false;

  tabCollections: TabCollection[] = [];
  image?: string;

  constructor(
    public activeModal: NgbActiveModal,
    private dummyImageService: DummyImageService
  ) {
    if (!chrome.tabs) {
      // Dev mode
      this.isDevMode = true;

      this.tabCollections = this.generateDummyTabs();
    } else {
      this.loadTabs();
    }
  }

  ngOnInit(): void {}

  async select(tab: Tab): Promise<void> {
    if (this.isDevMode) {
      this.image = this.dummyImageService.newDummyImage();
      this.activeModal.close('select');
      return;
    }

    const currentTab = await chrome.tabs.getCurrent();
    if (!currentTab || !currentTab.id) {
      this.activeModal.close('error');
      return;
    }

    await chrome.tabs.update(tab.id, { active: true });
    const image = await chrome.tabs.captureVisibleTab(tab.windowId);
    this.image = image;
    await chrome.tabs.update(currentTab.id, { active: true });
    this.activeModal.close('select');
  }

  private async loadTabs(): Promise<void> {
    const chromeTabs = await chrome.tabs.query({});

    const tabCollections: TabCollection[] = [];

    for (const chromeTab of chromeTabs) {
      let tabCollection = tabCollections.find(
        t => t.index === chromeTab.windowId
      );
      if (!tabCollection) {
        tabCollection = { index: chromeTab.windowId, tabs: [] };
        tabCollections.push(tabCollection);
      }

      if (!chromeTab.id) {
        continue;
      }

      const tab = {
        id: chromeTab.id,
        title: chromeTab.title || '',
        url: chromeTab.url || '',
        index: chromeTab.index,
        windowId: chromeTab.windowId
      };

      tabCollection.tabs.push(tab);
    }

    this.tabCollections = tabCollections;
  }

  private generateDummyTabs(): TabCollection[] {
    return [
      {
        index: 0,
        tabs: [
          {
            id: 0,
            index: 0,
            title: 'Test Tab 1',
            url: 'http://foo.com',
            windowId: 0
          },
          {
            id: 1,
            index: 1,
            title: 'Test Tab 2',
            url: 'http://bar.com',
            windowId: 0
          },
          {
            id: 2,
            index: 2,
            title: 'Test Tab 3',
            url: 'http://foobar.com',
            windowId: 0
          }
        ]
      },
      {
        index: 0,
        tabs: [
          {
            id: 3,
            index: 0,
            title: 'Test Tab 4',
            url: 'http://foo.com/2',
            windowId: 1
          },
          {
            id: 4,
            index: 1,
            title: 'Test Tab 5',
            url: 'http://bar.com/2',
            windowId: 1
          },
          {
            id: 5,
            index: 2,
            title: 'Test Tab 6',
            url: 'http://foobar.com/2',
            windowId: 1
          }
        ]
      }
    ];
  }
}

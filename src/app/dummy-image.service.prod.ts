import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DummyImageService {
  constructor() {}

  newDummyImage(): string {
    throw new Error('not supported');
  }
}

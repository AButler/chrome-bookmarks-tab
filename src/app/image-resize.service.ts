import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageResizeService {
  constructor() {}

  resizeImage(
    originalImageDataUrl: string,
    width: number,
    height: number,
    backgroundColor: string = '#ffffff'
  ): Promise<string> {
    const aspectRatio = width / height;

    return new Promise<string>((resolve, reject) => {
      const img = new Image();

      img.onload = _ => {
        if (img.naturalWidth === width && img.naturalHeight === height) {
          resolve(originalImageDataUrl);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject('ctx is null');
          return;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(
          img,
          0,
          0,
          img.naturalWidth,
          img.naturalWidth / aspectRatio,
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(canvas.toDataURL());
      };

      img.src = originalImageDataUrl;
    });
  }
}

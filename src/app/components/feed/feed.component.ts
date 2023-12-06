import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  @Input() user_posts: any = [];

  constructor(private imageService: ImageService) {}

  showAllImages() {
    this.imageService.getImages().subscribe((images: any) => {
      this.user_posts = images.reverse();
    });
  }

  capitaliseText(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  getImageUrl(image: any): string {
    return `https://blobsotragepokemonreview.blob.core.windows.net${image.filePath}`;
  }

  ngOnInit() {
    this.showAllImages();
  }
}

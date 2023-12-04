import { Component, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';

@Component({
  templateUrl: './feed.component.html',
})
export class FeedComponent implements OnInit {
  user_posts: any = [];

  constructor(private imageService: ImageService) {}

  showAllImages() {
    this.imageService.getImages().subscribe((images: any) => {
      this.user_posts = images;
    });
  }


  ngOnInit() {
    this.showAllImages();
  }
}

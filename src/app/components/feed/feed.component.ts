import { Component, Input, OnInit } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { TranslationService } from '../../services/translation.service';

@Component({
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  @Input() user_posts: any = [];
  translate: boolean;
  user_posts_french: any = [];

  constructor(
    private imageService: ImageService,
    private translationService: TranslationService
  ) {
    this.translate = this.translationService.getButtonState();
  }

  async translatePostsToFrench(posts: any[]) {
    const translatedPosts = [];

    const maxLength = Math.min(posts.length, this.user_posts.length); // Get the minimum length

    for (let i = 0; i < maxLength; i++) {
      const post = posts[i];

      const translatedPost = {
        ...post,
        caption: this.translate
          ? await this.translationService.translateText(post.caption)
          : post.caption,
        date: post.date,
      };
      translatedPosts.push(translatedPost);
    }
    return translatedPosts;
  }

  async processPostsForTranslation() {
    this.user_posts_french = await this.translatePostsToFrench(this.user_posts);
  }

  showAllImages() {
    this.imageService.getImages().subscribe(async (images: any) => {
      this.user_posts = images.reverse();
      await this.processPostsForTranslation();
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
    this.translationService
      .getTranslationObservable()
      .subscribe(async (state) => {
        this.translate = state;
        await this.processPostsForTranslation();
      });
  }
}

import { Component, Input } from '@angular/core';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'post-list',
  templateUrl: './post-list.component.html',
})
export class PostListComponent {
  @Input() posts: any;
  // @Input() numberOfColumns: number;

  loading = false;

  constructor(private alertService: AlertService) {}

  capitaliseText(text: string): string {
    return text ? text.charAt(0).toUpperCase() + text.slice(1) : '';
  }

  getImageUrl(image: any): string {
    return `https://blobsotragepokemonreview.blob.core.windows.net${image.filePath}`;
  }

  private handleError(error: any) {
    this.alertService.error(error, { autoClose: true });
    this.loading = false;
    this.scrollToTop();
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

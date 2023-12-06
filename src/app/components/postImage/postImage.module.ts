import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostImageComponent } from './postImage.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FeedModule } from '../feed/feed.module';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, FeedModule],
  declarations: [PostImageComponent],
  exports: [PostImageComponent],
})
export class PostImageModule {}

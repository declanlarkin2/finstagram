import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostImageComponent } from './postImage.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [PostImageComponent],
  exports: [PostImageComponent],
})
export class PostImageModule {}

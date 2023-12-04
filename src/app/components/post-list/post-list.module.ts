import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './post-list.component';

@NgModule({
  imports: [CommonModule],
  declarations: [PostListComponent],
  exports: [PostListComponent],
})
export class PostListModule {}

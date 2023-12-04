import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedRoutingModule } from './feed-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

import { LayoutComponent } from './layout/layout.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { PostListModule } from '../post-list/post-list.module';
import { FeedComponent } from './feed.component';

@NgModule({
  imports: [
    CommonModule,
    FeedRoutingModule,
    ReactiveFormsModule,
    PostListModule,
  ],
  declarations: [FeedComponent, LayoutComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class FeedModule {}

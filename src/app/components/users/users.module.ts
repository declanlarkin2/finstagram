import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { LayoutComponent } from './layout/layout.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule, UsersRoutingModule],
  declarations: [LayoutComponent, EditComponent],
})
export class UsersModule {}

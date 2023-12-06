import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostImageComponent } from './components/postImage/postImage.component';
import { AuthGuard } from './helpers/auth.guard';

const accountModule = () =>
  import('./components/account/account.module').then((x) => x.AccountModule);
const pokemonModule = () =>
  import('./components/pokemon/pokemon.module').then((x) => x.PokemonModule);

const feedModule = () =>
  import('./components/feed/feed.module').then((x) => x.FeedModule);
const routes: Routes = [
  { path: '', loadChildren: feedModule, canActivate: [AuthGuard] },
  // { path: 'feed', loadChildren: feedModule, canActivate: [AuthGuard] },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

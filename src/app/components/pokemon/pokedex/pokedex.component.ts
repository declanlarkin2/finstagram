// import { Component, OnInit } from '@angular/core';
// import { PokemonService } from '../../../services/pokemon.service';

// import { PageEvent } from '@angular/material/paginator';
// import { AlertService } from '../../../services/alert.service';
// @Component({
//   templateUrl: './pokedex.component.html',
// })
// export class PokedexComponent implements OnInit {
//   pokemonName: string = '';

//   setPokemonName($event: any) {
//     this.pokemonName = $event.name;
//   }

//   pokemonList: any = [];
//   pokemonTypes: any = [];
//   pokemonAbilities: any = [];
//   page: number = 1;
//   currentPage = 0;
//   loaded = false;
//   pageSizeOptions = [10, 20, 30];
//   itemsPerPage = 20;
//   count: number;

//   addToDeck: boolean = true;
//   removeFromDeck: boolean = false;
//   numberOfColumns: number = 4;

//   showDropDown: boolean = false;

//   constructor(
//     public pokemonService: PokemonService,
//     private alertService: AlertService
//   ) {}

//   showAllPokemon() {
//     this.pokemonService
//       .getPokemonWithPagnation(this.page, this.itemsPerPage)
//       .subscribe((pokemonList: any) => {
//         this.pokemonList = pokemonList;
//       });

//     this.pokemonService.getNumberOfPokemon().subscribe((totalPokemon: any) => {
//       this.count = totalPokemon.total_count;
//     });
//   }

//   scrollToTop() {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }

//   ngOnInit() {
//     if (sessionStorage['page']) {
//       this.page = Number(sessionStorage['page']);
//     }
//     this.showAllPokemon();
//   }
// }

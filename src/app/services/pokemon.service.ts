import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  constructor(public http: HttpClient) {}
  getPokemonWithPagnation(page: number, pageSize: number) {
    return this.http.get(
      `${environment.apiUrl}/pokemon?pn=` + page + `&ps=` + pageSize
    );
  }

  getNumberOfPokemon() {
    return this.http.get(`${environment.apiUrl}/pokemon/count`);
  }

  getPokeman(id: any) {
    return this.http.get(`${environment.apiUrl}/pokemon/id/` + id);
  }

  getPokemonBySearch(name: string) {
    return this.http.get(`${environment.apiUrl}/pokemon/search/` + name);
  }
  getAllPokemonTypes() {
    return this.http.get(`${environment.apiUrl}/pokemon/types`);
  }
  getAllPokemonAbilities() {
    return this.http.get(`${environment.apiUrl}/pokemon/abilities`);
  }

  getPokemonByTypesAndAbilities(
    types: string[],
    abilities: string[],
    page: number,
    pageSize: number
  ) {
    let params = new HttpParams()
      .set('pn', page.toString())
      .set('ps', pageSize.toString());

    types.forEach((type) => {
      params = params.append('types', type);
    });

    abilities.forEach((ability) => {
      params = params.append('abilities', ability);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter`, { params });
  }

  getNumberOfPokemonByTypesAndAbilities(types: string[], abilities: string[]) {
    let params = new HttpParams();

    types.forEach((type) => {
      params = params.append('types', type);
    });

    abilities.forEach((ability) => {
      params = params.append('abilities', ability);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter/count`, {
      params,
    });
  }

  getPokemonByTypes(types: string[], page: number, pageSize: number) {
    let params = new HttpParams()
      .set('pn', page.toString())
      .set('ps', pageSize.toString());

    types.forEach((type) => {
      params = params.append('types', type);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter`, { params });
  }

  getPokemonByAbilities(abilties: string[], page: number, pageSize: number) {
    let params = new HttpParams()
      .set('pn', page.toString())
      .set('ps', pageSize.toString());

    abilties.forEach((ability) => {
      params = params.append('abilities', ability);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter`, { params });
  }

  getNumberOfPokemonByTypes(types: string[]) {
    let params = new HttpParams();

    types.forEach((type) => {
      params = params.append('types', type);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter/count`, {
      params,
    });
  }

  getNumberOfPokemonByAbilities(abilities: string[]) {
    let params = new HttpParams();

    abilities.forEach((ability) => {
      params = params.append('abilities', ability);
    });

    return this.http.get(`${environment.apiUrl}/pokemon/filter/count`, {
      params,
    });
  }
}

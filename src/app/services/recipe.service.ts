import { Injectable } from '@angular/core';
import { Recipe, RecipeList } from '../models/recipe';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor(private http: HttpClient) { }
  
  public createRecipe(recipe: Recipe): Observable<any> {
    return this.http.post('/api/recipes/', recipe);
  }

  public getUserRecipes(user_id: string, url?: string): Observable<RecipeList> {
    if (url) {
      return this.http.get<RecipeList>(url);
    }
    return this.http.get<RecipeList>(`/api/users/${user_id}/recipes/`);
  }

  public getRecipes(url?: string): Observable<RecipeList> {
    if (url) {
      return this.http.get<RecipeList>(url);
    }
    return this.http.get<RecipeList>('/api/recipes/');
  }

  public getRecipe(id: Number): Observable<Recipe> {
    return this.http.get<Recipe>(`/api/recipes/${id}`);
  }

  public updateRecipe(id: number, recipe: Recipe): Observable<any> {
    return this.http.put(`/api/recipes/${id}`, recipe);
  }

  public deleteRecipe(id: number): Observable<any> {
    return this.http.delete(`/api/recipes/${id}`);
  }

  public makeRecipe(id: number): Observable<any> {
    return this.http.post(`/api/recipes/${id}/made/`, null);
  }

  public unmakeRecipe(id: number): Observable<any> {
    return this.http.delete(`/api/recipes/${id}/made/`);
  }
}

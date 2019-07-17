import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
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

  public getRecipes(): Observable<Recipe[]> {
    return this.http.get<Recipe[]>('/api/recipes/');
  }

  public getRecipe(id: Number): Observable<Recipe> {
    return this.http.get<Recipe>(`/api/recipes/${id}`);
  }

  public deleteRecipe(id: Number): Observable<any> {
    return this.http.delete(`/api/recipes/${id}`);
  }
}

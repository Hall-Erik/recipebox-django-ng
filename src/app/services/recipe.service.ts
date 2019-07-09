import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  recipes: Recipe[] = [
    {
      id: 1, title: "Contact 001", description: "Contact 001 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
    {
      id: 2, title: "Contact 002", description: "Contact 002 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
    {
      id: 3, title: "Contact 003", description: "Contact 003 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
    {
      id: 4, title: "Contact 004", description: "Contact 004 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
  ];

  public getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);
  }

  public getRecipe(id: Number): Observable<Recipe> {
    return of(this.recipes.find(recipe => recipe.id == id));
  }

  public createRecipe(recipe: Recipe) {
    let id: number = null;
    if (this.recipes.length == 0) {
      id = 0;
    } else {
      id = Math.max.apply(Math, this.recipes.map((r) => {return r.id})) + 1;
    }
    recipe.id = id;
    this.recipes.push(recipe);
  }
}

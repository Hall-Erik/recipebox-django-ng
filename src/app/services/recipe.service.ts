import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';

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
      id: 1, title: "Contact 002", description: "Contact 002 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
    {
      id: 1, title: "Contact 003", description: "Contact 003 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
    {
      id: 1, title: "Contact 004", description: "Contact 004 des",
      cookTime: "3", datePosted: "today", ingredients: "blahblah",
      directions: "blah", servings: "5", imageUrl: "http://dee", userId: 1
    },
  ];

  public getRecipes(): Recipe[]{
    return this.recipes;
  }
  public createRecipt(recipe: Recipe){
    this.recipes.push(recipe);
  }
}

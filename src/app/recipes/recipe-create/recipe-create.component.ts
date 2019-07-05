import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {

  recipe: Recipe;
  
  constructor(public recipeService: RecipeService) { }

  ngOnInit() {
    this.initRecipe();
  }

  initRecipe() {
    this.recipe = {
      id: null,
      title: "",
      description: "",
      servings: "",
      cookTime: "",
      ingredients: "",
      directions: "",
      imageUrl: "",
      datePosted: "",
      userId: null
    };
  }

  createRecipe() {
    console.log(this.recipe);
    this.recipeService.createRecipt(this.recipe);
    this.initRecipe();
  }

}

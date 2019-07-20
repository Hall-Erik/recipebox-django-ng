import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  public recipe: Recipe;
  
  constructor(
    public recipeService: RecipeService,
    private router: Router) { }

  ngOnInit() {
    this.initRecipe();
  }

  initRecipe() {
    this.recipe = {
      id: null,
      title: "",
      description: "",
      servings: "",
      cook_time: "",
      ingredients: "",
      directions: "",
      image_file: "",
      datePosted: "1/1/19",
      made_it: false,
      user: null
    };
  }

  createRecipe() {
    this.recipeService.createRecipe(this.recipe)
      .subscribe((result: any) => {
        this.router.navigate(['index']);
      });
  }
}

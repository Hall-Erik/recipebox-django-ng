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

  recipe: Recipe;
  
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
      user: null
    };
  }

  createRecipe() {
    console.log(this.recipe);
    this.recipeService.createRecipe(this.recipe)
      .subscribe((result: any) => {
        console.log("Stock created.");
        this.router.navigate(['index']);
      }, (err) => {
        console.log("Couldn't create stock.");
        console.log(err.error.msg);
      });
  }
}

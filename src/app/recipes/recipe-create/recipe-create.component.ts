import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent {
  constructor(
    public recipeService: RecipeService,
    private router: Router) { }

  submit(recipe: Recipe) {
    this.recipeService.createRecipe(recipe)
      .subscribe(() => {
        this.router.navigate(['index']);
      });
  }
}

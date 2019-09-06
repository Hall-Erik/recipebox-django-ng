import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Recipe } from 'src/app/models/recipe';

import { RecipeService } from '../../services/recipe.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent {
  constructor(
    private recipeService: RecipeService,
    private alertService: AlertService,
    private router: Router) { }

  submit(recipe: Recipe) {
    this.recipeService.createRecipe(recipe)
      .subscribe(() => {
        this.router.navigate(['index']);
        this.alertService.success('Recipe created.');
      });
  }
}

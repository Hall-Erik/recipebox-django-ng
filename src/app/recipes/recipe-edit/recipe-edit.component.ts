import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from 'src/app/models/recipe';

import { RecipeService } from '../../services/recipe.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  public recipe: Recipe;
  private recipeId: string;

  constructor(
    private recipeService: RecipeService,
    private alertService: AlertService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.recipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(+this.recipeId).subscribe(
      (recipe) => {this.recipe = recipe});
  }

  update(recipe) {
    this.recipeService.updateRecipe(+this.recipeId, recipe)
      .subscribe(() => {
        this.router.navigate(['index']);
        this.alertService.success('Recipe updated.');
      });
  }
}

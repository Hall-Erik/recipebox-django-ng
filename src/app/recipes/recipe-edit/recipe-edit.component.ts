import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  public recipe: Recipe;
  private recipeId: string;

  constructor(
    public recipeService: RecipeService,
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
      });
  }
}

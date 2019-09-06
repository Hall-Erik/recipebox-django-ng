import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Recipe } from '../../models/recipe';

import { RecipeService } from '../../services/recipe.service';
import { UserService } from '../../services/user.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  public recipe: Recipe;
  public owner: boolean = false;
  public logged_in: boolean = false;

  constructor(private recipeService: RecipeService,
              private userService: UserService,
              private alertService: AlertService,
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.logged_in = this.userService.logged_in;
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(+recipeId).subscribe(
      (recipe) => {
        this.recipe = recipe
        if (this.userService.user) {
          this.owner = this.userService.user.pk == recipe.user.pk;
        }
      });
  }

  make() {
    this.recipeService.makeRecipe(this.recipe.id)
      .subscribe((resp: Recipe) => {
        this.recipe = resp;
      });
  }

  delete() {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id)
        .subscribe(() => {
          this.router.navigate(['index']);
          this.alertService.success('Recipe deleted.');
        });
    }
  }
}

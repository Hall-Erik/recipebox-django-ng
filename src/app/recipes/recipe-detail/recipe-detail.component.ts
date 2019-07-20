import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Recipe } from '../../models/recipe';
import { RecipeService } from '../../services/recipe.service';
import { UserService } from '../../services/user.service';

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
              private router: Router,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.logged_in = (this.userService.token != null);
    const recipeId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipe(+recipeId).subscribe(
      (recipe) => {
        this.recipe = recipe
        if (this.userService.user) {
          this.owner = this.userService.user.id == recipe.user.id;
        }
      });
  }

  make() {
    this.recipeService.makeRecipe(this.recipe.id)
      .subscribe(() => {
        this.recipe.made_it = true;
      });
  }

  unmake() {
    this.recipeService.unmakeRecipe(this.recipe.id)
      .subscribe(() => {
        this.recipe.made_it = false;
      });
  }

  delete() {
    if (confirm('Are you sure you want to delete this recipe?')) {
      this.recipeService.deleteRecipe(this.recipe.id)
        .subscribe(() => {
          console.log('Recipe deleted.');
          this.router.navigate(['index']);
        }, (err) => {
          console.log(err.error.msg);
        });
    }
  }
}

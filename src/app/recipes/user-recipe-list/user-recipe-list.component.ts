import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-user-recipe-list',
  templateUrl: './user-recipe-list.component.html',
  styleUrls: ['./user-recipe-list.component.css']
})
export class UserRecipeListComponent implements OnInit {
  recipes: Recipe[];
  next: string;
  userId: string;

  constructor(private recipeService: RecipeService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get('id');
    this.recipeService.getUserRecipes(this.userId)
      .subscribe((recipes) => {
        this.recipes = recipes.results;
        this.next = recipes.next;
      });
  }

  getMore() {
    if (this.next) {
      this.recipeService.getUserRecipes(this.userId, this.next).subscribe(
        (recipes) => {
          Array.prototype.push.apply(this.recipes, recipes.results);
          this.next = recipes.next;
        });
    }
  }
}

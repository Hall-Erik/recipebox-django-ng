import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[];
  next: string;
  
  constructor(public recipeService: RecipeService) { }

  ngOnInit() {
    this.recipeService.getRecipes().subscribe(
      (recipes) => {
        this.recipes = recipes.results
        this.next = recipes.next;
      });
  }

  getMore() {
    if (this.next) {
      this.recipeService.getRecipes(this.next).subscribe(
        (recipes) => {
          Array.prototype.push.apply(this.recipes, recipes.results);
          this.next = recipes.next;
        });
    }
  }
}

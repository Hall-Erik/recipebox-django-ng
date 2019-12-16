import { Component, OnInit, HostListener } from '@angular/core';
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
        this.onWindowScroll();
      });
  }

  @HostListener("window:scroll")
  onWindowScroll() {
    let pos = Math.ceil(window.innerHeight + window.scrollY);
    let max = document.documentElement.scrollHeight;
    if (pos == max) {
      let next = this.next;
      this.next = null; // to prevent race condition.
      this.getMore(next);
    }
  }

  getMore(next: string) {
    if (next) {
      this.recipeService.getRecipes(next).subscribe(
        (recipes) => {
          Array.prototype.push.apply(this.recipes, recipes.results);
          this.next = recipes.next;
        });
    }
  }
}

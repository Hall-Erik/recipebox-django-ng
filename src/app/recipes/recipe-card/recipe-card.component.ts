import { Component, Input } from '@angular/core';
import { Router } from '@angular/router'
import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe-card.component.html',
  styleUrls: ['./recipe-card.component.css']
})
export class RecipeCardComponent {
  @Input() recipe: Recipe;

  constructor(private router: Router) { }

  user_recipes() {
    this.router.navigate([`/user/${this.recipe.user.pk}/recipes`]);
  }
}

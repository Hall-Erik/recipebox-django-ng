import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Recipe } from '../../models/recipe';

@Component({
  selector: 'app-recipe-form',
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent {
  @Output() recipeSubmit = new EventEmitter<Recipe>();
  
  @Input() set recipe(initial: Recipe) {
    if (initial) {
      this.recipeForm.patchValue(initial);
    }
  }

  private recipeForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    servings: ['', Validators.required],
    cook_time: ['', Validators.required],
    ingredients: ['', Validators.required],
    directions: ['', Validators.required],
    image_file: ['']
  });

  constructor(private fb: FormBuilder) { }

  get title() { return this.recipeForm.get('title'); }
  get description() { return this.recipeForm.get('description'); }
  get servings() { return this.recipeForm.get('servings'); }
  get cook_time() { return this.recipeForm.get('cook_time'); }
  get ingredients() { return this.recipeForm.get('ingredients'); }
  get directions() { return this.recipeForm.get('directions'); }
  get image_file() { return this.recipeForm.get('image_file'); }

  onSubmit() {
    this.recipeSubmit.emit(new Recipe(this.recipeForm.value));
  }
}

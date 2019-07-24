import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';
import { Recipe } from 'src/app/models/recipe';

@Component({
  selector: 'app-recipe-create',
  templateUrl: './recipe-create.component.html',
  styleUrls: ['./recipe-create.component.css']
})
export class RecipeCreateComponent implements OnInit {
  private recipeForm = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    servings: ['', Validators.required],
    cook_time: ['', Validators.required],
    ingredients: ['', Validators.required],
    directions: ['', Validators.required],
    image_file: ['']
  });

  constructor(
    private fb: FormBuilder,
    public recipeService: RecipeService,
    private router: Router) { }

  ngOnInit() {
  }

  get title() { return this.recipeForm.get('title'); }
  get description() { return this.recipeForm.get('description'); }
  get servings() { return this.recipeForm.get('servings'); }
  get cook_time() { return this.recipeForm.get('cook_time'); }
  get ingredients() { return this.recipeForm.get('ingredients'); }
  get directions() { return this.recipeForm.get('directions'); }
  get image_file() { return this.recipeForm.get('image_file'); }

  onSubmit() {
    this.recipeService.createRecipe(
      new Recipe(this.recipeForm.value))
      .subscribe(() => {
        this.router.navigate(['index']);
      }, (err) => {
        console.log(err);
      });
  }
}

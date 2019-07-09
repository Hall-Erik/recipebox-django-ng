import { Injectable } from '@angular/core';
import { Recipe } from '../models/recipe';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecipeService {

  constructor() { }

  recipes: Recipe[] = [
    {
      id: 1, title: "Blueberry Cake", description: "New England blueberry cake",
      cookTime: "65", datePosted: "today",
      ingredients: `1 cup shortening
      2 cup sugar
      2 eggs
      3 1/4 cup flour
      1/2 tsp baking soda
      1 tsp cream of tartar
      1 cup milk
      2 tsp vanilla
      1 quart blueberries`,
      directions: `Cream the shortening, sugar and eggs together.
      Set aside 1/4 cup flour for later.
      In a separate bowl, combine flour, baking soda and cream of tartar.
      Gradually, add dry ingredients, milk and vanilla to egg mixture.
      In a separate bowl, cover blueberries with remaining flour.
      Fold blueberries into cake batter.
      Spread into greased 12x16" pan.
      Sprinkle to with sugar and bake at 350 degrees for 45-60 minutes.`,
      servings: "12",
      imageUrl: "assets/img/default.png", userId: 1
    },
    {
      id: 2, title: "Chicken Broccoli Fettuccine Alfredo",
      description: "Cheesy dish your friends will shrug their shoulders about.",
      cookTime: "35", datePosted: "today",
      ingredients: `2 pints heavy whipping cream
      1 stick butter
      1/2 box cream cheese
      2 bags mozzarella cheese
      2 chicken breast (cooked)
      1 head broccoli (steamed)
      4-6 servings fettuccine noodles (cooked)`,
      directions: `Cook heavy whipping cream and butter on medium-high heat until it starts to foam.
      Stir in cream cheese until melted.
      Gradually stir in mozzarella.
      Reduce heat and stir in chicken, broccoli and fettuccine noodles.
      Remove from heat and let sit 5 minutes before serving.`,
      servings: "4-6",
      imageUrl: "https://flask-recipebox.s3.us-west-1.amazonaws.com/eb31e82689daea57", userId: 1
    },
    {
      id: 3, title: "Donuts", description: "Old family recipe for cake donuts.",
      cookTime: "120", datePosted: "today",
      ingredients: `3 large eggs
      1 cup sugar
      2 tbsp vegetable oil
      3-3/4 cup flour
      2 tsp baking powder
      1 tsp baking soda
      1 tsp salt
      1 tsp nutmeg
      2/3 cup buttermilk
      cinnamon sugar (optional)`,
      directions: `In a mixing bowl, beat together eggs, sugar and oil.
      In a separate bowl, combine flour, baking powder, baking soda, salt and nutmeg.
      Gradually add buttermilk to egg mixture.
      Gradually mix dry ingredients into egg mixture and beat until smooth.
      Cover bowl and refrigerate for 1 hour.
      Cut donuts from dough and let sit for 10 minutes.
      Fry donuts in lard or Crisco and set on a rack to cool.
      (Optional) roll donuts in cinnamon sugar before cooling.`,
      servings: "6",
      imageUrl: "https://flask-recipebox.s3.us-west-1.amazonaws.com/4c7863fadf1697e2", userId: 1
    },
    {
      id: 4, title: "Thai Basil Chicken Bowls",
      description: "Flavorful chicken rice bowls",
      cookTime: "30", datePosted: "today",
      ingredients: `1 cup jasmine rice
      1/2 cup chicken stock
      3 tbsp low sodium soy sauce
      1 tbsp fish sauce
      1 1/2 tbsp light brown sugar
      1 1/2 tbsp rice vinegar
      2 tbsp vegetable oil
      1 tsp fresh ginger, ground
      1 tsp fresh nutmeg, ground
      3 cloves garlic, minced
      1 cup sweet bell peppers, thinly sliced
      2 shallots, thinly sliced
      1 red Thai chili pepper, thinly sliced
      1 1/4 lbs chicken breast, cut into bite sized pieces
      1 1/2 cup packed fresh Thai basil leaves`,
      directions: `Cook rice and set aside.
      In a small bowl, whisk together chicken stock, soy sauce, fish sauce, brown sugar, rice vinegar, ginger and nutmeg. Set aside.
      Heat vegetable oil in a large skillet over medium heat. Add garlic, shallots, bell peppers and chili pepper. Cook, stirring frequently until fragrant.
      Add chicken and cook until browned.
      Stir in stock mixture and cook, stirring until sauce has thickened.
      Stir in basil and cook until just wilted.
      Divide rice into bowls and serve with chicken mixture on top.`,
      servings: "4",
      imageUrl: "https://flask-recipebox.s3.us-west-1.amazonaws.com/80d33f9679d1f844", userId: 1
    },
  ];

  public getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);
  }

  public getRecipe(id: Number): Observable<Recipe> {
    return of(this.recipes.find(recipe => recipe.id == id));
  }

  public createRecipe(recipe: Recipe) {
    let id: number = null;
    if (this.recipes.length == 0) {
      id = 0;
    } else {
      id = Math.max.apply(Math, this.recipes.map((r) => {return r.id})) + 1;
    }
    recipe.id = id;
    this.recipes.push(recipe);
  }
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "index"},
  {path: "index", component: RecipeListComponent},
  {path: "recipes/create", component: RecipeCreateComponent},
  {path: "recipe/:id", component: RecipeDetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

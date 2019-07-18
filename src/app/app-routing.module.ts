import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "index"},
  {path: "index", component: RecipeListComponent},
  {path: "recipes/create", component: RecipeCreateComponent},
  {path: "recipe/:id", component: RecipeDetailComponent},
  {path: "recipe/:id/edit", component: RecipeEditComponent},
  {path: "login", component: LoginComponent},
  {path: "register", component: RegisterComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

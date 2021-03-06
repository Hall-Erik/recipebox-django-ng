import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';
import { UserRecipeListComponent } from './recipes/user-recipe-list/user-recipe-list.component';
import { AccountComponent } from './users/account/account.component';

const routes: Routes = [
  {path: "", pathMatch: "full", redirectTo: "/index"},
  {path: "index", component: RecipeListComponent},
  {path: "recipes/create", component: RecipeCreateComponent},
  {path: "recipe/:id", component: RecipeDetailComponent},
  {path: "recipe/:id/edit", component: RecipeEditComponent},
  {path: "user/:id/recipes", component: UserRecipeListComponent},
  {path: "login", component: LoginComponent},
  {path: "forgot-password", component: ForgotPasswordComponent},
  {path: "reset/:token", component: ResetPasswordComponent},
  {path: "register", component: RegisterComponent},
  {path: "account", component: AccountComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

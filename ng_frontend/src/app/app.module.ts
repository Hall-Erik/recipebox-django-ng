import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2ImgMaxModule } from 'ng2-img-max';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AlertComponent } from './alert/alert/alert.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';
import { RecipeCardComponent } from './recipes/recipe-card/recipe-card.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { ForgotPasswordComponent } from './users/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './users/reset-password/reset-password.component';

import { RecipeService } from './services/recipe.service';
import { UserService } from './services/user.service';
import { AlertService } from './services/alert.service';

import { RecipeInterceptor } from './services/recipe.interceptor';
import { UserRecipeListComponent } from './recipes/user-recipe-list/user-recipe-list.component';
import { AccountComponent } from './users/account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    RecipeCreateComponent,
    HeaderComponent,
    RecipeDetailComponent,
    RegisterComponent,
    LoginComponent,
    RecipeEditComponent,
    RecipeCardComponent,
    RecipeFormComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AlertComponent,
    UserRecipeListComponent,
    AccountComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    }),
    Ng2ImgMaxModule
  ],
  providers: [
    RecipeService,
    UserService,
    AlertService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RecipeInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

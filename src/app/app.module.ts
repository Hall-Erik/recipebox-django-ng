import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { HeaderComponent } from './header/header.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';

import { RecipeService } from './services/recipe.service';
import { UserService } from './services/user.service';
import { UserTokenService } from './services/user-token.service';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    RecipeListComponent,
    RecipeCreateComponent,
    HeaderComponent,
    RecipeDetailComponent,
    RegisterComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [
    RecipeService,
    UserService,
    UserTokenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

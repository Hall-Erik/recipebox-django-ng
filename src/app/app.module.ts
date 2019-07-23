import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HttpClientXsrfModule } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeCreateComponent } from './recipes/recipe-create/recipe-create.component';
import { HeaderComponent } from './header/header.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RegisterComponent } from './users/register/register.component';
import { LoginComponent } from './users/login/login.component';
import { RecipeEditComponent } from './recipes/recipe-edit/recipe-edit.component';

import { RecipeService } from './services/recipe.service';
import { UserService } from './services/user.service';
import { RecipeInterceptor } from './services/recipe.interceptor';
import { RecipeCardComponent } from './recipes/recipe-card/recipe-card.component';

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
    RecipeCardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'csrftoken',
      headerName: 'X-CSRFToken'
    })
  ],
  providers: [
    RecipeService,
    UserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RecipeInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

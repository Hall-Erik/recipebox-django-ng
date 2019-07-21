from django.urls import path
from django.conf.urls import url
from django.views.generic.base import TemplateView
from rest_framework.authtoken.views import obtain_auth_token
from . import views


urlpatterns = [
    path('api/recipes/',
         views.RecipeListCreate.as_view(), name='recipe_list_create'),
    path('api/recipes/<id>', views.RecipeRUD.as_view(), name='recipe_rud'),
    path('api/recipes/<id>/made/',
         views.MakeRecipeView.as_view(), name='recipe_make'),
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/login/', obtain_auth_token, name='api_token_auth'),
    path('api/user/', views.CurrentUserView.as_view(), name='current_user'),
    url(r'^.*',
        TemplateView.as_view(template_name='recipes/index.html'), name='home'),
]

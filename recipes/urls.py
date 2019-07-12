from django.urls import path
from rest_framework.authtoken.views import obtain_auth_token
from . import views


urlpatterns = [
    path('hello/', views.HelloView.as_view(), name='hello'),
    path('api/recipes/', views.RecipeList.as_view(), name='recipe_list'),
    path('api/recipes/create', views.RecipeCreate.as_view(), name='recipe_create'),
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/login/', obtain_auth_token, name='api_token_auth'),
]
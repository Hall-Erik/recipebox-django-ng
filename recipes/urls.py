from django.urls import path, include
from django.conf.urls import url
from django.views.generic.base import TemplateView
from rest_auth.views import (
     LoginView,
     LogoutView,
     UserDetailsView)
from rest_auth.registration.views import RegisterView
from . import views


urlpatterns = [
     path('api/sign_s3/', views.SignS3View.as_view(), name='sign_s3'),

     path('api/recipes/',
          views.RecipeListCreate.as_view(), name='recipe_list_create'),
     path('api/recipes/<id>', views.RecipeRUD.as_view(), name='recipe_rud'),
     path('api/recipes/<id>/made/',
          views.MakeRecipeView.as_view(), name='recipe_make'),

     path('api/register/', RegisterView.as_view(), name='api_register'),
     path('api/login/', LoginView.as_view(), name='rest_login'),
     path('api/logout/', LogoutView.as_view(), name='rest_logout'),
     path('api/user/', UserDetailsView.as_view(), name='rest_user_details'),
     path('api/password/reset/',
         include('django_rest_passwordreset.urls',
                 namespace='password_reset')),
     
     url(r'^.*',
         TemplateView.as_view(template_name='recipes/index.html'),
         name='home'),
]

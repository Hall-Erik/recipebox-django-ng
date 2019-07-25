from django.urls import path, include
from django.conf.urls import url
from django.views.generic.base import TemplateView
from . import views


urlpatterns = [
    path('api/sign_s3/', views.SignS3View.as_view(), name='sign_s3'),
    path('api/recipes/',
         views.RecipeListCreate.as_view(), name='recipe_list_create'),
    path('api/recipes/<id>', views.RecipeRUD.as_view(), name='recipe_rud'),
    path('api/recipes/<id>/made/',
         views.MakeRecipeView.as_view(), name='recipe_make'),
    path('api/register/', views.RegisterView.as_view(), name='api_register'),
    path('api/user/', views.CurrentUserView.as_view(), name='current_user'),
    url(r'rest-auth/', include('rest_auth.urls')),
    url(r'^.*',
        TemplateView.as_view(template_name='recipes/index.html'), name='home'),
]

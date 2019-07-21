from django.shortcuts import render
from django.views.generic import TemplateView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView)
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly)
from rest_framework import status
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from .models import Recipe, MadeRecipe
from .serializers import UserSerializer, RecipeSerializer


class HomePageView(TemplateView):
    def get(self, request, **kwargs):
        return render(request, 'recipes/index.html', context=None)


class RecipeListCreate(ListCreateAPIView):
    queryset = Recipe.objects.all().order_by('-date_posted')
    serializer_class = RecipeSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user_id = getattr(self.request.user, 'id', None)
        context.update({'user_id': user_id})
        return context

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class RecipeRUD(RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'id'
    permission_classes = (IsOwnerOrReadOnly,)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        user_id = getattr(self.request.user, 'id', None)
        context.update({'user_id': user_id})
        return context


class MakeRecipeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, id):
        if MadeRecipe.objects.filter(
          user_id=request.user.id, recipe_id=id).count() == 1:
            return Response(status.HTTP_400_BAD_REQUEST)
        MadeRecipe.objects.create(recipe_id=id, user=request.user)
        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, id):
        mr = MadeRecipe.objects.filter(
          user_id=request.user.id, recipe_id=id).first()
        if not mr:
            return Response(status=status.HTTP_404_NOT_FOUND)
        mr.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CurrentUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RegisterView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

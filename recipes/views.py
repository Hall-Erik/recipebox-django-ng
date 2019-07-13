from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView, ListAPIView, UpdateAPIView)
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from .models import Recipe
from .serializers import UserSerializer, RecipeSerializer


class RecipeCreate(CreateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    permission_classes = (IsAuthenticated,)


class RecipeList(ListAPIView):
    queryset = Recipe.objects.all().order_by('-date_posted')
    serializer_class = RecipeSerializer


class RecipeUpdate(UpdateAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'id'
    permission_classes = (IsAuthenticated, IsOwnerOrReadOnly)


class RegisterView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

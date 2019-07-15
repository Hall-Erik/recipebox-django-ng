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
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from .models import Recipe
from .serializers import UserSerializer, RecipeSerializer


class RecipeListCreate(ListCreateAPIView):
    queryset = Recipe.objects.all().order_by('-date_posted')
    serializer_class = RecipeSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)


class CurrentUserView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class RecipeRUD(RetrieveUpdateDestroyAPIView):
    queryset = Recipe.objects.all()
    serializer_class = RecipeSerializer
    lookup_field = 'id'
    permission_classes = (IsOwnerOrReadOnly,)


class RegisterView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

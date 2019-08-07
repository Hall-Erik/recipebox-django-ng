from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    CreateAPIView,
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly)
from rest_framework import status
import boto3
from .permissions import IsOwnerOrReadOnly
from django.contrib.auth.models import User
from .models import Recipe, MadeRecipe
from .serializers import UserSerializer, RecipeSerializer
from recipebox import settings


class SignS3View(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        S3_BUCKET = settings.S3_BUCKET
        file_name = request.data.get('file_name')
        file_type = request.data.get('file_type')
        s3 = boto3.client('s3')
        presigned_post = s3.generate_presigned_post(
            Bucket=S3_BUCKET,
            Key=file_name,
            Fields={"acl": "public-read", "Content-Type": file_type},
            Conditions=[
                {"acl": "public-read"},
                {"Content-Type": file_type}
            ],
            ExpiresIn=3600
        )
        data = {
            'data': presigned_post,
            'url': 'https://%s.s3.amazonaws.com/%s' % (S3_BUCKET, file_name)
        }
        return Response(data=data)


class RecipeListPagination(PageNumberPagination):
    page_size = 8


class RecipeListCreate(ListCreateAPIView):
    queryset = Recipe.objects.all().order_by('-date_posted')
    serializer_class = RecipeSerializer
    permission_classes = (IsAuthenticatedOrReadOnly,)
    pagination_class = RecipeListPagination

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

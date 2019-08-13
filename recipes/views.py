from django.shortcuts import get_object_or_404
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import (
    ListCreateAPIView,
    ListAPIView,
    RetrieveUpdateDestroyAPIView)
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import (
    AllowAny,
    IsAuthenticated,
    IsAuthenticatedOrReadOnly)
from .permissions import IsOwnerOrReadOnly
import boto3
from django.contrib.auth.models import User
from .models import Recipe
from .serializers import RecipeSerializer
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


class UserRecipeListView(ListAPIView):
    permission_classes = (AllowAny,)
    serializer_class = RecipeSerializer
    pagination_class = RecipeListPagination

    def get_queryset(self):
        user_id = self.kwargs.get('id')
        user = get_object_or_404(User, pk=user_id)
        return user.recipe_set.all()


class MakeRecipeView(APIView):
    permission_classes = (IsAuthenticated,)

    def get_object(self, pk):
        try:
            return Recipe.objects.get(pk=pk)
        except Recipe.DoesNotExist:
            raise Http404

    def put(self, request, id):
        recipe = self.get_object(pk=id)
        mr = recipe.maderecipe_set.filter(user=request.user).first()
        if not mr:
            recipe.maderecipe_set.create(user=request.user)
        else:
            mr.delete()
        serializer = RecipeSerializer(
            recipe, context={'user_id': request.user.id})
        return Response(serializer.data)

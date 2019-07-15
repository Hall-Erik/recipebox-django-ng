from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe


class RecipeSerializer(serializers.ModelSerializer):
    user = serializers.HiddenField(
        default=serializers.CurrentUserDefault())

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'cook_time', 'servings',
            'date_posted', 'image_file', 'ingredients', 'directions',
            'user')
        extra_kwargs = {
            'id': {'read_only': True}}


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password',)
        extra_kwargs = {
            'password': {'write_only': True},
            'id': {'read_only': True}}

    def create(self, data):
        user = User(
            email=data['email'],
            username=data['username'],
        )
        user.set_password(data['password'])
        user.save()
        return user

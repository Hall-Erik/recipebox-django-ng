from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Recipe, MadeRecipe


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('pk', 'username', 'email', 'password',)
        extra_kwargs = {
            'password': {'write_only': True},
            'pk': {'read_only': True}}

    def create(self, data):
        user = User(
            email=data['email'],
            username=data['username'],
        )
        user.set_password(data['password'])
        user.save()
        return user


class RecipeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    made_it = serializers.SerializerMethodField('_made_it')
    made_it_count = serializers.SerializerMethodField('_made_it_count')

    def _made_it(self, obj):
        user_id = self.context.get('user_id')
        if user_id:
            if MadeRecipe.objects.filter(
              user_id=user_id, recipe_id=obj.id).count() == 1:
                return True
        return False

    def _made_it_count(self, obj):
        return obj.maderecipe_set.count()

    class Meta:
        model = Recipe
        fields = (
            'id', 'title', 'description', 'cook_time', 'servings',
            'date_posted', 'image_file', 'ingredients', 'directions',
            'user', 'made_it', 'made_it_count')
        extra_kwargs = {
            'id': {'read_only': True}}

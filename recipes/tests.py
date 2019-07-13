from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from django.contrib.auth.models import User
from .serializers import RecipeSerializer
from .models import Recipe


class RegisterUserTests(TestCase):
    def test_register_user(self):
        '''
        The reigster endpoint should create a new user.
        '''
        url = reverse('api_register')
        data = {
            'username': 'test',
            'email': 'test@test.com',
            'password': 'test123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'test')


class RecipeListTests(TestCase):
    def test_no_recipes(self):
        '''
        Should return an emtpy list if no recipes saved.
        '''
        url = reverse('recipe_list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
    
    def test_with_recipes(self):
        '''
        Should return list of recipes.
        '''
        user = User.objects.create_user(username='steve')
        Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        Recipe.objects.create(
            title='sukiyaki', description='Japanese for stew',
            cook_time='6', servings='8',
            ingredients='water, beef, leeks',
            directions='cook, eat', user=user)
        serializer = RecipeSerializer(
            Recipe.objects.all().order_by('-date_posted'), many=True)
        url = reverse('recipe_list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

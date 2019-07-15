from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
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


class RecipeListCreateTests(TestCase):
    def test_list_no_recipes(self):
        '''
        Should return an emtpy list if no recipes saved.
        '''
        url = reverse('recipe_list_create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])

    def test_list_with_recipes(self):
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
        url = reverse('recipe_list_create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_anon_cant_create_recipe(self):
        '''
        Unauthenticated users cannot create recipes.
        '''
        client = APIClient()
        url = reverse('recipe_list_create')
        response = client.post(url, {
            'title': 'test',
            'description': 'test',
            'cook_time': '5',
            'servings': '10',
            'ingredients': 'test',
            'directions': 'test'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Recipe.objects.count(), 0)

    def test_create_recipe(self):
        '''
        Authenticated users can create recipes.
        '''
        user = User.objects.create_user(username='steve')
        client = APIClient()
        client.force_authenticate(user=user)
        url = reverse('recipe_list_create')
        response = client.post(url, {
            'title': 'test',
            'description': 'test',
            'cook_time': '5',
            'servings': '10',
            'ingredients': 'test',
            'directions': 'test'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Recipe.objects.count(), 1)


class RecipeRetrieveUpdateDestroyTests(TestCase):
    def test_anon_can_retrieve(self):
        '''
        Anon users can retrieve single recipes.
        '''
        user = User.objects.create_user(username='steve')
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        serializer = RecipeSerializer(recipe)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_owner_can_retrieve(self):
        '''
        Recipe owner can retrieve recipe.
        '''
        user = User.objects.create_user(username='steve')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        serializer = RecipeSerializer(recipe)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_non_owner_user_can_retrieve(self):
        '''
        Authenticated user whomst does not own
        recipe can retrieve.
        '''
        owner = User.objects.create_user(username='steve')
        user = User.objects.create_user(username='bront')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        serializer = RecipeSerializer(recipe)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_anon_cant_update(self):
        '''
        Anon user cannot update recipes.
        '''
        owner = User.objects.create_user(username='steve')
        client = APIClient()
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.put(url, {
            'title': 'soup',
            'desciption': 'a nice stew',
            'cook_time': '5',
            'servings': '12',
            'ingredients': 'water, beef, celery',
            'directions': 'cook, eat'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Recipe.objects.get().title, 'stew')

    def test_non_owner_cant_update(self):
        '''
        Non owning user cannot update recipes.
        '''
        owner = User.objects.create_user(username='steve')
        user = User.objects.create_user(username='bront')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.put(url, {
            'title': 'soup',
            'desciption': 'a nice stew',
            'cook_time': '5',
            'servings': '12',
            'ingredients': 'water, beef, celery',
            'directions': 'cook, eat'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Recipe.objects.get().title, 'stew')

    def test_owner_can_update(self):
        '''
        Owning user can update recipes.
        '''
        owner = User.objects.create_user(username='steve')
        client = APIClient()
        client.force_authenticate(user=owner)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.put(url, {
            'title': 'soup',
            'desciption': 'a nice stew',
            'cook_time': '5',
            'servings': '12',
            'ingredients': 'water, beef, celery',
            'directions': 'cook, eat'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(Recipe.objects.get().title, 'soup')

    def test_anon_cant_destroy(self):
        '''
        Anon user cannot destroy recipes.
        '''
        user = User.objects.create_user(username='steve')
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = self.client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(Recipe.objects.count(), 1)

    def test_non_onwer_cant_destroy(self):
        '''
        Non onwer user cannot destroy recipes.
        '''
        owner = User.objects.create_user(username='steve')
        user = User.objects.create_user(username='bront')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Recipe.objects.count(), 1)

    def test_onwer_can_destroy(self):
        '''
        Onwer can destroy recipes.
        '''
        user = User.objects.create_user(username='steve')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Recipe.objects.count(), 0)

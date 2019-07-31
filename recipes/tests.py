from django.urls import reverse
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIClient
from rest_auth.serializers import UserDetailsSerializer
from django.contrib.auth.models import User
from .serializers import RecipeSerializer
from .models import Recipe, MadeRecipe


class LogoutViewTests(TestCase):
    def test_auth_token_gets_reset_on_logout(self):
        '''
        Logout should reset the auth token.
        '''
        client = APIClient()
        user = User.objects.create_user(
            username='test', email='test@test.com', password='test123')
        url = '/rest-auth/login/'
        data = {
            'email': 'test@test.com',
            'password': 'test123'}
        # Login and get the first key
        response = client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('key' in response.data)
        key = response.data['key']
        # Logout
        client.force_authenticate(user=user)
        response = client.post('/rest-auth/logout/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Login again
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('key' in response.data)
        self.assertNotEqual(response.data['key'], key)


class LoginViewTests(TestCase):
    def test_login_works_with_email(self):
        '''
        Login should return a token key
        if given good email/password.
        '''
        User.objects.create_user(
            username='test', email='test@test.com', password='test123')
        url = '/rest-auth/login/'
        data = {
            'email': 'test@test.com',
            'password': 'test123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('key' in response.data)

    def test_login_works_with_username(self):
        '''
        Login should return a token key
        if given good username/password.
        '''
        User.objects.create_user(
            username='test', email='test@test.com', password='test123')
        url = '/rest-auth/login/'
        data = {
            'username': 'test',
            'password': 'test123'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue('key' in response.data)

    def test_cant_login_with_bad_creds(self):
        '''
        Login should not return a token key
        if given bad password.
        '''
        User.objects.create_user(
            username='test', email='test@test.com', password='test123')
        url = '/rest-auth/login/'
        data = {
            'username': 'test',
            'password': 'wrongpwd'}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertTrue('key' not in response.data)


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


class CurrentUserViewTests(TestCase):
    def test_anon_cannot_access(self):
        '''
        Anon user cannot access this endpoint.
        '''
        url = '/rest-auth/user/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_user_can_access(self):
        '''
        Authenticated users can retrieve from here.
        '''
        user = User.objects.create_user(username='steve', email='s@s.com')
        client = APIClient()
        client.force_authenticate(user=user)
        url = '/rest-auth/user/'
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = UserDetailsSerializer(user)
        self.assertEqual(response.data, serializer.data)


class RecipeListCreateTests(TestCase):
    def test_list_no_recipes(self):
        '''
        Should return an emtpy list if no recipes saved.
        '''
        url = reverse('recipe_list_create')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['results'], [])

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
        self.assertEqual(response.data['results'], serializer.data)

    def test_with_made_recipe(self):
        '''
        Recipes that the current user has made
        return with an attribute 'made_it' set to true.
        '''
        user = User.objects.create_user(username='steve')
        client = APIClient()
        client.force_authenticate(user=user)
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=user)
        MadeRecipe.objects.create(user=user, recipe=recipe)
        url = reverse('recipe_list_create')
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('made_it', response.data['results'][0])
        self.assertEqual(response.data['results'][0]['made_it'], True)

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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
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

    def test_with_made_recipe(self):
        '''
        Recipes made by current user return
        with made_it attribute set to true.
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
        MadeRecipe.objects.create(recipe=recipe, user=user)
        url = reverse('recipe_rud', kwargs={'id': recipe.id})
        response = client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('made_it', response.data)
        self.assertEqual(response.data['made_it'], True)

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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
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
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
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


class MadeRecipeTests(TestCase):
    def test_anon_cannot_access(self):
        '''
        Anon users cannot use this view.
        '''
        owner = User.objects.create_user(username='steve')
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_make', kwargs={'id': recipe.id})
        make_resp = self.client.post(url, format='json')
        unmake_resp = self.client.delete(url, format='json')
        self.assertEqual(make_resp.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(unmake_resp.status_code, status.HTTP_403_FORBIDDEN)

    def test_can_make_recipe(self):
        '''
        Users can add recipes to their list of
        made recipes.
        '''
        client = APIClient()
        owner = User.objects.create_user(username='steve')
        user = User.objects.create_user(username='bob')
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        url = reverse('recipe_make', kwargs={'id': recipe.id})
        client.force_authenticate(user=user)
        response = client.post(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(
            MadeRecipe.objects.filter(recipe=recipe, user=user).count(), 1)

    def test_can_unmake_recipe(self):
        '''
        Users can add recipes to their list of
        made recipes.
        '''
        client = APIClient()
        owner = User.objects.create_user(username='steve')
        user = User.objects.create_user(username='bob')
        recipe = Recipe.objects.create(
            title='stew', description='a nice stew',
            cook_time='5', servings='12',
            ingredients='water, beef, celery',
            directions='cook, eat', user=owner)
        MadeRecipe.objects.create(user=user, recipe=recipe)
        url = reverse('recipe_make', kwargs={'id': recipe.id})
        client.force_authenticate(user=user)
        response = client.delete(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(
            MadeRecipe.objects.filter(recipe=recipe, user=user).count(), 0)

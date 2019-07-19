from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone


class Recipe(models.Model):
    title = models.CharField(max_length=120)
    description = models.CharField(
        max_length=240, default=None, blank=True, null=True)
    cook_time = models.CharField(max_length=4)
    servings = models.CharField(max_length=10)
    date_posted = models.DateTimeField(default=timezone.now)
    image_file = models.TextField(
        default=None, blank=True, null=True)
    ingredients = models.TextField()
    directions = models.TextField()
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    def get_image_url(self):
        if self.image_file is None:
            return 'img/default.png'
        return self.image_file

    def __str__(self):
        return str(self.title)


class MadeRecipe(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

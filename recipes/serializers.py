from rest_framework import serializers
from django.contrib.auth.models import User


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
    
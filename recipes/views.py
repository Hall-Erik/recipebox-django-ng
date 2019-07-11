from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from .serializers import UserSerializer


class HelloView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user.username
        content = {
            'user': user,
            'message': "hello"}
        return Response(content)


class RegisterView(CreateAPIView):
    model = User
    permission_classes = (AllowAny,)
    serializer_class = UserSerializer

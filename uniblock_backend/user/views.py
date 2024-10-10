from rest_framework import generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Profile
from .serializers import RegisterSerializer, LoginSerializer, ProfileSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

class LoginView(generics.CreateAPIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        token = serializer.validated_data
        return Response({"token": token.key}, status = status.HTTP_200_OK)
    
class ProfileView(generics.GenericAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer

    def patch(self, request):
        profile = Profile.objects.get(user = request.user)
        serializer = self.get_serializer(data = request.data)
        serializer.is_valid(raise_exception = True)
        data = serializer.validated_data
        profile.nickname = data['nickname']
        profile.department = data['department']
        profile.save()
        return Response({"nickname": profile.nickname, "department": profile.department},
                        status = status.HTTP_206_PARTIAL_CONTENT)
    
    def get(self, request):
        profile = Profile.objects.get(user = request.user)
        serializer = self.get_serializer(profile)
        return Response(serializer.data)
from rest_framework import serializers
from .models import Post
from user.serializers import ProfileSerializer

class VoteSerializer(serializers.Serializer):
    profile = ProfileSerializer(read_only = True)

    class Meta:
        model = Post
        fields = ('profile', 'choice')

class TallySerializer(serializers.Serializer):
    agree = serializers.IntegerField()
    disagree = serializers.IntegerField()
    total = serializers.IntegerField()

    class Meta:
        model = Post
        fields = ('agree', 'disagree', 'total')

class PostSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer(read_only=True)
    
    class Meta:
        model = Post
        fields = ('pk', 'profile', 'author', 'title', 'content')

class PostCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('title', 'content')


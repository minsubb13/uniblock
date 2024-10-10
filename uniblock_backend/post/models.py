from django.db import models
from django.contrib.auth.models import User
from user.models import Profile

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='post')
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='author_profile')
    title = models.CharField(max_length=128)
    content = models.TextField()
    participation = models.ManyToManyField(User, related_name='participation', through='Vote')

class Vote(models.Model):
    voter = models.ForeignKey(User, on_delete=models.CASCADE)
    profile = models.ForeignKey(Profile, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    choice = models.CharField(max_length=1, choices = [('O', 'agree'), ('X', 'disagree')])
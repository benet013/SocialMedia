from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.CharField(max_length=200, default="Add your bio")
    image = models.ImageField(default='default.jpg')
    follower = models.ManyToManyField(User, related_name='following', blank=True)
    
    def __str__(self):
        return self.user.username
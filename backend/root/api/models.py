from django.db import models
from django.contrib.auth import get_user_model

class LikeCount(models.Model):
    post = models.OneToOneField("Post", on_delete=models.CASCADE, related_name='like_count')
    count = models.PositiveIntegerField(default=0)
    
    def __str__(self):
        return f"Likes for {self.post.title}: {self.count}"

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.title
    

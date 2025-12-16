from rest_framework import serializers
from .models import Post, LikeCount, Like

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = LikeCount
        fields = ['id', 'post', 'count', 'liked']

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    liked = serializers.SerializerMethodField()
    author_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'author_name', 'likes', 'liked','created_at', 'updated_at']
        extra_kwargs = {
            'author': {'read_only': True},
            'created_at': {'read_only': True},
        }
        
    def get_likes(self, obj):
        return obj.like_count.count
    
    def get_liked(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return Like.objects.filter(user=request.user,post=obj).exists()
    
    def get_author_name(self, obj):
        return obj.author.username
        
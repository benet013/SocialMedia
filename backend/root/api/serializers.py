from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    likes = serializers.SerializerMethodField()
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'likes','created_at', 'updated_at']
        extra_kwargs = {
            'author': {'read_only': True},
            'created_at': {'read_only': True},
        }
        
    def get_likes(self, obj):
        try:
            return obj.like_count.count
        except Exception:
            return 0
        
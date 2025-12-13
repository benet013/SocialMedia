from django.contrib.auth import get_user_model
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post
from .serializers import PostSerializer

User = get_user_model()

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')
        user_id = self.request.query_params.get('user')

        if user_id:
            queryset = queryset.filter(author_id=user_id)
        else: 
            queryset= queryset.filter(author_id=self.request.user.id)
            
        return queryset
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

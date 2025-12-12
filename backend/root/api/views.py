from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self, pk=None):
        user = pk if pk else self.request.user
        return super().get_queryset().filter(author=user)
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

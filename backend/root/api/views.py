from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from rest_framework.decorators import permission_classes
from .models import Post, LikeCount,Like
from .serializers import PostSerializer, LikeSerializer

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
        
@receiver(post_save, sender=Post)
def create_like_count(sender, instance, created, **kwargs):
    if created:
        LikeCount.objects.create(post=instance)

@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def like_a_post(request, post_id):
    post = get_object_or_404(Post, id=post_id)
    user = request.user
    
    with transaction.atomic():
        like, created = Like.objects.get_or_create(
            user=user,
            post=post
        )
        
        if not created:
            like.delete()
            post.like_count.count -=1
            liked = False
        else:
            post.like_count.count +=1
            liked = True
            
        post.like_count.save()
    
    
    return Response({
        "post_id": post.id,
        "count": post.like_count.count,
        "liked": liked
    },status=status.HTTP_200_OK)
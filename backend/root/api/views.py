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
from .serializers import PostSerializer
from .pagination import FeedCursorPagination

User = get_user_model()

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = FeedCursorPagination
    
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
    
    def get_queryset(self):
        queryset = Post.objects.all().order_by('-created_at')
        user = self.request.query_params.get('user')

        if user == "self":
            return queryset.filter(author_id=self.request.user.id)

        if user and user != "dashboard":
            return queryset.filter(author_id=user)

        return queryset

    def list(self, request, *args, **kwargs):
        user = request.query_params.get("user")
        queryset = self.get_queryset()

        # ✅ paginate only dashboard
        if user == "dashboard":
            page = self.paginate_queryset(queryset)
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        # ✅ explicitly disable pagination
        serializer = self.get_serializer(queryset, many=True)
        return Response({
            "results": serializer.data,
            "next": None,
            "previous": None,
        })
        

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
    
@receiver(post_save, sender=Post)
def create_like_count(sender, instance, created, **kwargs):
    if created:
        LikeCount.objects.create(post=instance)
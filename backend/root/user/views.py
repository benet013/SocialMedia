from django.contrib.auth import get_user_model
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Profile
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import *

User = get_user_model()
    
class RegisterView(CreateAPIView):
    serializer_class = RegisterSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": RegisterSerializer(user, context=self.get_serializer_context()).data,
            "message": "User registered successfully."
        }, status=status.HTTP_201_CREATED)
        

class UserViewset(ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    search_fields = ['username']
    
    def get_queryset(self):
        qs = User.objects.all()
        
        if self.request.user.is_authenticated:
            qs = qs.exclude(id=self.request.user.id)
            
        return qs
    
    @action(detail=False, methods=['get'], url_path='self')
    def self(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['patch'], url_path='self/edit')
    def update_profile(self, request):
        profile = request.user.profile
        serializer = ProfileSerializer(
            profile,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated])
    def follow(self, request, pk=None):
        target_user = self.get_object()
        target_profile = target_user.profile
        user = request.user

        if target_user == user:
            return Response(
                {"error": "You cannot follow yourself"},
                status=400
            )

        if target_profile.follower.filter(id=user.id).exists():
            target_profile.follower.remove(user)
            is_following = False
        else:
            target_profile.follower.add(user)
            is_following = True

        return Response({
            "followers_count": target_profile.follower.count(),
            "is_following": is_following
        })

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)
    
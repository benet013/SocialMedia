from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, like_a_post

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
urlpatterns = [
    path('posts/<int:post_id>/like/', like_a_post)
] + router.urls
from django.urls import path
from .views import RegisterView
from .views import UserViewset
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'profile', UserViewset, basename='profile')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
] + router.urls
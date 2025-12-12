from django.urls import path
from .views import RegisterView
from .views import user_profile

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/<int:pk>/', user_profile, name='user_profile'),
    path('profile/', user_profile, name='user_own_profile'),
]
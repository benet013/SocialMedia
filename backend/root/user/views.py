from django.contrib.auth import get_user_model
from rest_framework.filters import SearchFilter
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.generics import CreateAPIView
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework import status
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
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [SearchFilter]
    search_fields = ['username']
    
    @action(detail=False, methods=['get'], url_path='self')
    def self(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
# @api_view(['GET'])
# def user_profile(request, pk=None):
#     User = get_user_model()
#     try:
#         id = pk if pk else request.user.id
#         user = User.objects.get(id=id)
#         serializer = UserSerializer(user)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except User.DoesNotExist:
#         return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    
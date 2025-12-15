from django.conf import settings
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Profile

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}
        
    def create(self, validated_data):
        user = get_user_model().objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

        
class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(
        source='user.username',
        write_only=True,
        required=False
    )
    email = serializers.EmailField(
        source='user.email',
        write_only=True,
        required=False
    )
    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.SerializerMethodField()
    remove_image = serializers.BooleanField(write_only=True, required=False)
    
    class Meta:
        model = Profile
        fields = ('id', 'username', 'email' ,'bio', 'image','image_url', 'remove_image')
        
    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image:
            url = obj.image.url
            if request:
                return request.build_absolute_uri(url)
            return url
        return None
    
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        user = instance.user
        username = user_data.get('username')
        email = user_data.get('email')

        if username:
            user.username = username
        if email:
            user.email = email

        if username or email:
            user.save()
            
        if validated_data.pop('remove_image', False):
            if instance.image and instance.image.name != settings.DEFAULT_PROFILE_IMAGE:
                instance.image.delete(save=False)
            instance.image = settings.DEFAULT_PROFILE_IMAGE
        
        image = validated_data.get("image")
        if image:
            if instance.image and instance.image.name != settings.DEFAULT_PROFILE_IMAGE:
                instance.image.delete(save=False)
            instance.image = image


        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
    
class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    class Meta:
        model = get_user_model()
        fields = ('id', 'username', 'email','profile')
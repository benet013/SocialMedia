from django.contrib import admin
from .models import Post,LikeCount

admin.site.register(Post)
admin.site.register(LikeCount)
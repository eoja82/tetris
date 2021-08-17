from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Scores, User

admin.site.register(User, UserAdmin)
admin.site.register(Scores)

from django.contrib import admin

from pfi.apps.users.models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'date_joined', 'is_active', 'is_superuser']

admin.site.register(User, UserAdmin)

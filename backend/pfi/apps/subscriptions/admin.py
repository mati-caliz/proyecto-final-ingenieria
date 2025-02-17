from django.contrib import admin

from pfi.apps.subscriptions.models import Subscription


class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'expires_at']
    ordering = ['-created_at']

admin.site.register(Subscription, SubscriptionAdmin)

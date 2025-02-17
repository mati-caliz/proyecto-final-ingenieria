from datetime import timedelta

from django.db import models
from django.utils.timezone import localtime, now

from pfi.apps.users.models import User


class Subscription(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = 'Subscriptions'

    @classmethod
    def is_user_currently_subscribed(cls, user):
        return cls.objects.filter(
            user=user,
            created_at__gte=localtime(now() - timedelta(days=30)),
            expires_at__lte=localtime(now())
        ).exists()

from django.db import models

from pfi.apps.users.models import User


class Analysis(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    is_premium_request = models.BooleanField(default=False)
    requester = models.ForeignKey(User, on_delete=models.CASCADE)
    result = models.TextField()

    class Meta:
        verbose_name_plural = 'Analyses'

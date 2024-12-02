from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = ['id', 'created_at', 'expires_at', 'user']
        read_only_fields = ['id', 'created_at', 'expires_at', 'user']

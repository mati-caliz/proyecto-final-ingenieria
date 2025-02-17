from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.utils.timezone import now
from datetime import timedelta
from .models import Subscription
from .serializers import SubscriptionSerializer


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_subscription(request):
    try:
        user = request.user
        if Subscription.is_user_currently_subscribed(user):
            return Response(
                {"message": "El usuario ya tiene una suscripción activa."},
                status=status.HTTP_400_BAD_REQUEST
            )

        expires_at = now() + timedelta(days=30)

        subscription = Subscription.objects.create(
            user=user,
            created_at=now(),
            expires_at=expires_at
        )

        serializer = SubscriptionSerializer(subscription)
        return Response(
            {
                "message": "Suscripción creada exitosamente.",
                "subscription": serializer.data,
            },
            status=status.HTTP_201_CREATED
        )

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

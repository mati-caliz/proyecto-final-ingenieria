from django.http import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from google.auth.transport import requests
from google.oauth2 import id_token

from pfi.apps.users.models import User
from pfi.apps.users.serializers import MyTokenObtainPairSerializer, UserSerializer


# Vista para crear un nuevo usuario
class NewUserView(generics.CreateAPIView):
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    queryset = User.objects.all()

# Vista para obtener información del perfil del usuario autenticado
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# Vista personalizada para obtener el token con usuario y contraseña
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# Vista para manejar el inicio de sesión con Google
class GoogleLoginView(APIView):
    permission_classes = [permissions.AllowAny]  # Permitir acceso público

    def post(self, request):
        token = request.data.get('token')

        if not token:
            return Response({"error": "Token no proporcionado"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Validar el token de Google
            idinfo = id_token.verify_oauth2_token(
                token, requests.Request(), "TU_CLIENT_ID_DE_GOOGLE"
            )

            # Extraer datos del token
            email = idinfo['email']
            google_id = idinfo['sub']
            name = idinfo.get('name', '')
            profile_picture = idinfo.get('picture', '')

            user, created = User.objects.get_or_create(email=email, defaults={
                'google_id': google_id,
                'first_name': name.split(" ")[0],
                'last_name': " ".join(name.split(" ")[1:]),
                'profile_picture': profile_picture,
            })

            if not created and user.google_id != google_id:
                user.google_id = google_id
                user.save()

            # Generar tokens JWT para el usuario
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': user.email,
                    'name': f"{user.first_name} {user.last_name}",
                    'profile_picture': user.profile_picture,
                },
            })

        except ValueError:
            return Response({"error": "Token de Google inválido"}, status=status.HTTP_400_BAD_REQUEST)

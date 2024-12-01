from django.urls import path
from .views import NewUserView, profile, GoogleLoginView, MyTokenObtainPairView

urlpatterns = [
    path('', NewUserView.as_view(), name='create-user'),  # Ruta para crear usuarios
    path('profile/', profile, name='profile'),           # Ruta para obtener perfil de usuario
    path('login/', GoogleLoginView.as_view(), name='google-login'),  # Ruta para login con Google
    path('old-login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),  # Ruta para login viejo
]

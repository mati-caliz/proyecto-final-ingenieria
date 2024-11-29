from django.urls import path

from . import views
from .views import NewUserView, profile

from django.urls import path
from .views import NewUserView, profile, MyTokenObtainPairView, GoogleLoginView

urlpatterns = [
    path("", NewUserView.as_view(), name="users"),
    path("profile", profile, name="profile"),
    path("login", GoogleLoginView.as_view(), name="google-login"),
]


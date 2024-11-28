from django.urls import path

from . import views
from .views import NewUserView, profile

urlpatterns = [
    path("hello-world", views.hello_world, name="hello-world"),
    path("", NewUserView.as_view(), name="users"),
    path("profile", profile, name="profile"),
    path('login', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
]

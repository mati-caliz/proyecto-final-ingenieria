from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from pfi.apps.users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['email', 'password']

    def create(self, validated_data):
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_login_data(cls, user):
        token = super().get_token(user)
        return token

    def validate(self, attrs):
        data = super().validate(attrs)

        data['accessToken'] = data.pop('access')
        data['refreshToken'] = data.pop('refresh')
        data['email'] = self.user.email

        return data

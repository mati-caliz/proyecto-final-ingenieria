from django.urls import path

from . import views
from .views import latest_analyses

urlpatterns = [
    # path('', views.analyses, name='history'),
    path('audio', views.AudioAnalysisView.as_view(), name='audio_analysis'),
    path('text', views.text_analysis, name='text_analysis'),
    path('url', views.url_analysis, name='url_analysis'),
    path('video', views.VideoAnalysisView.as_view(), name='video_analysis'),
    path('latest', latest_analyses, name='latest_analyses'),
]

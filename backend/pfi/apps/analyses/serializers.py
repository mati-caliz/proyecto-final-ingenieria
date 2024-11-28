from rest_framework import serializers


class VideoAnalysisSerializer(serializers.Serializer):
    video_file = serializers.FileField()

    def validate_video_file(self, value):
        if not value.name.endswith(('.mp4', '.avi')):
            raise serializers.ValidationError("Unsupported file type.")
        return value


class AudioAnalysisSerializer(serializers.Serializer):
    audio_file = serializers.FileField()

    def validate_audio_file(self, value):
        if not value.name.endswith(('.mp3', '.wav')):
            raise serializers.ValidationError("Unsupported file type.")
        return value

class TextAnalysisSerializer(serializers.Serializer):
    text = serializers.CharField()

class UrlAnalysisSerializer(serializers.Serializer):
    text = serializers.URLField()

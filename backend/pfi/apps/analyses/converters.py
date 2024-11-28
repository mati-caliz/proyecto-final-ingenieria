import io
import os
import tempfile

import assemblyai as aai
import yt_dlp
from django.core.files.uploadedfile import TemporaryUploadedFile, InMemoryUploadedFile
from moviepy.editor import VideoFileClip
from yt_dlp.postprocessor.common import PostProcessor

aai.settings.api_key = "521e445faf5f4dce9b5fdfea55b1c50a"


class BufferPostProcessor(PostProcessor):
    def __init__(self):
        super().__init__(None)
        self.buffer = io.BytesIO()

    def run(self, info):
        filename = info['filepath']
        with open(filename, 'rb') as f:
            self.buffer.write(f.read())
        os.remove(filename)
        return [], info

class YouTubeUrlToVideoConverter:
    @staticmethod
    def convert(youtube_url: str) -> TemporaryUploadedFile:
        postprocessor = BufferPostProcessor()

        ydl_opts = {
            'format': 'worstvideo+bestaudio/best',
            'quiet': True,
            'merge_output_format': 'mp4',
            'noplaylist': True,
            'outtmpl': os.path.join(tempfile.gettempdir(), 'video.%(ext)s'),
            'postprocessors': [{
                'key': 'FFmpegVideoConvertor',
                'preferedformat': 'mp4',
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.add_post_processor(postprocessor)
            ydl.download([youtube_url])

        video_buffer = postprocessor.buffer
        video_buffer.seek(0)

        temp_uploaded_file = TemporaryUploadedFile(
            name="video.mp4",
            content_type="video/mp4",
            size=video_buffer.getbuffer().nbytes,
            charset=None
        )

        temp_uploaded_file.file.write(video_buffer.getvalue())
        temp_uploaded_file.file.seek(0)

        return temp_uploaded_file


class VideoToAudioConverter:
    @staticmethod
    def convert(temp_video_file: TemporaryUploadedFile) -> InMemoryUploadedFile:
        try:
            video_clip = VideoFileClip(temp_video_file.temporary_file_path())
            audio_clip = video_clip.audio
        finally:
            os.remove(temp_video_file.temporary_file_path())

        with tempfile.NamedTemporaryFile(delete=False, suffix=".aac") as temp_audio_file:
            temp_audio_file_path = temp_audio_file.name

        audio_clip.write_audiofile(temp_audio_file_path, codec='aac', bitrate="192k")

        audio_clip.close()
        video_clip.close()

        with open(temp_audio_file_path, 'rb') as f:
            audio_bytes = io.BytesIO(f.read())

        os.remove(temp_audio_file_path)

        audio_bytes.seek(0)

        audio_file = InMemoryUploadedFile(
            file=audio_bytes,
            field_name='audio_file',
            name=f"{temp_video_file.name.split('.')[0]}.aac",
            content_type='audio/aac',
            size=audio_bytes.getbuffer().nbytes,
            charset=None,
            content_type_extra=None
        )

        return audio_file


class AudioToTextConverter:
    @staticmethod
    def convert(temp_audio_file: TemporaryUploadedFile) -> str:
        config = aai.TranscriptionConfig(language_code="es")
        transcriber = aai.Transcriber(config=config)
        transcript = transcriber.transcribe(temp_audio_file)

        if transcript.status == aai.TranscriptStatus.error:
            raise Exception(transcript.error)
        else:
            return transcript.text

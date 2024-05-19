import pathlib
import moviepy.editor as mp
from pytube import YouTube
import os



def convertidor_video(url:str):
        actual_path = str(pathlib.Path(__file__).parent.resolve()).replace("\\", "/")
        try:
            clip = mp.VideoFileClip(url)
            clip.audio.write_audiofile(actual_path + "/audio.wav")
        except Exception as e:
            print("Se ha producido un error: ", e)



def convertidor_youtube(link:str):
        actual_path = str(pathlib.Path(__file__).parent.resolve()).replace("\\", "/")
        try:
            yt = YouTube(link)
            stream = yt.streams.filter(progressive=True, file_extension='mp4').order_by('resolution').desc().first()
            stream.download(output_path=actual_path, filename="temp_video.mp4")
            print("El audio se ha descargado correctamente.")
        except Exception as e:
            print("Se ha producido un error: ", e)
        return actual_path + "/temp_video.mp4"



def video2audio(url:str) -> None:
    """ Descarga el audio del video en formato .wav.

    Se ingresa un string con la URL del video, o con el link de youtube.
    """
    
    if "youtube" in url:
        url_video = convertidor_youtube(url)
        convertidor_video(url_video)
        try:
            os.remove(url_video)
            print("El audio se ha descargado correctamente.")
        except Exception as e:
            print("Se ha producido un error: ", e)

    elif "youtube" not in url:
        convertidor_video(url)
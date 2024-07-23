import assemblyai as aai

aai.settings.api_key = "ffbcd19f906b4c688060d677d7ff18e9"

FILE_URL = r"C://Users//Matias Caliz//Desktop//Proyecto Final de Ingeniería//proyecto-final-ingenieria//algoritmos//audio.wav"

def audio_transcriber(url:str=FILE_URL):
    config = aai.TranscriptionConfig(language_code="es")
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(FILE_URL)

    if transcript.status == aai.TranscriptStatus.error:
        return transcript.error
    else:
        return transcript.text

if __name__ == "__main__":
    print(audio_transcriber(FILE_URL))
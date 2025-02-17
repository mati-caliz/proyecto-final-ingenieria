import assemblyai as aai

aai.settings.api_key = ""

FILE_URL = r""

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
import assemblyai as aai

aai.settings.api_key = "ffbcd19f906b4c688060d677d7ff18e9"

FILE_URL = r"C://Users//Matias Caliz//Desktop//proyecto-final-ingenieria//algoritmos//audio.wav"

config = aai.TranscriptionConfig(language_code="es")
transcriber = aai.Transcriber(config=config)
transcript = transcriber.transcribe(FILE_URL)

if transcript.status == aai.TranscriptStatus.error:
    print(transcript.error)
else:
    print(transcript.text)
import assemblyai as aai
import whisper
import timeit
import resource

aai.settings.api_key = "ffbcd19f906b4c688060d677d7ff18e9"

FILE_URL = r"//home//matiascaliz//Escritorio//PFI//proyecto-final-ingenieria//pruebas-realizadas//discurso_milei.wav"

def assemblyai_audio_transcriber(url:str=FILE_URL):
    config = aai.TranscriptionConfig(language_code="es")
    transcriber = aai.Transcriber(config=config)
    transcript = transcriber.transcribe(FILE_URL)

    if transcript.status == aai.TranscriptStatus.error:
        return transcript.error
    else:
        return transcript.text


def whisper_audio_transcriber(url:str=FILE_URL):
    model = whisper.load_model("base")
    result = model.transcribe(FILE_URL, fp16=False)
    transcripcion_whisper = result['text']
    return transcripcion_whisper

def compare_assemblyai_real():
    with open(r"//home//matiascaliz//Escritorio//PFI//proyecto-final-ingenieria//pruebas-realizadas//discurso_assemblyai.txt", "r", encoding="utf-8") as discurso_assemblyai:
        texto_assemblyai = discurso_assemblyai.read().lower()
    with open(r"//home//matiascaliz//Escritorio//PFI//proyecto-final-ingenieria//pruebas-realizadas//discurso_real.txt", "r", encoding="utf-8") as discurso_real:
        texto_real = discurso_real.read().lower()
    set_assemblyai = set(texto_assemblyai)
    set_real = set(texto_real)
    interseccion = set_real.intersection(set_assemblyai)
    union = set_real.union(set_assemblyai)
    similarity = len(interseccion) / len(union)
    return similarity * 100

def compare_whisper_real():
    with open(r"//home//matiascaliz//Escritorio//PFI//proyecto-final-ingenieria//pruebas-realizadas//discurso_whisper.txt", "r", encoding="utf-8") as discurso_whisper:
        texto_whisper = discurso_whisper.read().lower()
    with open(r"//home//matiascaliz//Escritorio//PFI//proyecto-final-ingenieria//pruebas-realizadas//discurso_real.txt", "r", encoding="utf-8") as discurso_real:
        texto_real = discurso_real.read().lower()
    set_whisper = set(texto_whisper)
    set_real = set(texto_real)
    interseccion = set_real.intersection(set_whisper)
    union = set_real.union(set_whisper)
    similarity = len(interseccion) / len(union)
    return similarity * 100


if __name__ == "__main__":
    #print(assemblyai_audio_transcriber(FILE_URL))
    #print(whisper_audio_transcriber(FILE_URL))
    #tiempo_ejecucion_assembly = timeit.timeit(assemblyai_audio_transcriber(FILE_URL), number=1000)
    #print(f"Tiempo de ejecución de Assemblyai: {tiempo_ejecucion_assembly(FILE_URL):.6f} segundos")
    #tiempo_ejecucion_whisper = timeit.timeit(whisper_audio_transcriber(FILE_URL), number=1000)
    #print(f"Tiempo de ejecución de Whisper: {tiempo_ejecucion_whisper:.6f} segundos")
    #uso_inicial = resource.getrusage(resource.RUSAGE_SELF)
    #assemblyai_audio_transcriber(FILE_URL)
    #uso_final = resource.getrusage(resource.RUSAGE_SELF)
    #uso_cpu = uso_final.ru_utime - uso_inicial.ru_utime
    #uso_memoria = uso_final.ru_maxrss - uso_inicial.ru_maxrss
    #print(f"Consumo de CPU: {uso_cpu:.6f} segundos")
    #print(f"Consumo de memoria: {uso_memoria} KB")
    #uso_inicial = resource.getrusage(resource.RUSAGE_SELF)
    #whisper_audio_transcriber(FILE_URL)
    #uso_final = resource.getrusage(resource.RUSAGE_SELF)
    #uso_cpu = uso_final.ru_utime - uso_inicial.ru_utime
    #uso_memoria = uso_final.ru_maxrss - uso_inicial.ru_maxrss
    #print(f"Consumo de CPU: {uso_cpu:.6f} segundos")
    #print(f"Consumo de memoria: {uso_memoria} KB")
    print(f"Porcentaje de palabras correctas con Assemblyai: {compare_assemblyai_real():.4f}%")
    print(f"Porcentaje de palabras correctas con Whisper: {compare_whisper_real():.4f}%")



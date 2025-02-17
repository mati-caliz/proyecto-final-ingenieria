# NOTA IMPORTANTE: Para ejecutar este script se debe tener instalado Python 3.8 o superior
# NOTA IMPORTANTE: El módulo de resource que mide el uso de CPU solamente puede usarse con Linux, en Windows no funciona

# Importar las dependencias con pip install nombreDependencia en la consola
import assemblyai as aai
import whisper
import timeit
import os
import resource

# Ingresar API Key de AssemblyAI (la ingresada es la mia personal, se puede usar para pruebas)
aai.settings.api_key = "ffbcd19f906b4c688060d677d7ff18e9"

current_directory = os.path.dirname(__file__)
# Ingresar la URL del audio a analizar (por defecto toma la del repositorio)
AUDIO_DISCURSO = os.path.join(current_directory, "discurso-milei-onu.wav")

# Ingresar la URL del discurso completo en formato de .txt (por defecto toma la del repositorio)
DISCURSO_REAL = os.path.join(current_directory, "discurso-original.txt")


# Transcribir audio con AssemblyAI
def transcribir_audio_assemblyai(url:str=AUDIO_DISCURSO):
    configuracion = aai.TranscriptionConfig(language_code="es")
    resultado = aai.Transcriber(config=configuracion)
    transcripcion_assemblyai = resultado.transcribe(AUDIO_DISCURSO)
    if transcripcion_assemblyai.status == aai.TranscriptStatus.error:
        return transcripcion_assemblyai.error
    else:
        return transcripcion_assemblyai.text


# Transcribir audio con Whisper
def transcribir_audio_whisper(url:str=AUDIO_DISCURSO):
    modelo = whisper.load_model("base")
    resultado = modelo.transcribe(AUDIO_DISCURSO, fp16=False)
    transcripcion_whisper = resultado['text']
    return transcripcion_whisper


# Comparar la transcripción del audio con el discurso real
def comparar_con_discurso_real(transcripcion:str, discurso_real:str):
    set_transcripcion = set(transcripcion)
    set_discurso_real = set(discurso_real)
    interseccion = set_discurso_real.intersection(set_transcripcion)
    union = set_discurso_real.union(set_transcripcion)
    similarity = len(interseccion) / len(union)
    return similarity * 100


if __name__ == "__main__":
    transcripcion_audio_assemblyai = transcribir_audio_assemblyai(AUDIO_DISCURSO)
    transcripcion_audio_whisper = transcribir_audio_whisper(AUDIO_DISCURSO)    
    # print(transcripcion_audio_assemblyai)
    # print(transcripcion_audio_whisper)

    tiempo_ejecucion_assembly = timeit.timeit(transcripcion_audio_assemblyai, number=1000)
    print(f"Tiempo de ejecución de Assemblyai: {tiempo_ejecucion_assembly:.6f} segundos")

    tiempo_ejecucion_whisper = timeit.timeit(transcribir_audio_whisper, number=1000)
    print(f"Tiempo de ejecución de Whisper: {tiempo_ejecucion_whisper:.6f} segundos")
    
    uso_inicial = resource.getrusage(resource.RUSAGE_SELF)
    transcribir_audio_assemblyai(AUDIO_DISCURSO)
    uso_final = resource.getrusage(resource.RUSAGE_SELF)
    uso_cpu = uso_final.ru_utime - uso_inicial.ru_utime
    uso_memoria = uso_final.ru_maxrss - uso_inicial.ru_maxrss
    print(f"Consumo de CPU AssemblyAI: {uso_cpu:.6f} segundos")
    print(f"Consumo de memoria AssemblyAI: {uso_memoria} KB")
    uso_inicial = resource.getrusage(resource.RUSAGE_SELF)
    
    transcribir_audio_assemblyai(AUDIO_DISCURSO)
    uso_final = resource.getrusage(resource.RUSAGE_SELF)
    uso_cpu = uso_final.ru_utime - uso_inicial.ru_utime
    uso_memoria = uso_final.ru_maxrss - uso_inicial.ru_maxrss
    print(f"Consumo de CPU Whisper: {uso_cpu:.6f} segundos")
    print(f"Consumo de memoria Whisper: {uso_memoria} KB")
    
    print(f"Porcentaje de palabras correctas con Assemblyai: {comparar_con_discurso_real(transcripcion_audio_assemblyai, DISCURSO_REAL):.4f}%")
    print(f"Porcentaje de palabras correctas con Whisper: {comparar_con_discurso_real(transcripcion_audio_whisper, DISCURSO_REAL):.4f}%")
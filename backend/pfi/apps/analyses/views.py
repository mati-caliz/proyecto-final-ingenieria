import json

from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from openai import OpenAI
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from pfi.apps.analyses.converters import AudioToTextConverter, VideoToAudioConverter, YouTubeUrlToVideoConverter
from pfi.apps.analyses.models import Analysis
from pfi.apps.analyses.serializers import AudioAnalysisSerializer, TextAnalysisSerializer, VideoAnalysisSerializer, \
    UrlAnalysisSerializer

client = OpenAI(
    api_key="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")


class VideoAnalysisView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'video_file',
                openapi.IN_FORM,
                description="Video file to be transcribed (.mp4 or .avi)",
                type=openapi.TYPE_FILE,
                required=True
            ),
        ],
        responses={
            201: openapi.Response(description="Analysis successful", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'transcription': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )),
            400: "Invalid input",
        }
    )
    def post(self, request):
        serializer = VideoAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        video_file = serializer.validated_data['video_file']
        try:
            audio_file = VideoToAudioConverter.convert(video_file)
            transcription = AudioToTextConverter.convert(audio_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            analysis = sendPrompt(transcription)
            user = self.request.user
            newAnalysis = Analysis.objects.create(is_premium_request=False, requester=user, result=analysis)
            newAnalysis.save()
        except Exception as e:
            raise e

        return Response({"analysis": analysis}, status=status.HTTP_201_CREATED)


class AudioAnalysisView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(
        manual_parameters=[
            openapi.Parameter(
                'audio_file',
                openapi.IN_FORM,
                description="Audio file to be transcribed (.mp3 or .wav)",
                type=openapi.TYPE_FILE,
                required=True
            ),
        ],
        responses={
            201: openapi.Response(description="Analysis successful", schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'transcription': openapi.Schema(type=openapi.TYPE_STRING)
                }
            )),
            400: "Invalid input",
        }
    )
    def post(self, request):
        serializer = AudioAnalysisSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        audio_file = serializer.validated_data['audio_file']
        try:
            transcription = AudioToTextConverter.convert(audio_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            analysis = sendPrompt(transcription)
            user = self.request.user
            newAnalysis = Analysis.objects.create(is_premium_request=False, requester=user, result=analysis)
            newAnalysis.save()
        except Exception as e:
            raise e

        return Response({"analysis": analysis}, status=status.HTTP_201_CREATED)


@swagger_auto_schema(method="POST", request_body=TextAnalysisSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def text_analysis(request):
    text_analysis_serializer = TextAnalysisSerializer(data=request.data)
    text_analysis_serializer.is_valid(raise_exception=True)

    try:
        analysis = sendPrompt(text_analysis_serializer.data['text'])
        user = request.user
        newAnalysis = Analysis.objects.create(is_premium_request=False, requester=user, result=analysis)
        newAnalysis.save()
    except Exception as e:
        raise e

    return Response({"analysis": analysis}, status=status.HTTP_201_CREATED)


@swagger_auto_schema(method="POST", request_body=UrlAnalysisSerializer)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def url_analysis(request):
    url_analysis_serializer = TextAnalysisSerializer(data=request.data)
    url_analysis_serializer.is_valid(raise_exception=True)

    try:
        video_file = YouTubeUrlToVideoConverter.convert(request.data.get('text'))
        audio_file = VideoToAudioConverter.convert(video_file)
        transcription = AudioToTextConverter.convert(audio_file)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    try:
        analysis = sendPrompt(transcription)
        user = request.user
        newAnalysis = Analysis.objects.create(is_premium_request=False, requester=user, result=analysis)
        newAnalysis.save()
    except Exception as e:
        raise e

    return Response({"analysis": analysis}, status=status.HTTP_201_CREATED)


# Ejemplo de código que debería funcionar:
# parsed = json.loads(transcription)
# print(parsed['title'])
# print(parsed['analysis'])
def sendPrompt(text: str):
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[{
            "role": "user",
            "content": f'''
    Analiza el texto proporcionado según las siguientes reglas. Tu respuesta debe ser un JSON válido con dos campos:  
    1. "title": Título que resuma el tema general del texto.  
    2. "analysis": Un array de objetos, donde cada objeto tenga:  
       - "affirmation": Cita textual del texto, sin modificaciones tuyas.  
       - "analysis": Análisis de la afirmación que explique su veracidad, ESPECIFICANDO LAS FUENTES DE INFORMACIÓN PARA PODER VISITARLAS Y COMPARAR RESULTADOS. 
       CUALQUIER ANÁLISIS QUE HAGAS QUE NO TENGA AL MENOS UNA FUENTE EN FORMA DE URL ES INÚTIL, NO SIRVE, HAY QUE REHACER TODO. 
       - "veredict": "VERDADERO", "FALSO" o "POLÉMICO".  

    ### REGLAS PRINCIPALES:
    1. Incluye siempre fuentes confiables. Si alguna conclusión carece de al menos una fuente, debes rehacer el análisis del texto entero. 
       - TODA conclusión debe tener fuentes al final con la etiqueta "Fuentes:". SIN FUENTES, EL ANÁLISIS NO ES VÁLIDO.  
       - Ejemplo de fuentes para una conclusión: "Fuentes: https://doi.org/10.1177/0267323118760317, https://news.un.org/es/story/2018/05/1432702"
       - Usa el siguiente sistema de puntaje para seleccionar las mejores fuentes:  
         - Dominio: (.gov/.gob: 30 pts; .edu: 20 pts; .org: 10 pts; .com/.net: 5 pts; otros: 0 pts).  
         - Protocolo: HTTPS: 10 pts; HTTP: 0 pts.  
         - Autoridad: Instituciones reconocidas: 40 pts; fuentes conocidas: 20 pts; poco conocidas: 10 pts.  
         - Actualidad: <2 años: 20 pts; 2-5 años: 10 pts; >5 años: 0 pts.  
       Pero no te olvides de agregar tus fuentes. Nunca las olvides. Es muy importante citar las fuentes. Ah, ¿y ya mencioné que las fuentes son importantes?
       Sin fuentes, lo que sea que digas no sirve. Así que asegúrate de que nunca falten fuentes para respaldar tus conclusiones.

    2. Solo analiza afirmaciones contrastables. 
       Ignora opiniones, hipérboles o afirmaciones no verificables. Si no puedes verificar una afirmación, clasifícala como "POLÉMICO".  

    3. No modifiques el contenido de las citas.  
       Cita las afirmaciones completas y sin recortes. No uses elipsis ni ajustes.  

    4. EN SERIO, AGREGA LAS MALDITAS CITAS, SINO LO QUE HAGAS NO TIENE VALOR!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    El texto a analizar es el siguiente: {text} '''
        }
        ]
    )
    data = json.loads(response.choices[0].message.content.strip())
    json_compacto = json.dumps(data, separators=(',', ':'), ensure_ascii=False)
    return json_compacto


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_analyses(request):
    try:
        analyses = Analysis.objects.all().order_by('-created_at')[:6]
        serialized_analyses = [{"analysis": analysis.result} for analysis in analyses]

        return Response(serialized_analyses, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

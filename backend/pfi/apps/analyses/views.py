import json
from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from openai import OpenAI
from pfi.apps.analyses.converters import AudioToTextConverter, VideoToAudioConverter, YouTubeUrlToVideoConverter
from pfi.apps.analyses.models import Analysis
from pfi.apps.analyses.serializers import AudioAnalysisSerializer, TextAnalysisSerializer, VideoAnalysisSerializer, UrlAnalysisSerializer
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
import os
from pfi.apps.subscriptions.models import Subscription



client = OpenAI(
    api_key=os.environ.get("OPENAI_API_KEY")
)

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

        user = self.request.user
        has_active_subscription = Subscription.is_user_currently_subscribed(user)

        video_file = serializer.validated_data['video_file']
        try:
            audio_file = VideoToAudioConverter.convert(video_file)
            transcription = AudioToTextConverter.convert(audio_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            analysis = sendPrompt(transcription, has_active_subscription)
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

        user = self.request.user
        has_active_subscription = Subscription.is_user_currently_subscribed(user)

        audio_file = serializer.validated_data['audio_file']
        try:
            transcription = AudioToTextConverter.convert(audio_file)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        try:
            analysis = sendPrompt(transcription, has_active_subscription)
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

    user = request.user
    has_active_subscription = Subscription.is_user_currently_subscribed(user)

    try:
        analysis = sendPrompt(text_analysis_serializer.data['text'], has_active_subscription)
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

    user = request.user
    has_active_subscription = Subscription.is_user_currently_subscribed(user)

    try:
        video_file = YouTubeUrlToVideoConverter.convert(request.data.get('text'))
        audio_file = VideoToAudioConverter.convert(video_file)
        transcription = AudioToTextConverter.convert(audio_file)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    try:
        analysis = sendPrompt(transcription, has_active_subscription)
        newAnalysis = Analysis.objects.create(is_premium_request=False, requester=user, result=analysis)
        newAnalysis.save()
    except Exception as e:
        raise e

    return Response({"analysis": analysis}, status=status.HTTP_201_CREATED)


def sendPrompt(text: str, has_active_suscription):
    text = get_limited_string(text, has_active_suscription)
    response = client.chat.completions.create(
        model="gpt-4o",
        response_format={"type": "json_object"},
        messages=[{
            "role": "user",
            "content": f'''
    Analiza el texto proporcionado según las siguientes reglas. Tu respuesta debe ser un JSON válido con dos campos:  
    1. "title": Título que resuma el tema general del texto.  
    2. "analysis": Un array de objetos, donde cada objeto tenga estos tres campos (las fuentes no son un campo separado):  
       - "affirmation": Cita textual del texto, sin modificaciones tuyas.  
       - "analysis": Análisis de la afirmación que explique su veracidad, ESPECIFICANDO DENTRO DE ESTE MISMO TEXTO LAS FUENTES DE 
       INFORMACIÓN PARA PODER VISITARLAS Y COMPARAR RESULTADOS (agregar estas fuentes al final, preferiblemente no en el medio). 
       - "veredict": Un string "VERDADERO", "FALSO" o "POLÉMICO", dependiendo de cómo hayas visto la veracidad de la afirmación.  

    ### REGLAS PRINCIPALES:
    1. Incluye siempre fuentes confiables. Si alguna conclusión carece de al menos una fuente, debes rehacer el análisis del texto entero. 
       - TODA conclusión en el campo "analysis.affirmation" debe tener fuentes al final con la etiqueta "Fuentes:". 
       SIN FUENTES, EL ANÁLISIS NO ES VÁLIDO. La única excepción es si no existe fuente alguna para analizar que 
       la afirmación sea verdadera.  
       - Ejemplo de fuentes para el campo "analysis.analysis": 
       "Fuentes: https://doi.org/10.1177/0267323118760317, https://news.un.org/es/story/2018/05/1432702"
       - Usa el siguiente sistema de puntaje para seleccionar las mejores fuentes:  
         - Dominio: (.gov/.gob: 30 pts; .edu: 20 pts; .org: 10 pts; .com/.net: 5 pts; otros: 0 pts).  
         - Protocolo: HTTPS: 10 pts; HTTP: 0 pts.  
         - Autoridad: Instituciones reconocidas: 40 pts; fuentes conocidas: 20 pts; poco conocidas: 10 pts.  
         - Actualidad: <2 años: 20 pts; 2-5 años: 10 pts; >5 años: 0 pts.  
       - Se reitera que se debe revisar los análisis una vez generados. Si al final de cada análisis no está el texto 
       "Fuentes: " seguido de al menos una fuente en formato URL cuyo contenido haya sido usado para 
       llevar a cabo tu análisis, entonces el mismo es un fracaso y 
       debe ser rehecho hasta que sí aparezcan las fuentes. Estas fuentes deben ser visitables para comparar tu respuesta. Y 
       no deben ser un campo separado dentro del objeto de cada análisis, sino que DEBE SER PARTE DEL TEXTO DEL CAMPO "analysis". 
       No olvides las fuentes. No olvides las fuentes. NO OLVIDES LAS FUENTES.

    2. Solo analiza afirmaciones contrastables. 
       Ignora opiniones, hipérboles o afirmaciones no verificables. Si no puedes verificar una afirmación, clasifícala como "POLÉMICO".  

    3. No modifiques el contenido de las citas.  
       Cita las afirmaciones completas y sin recortes. No uses elipsis ni ajustes.

    4. NO USES comillas dobles. Si es necesario, debes escaparlas, porque tu respuesta será procesada con json.loads() en Python 
    y pueden causar errores.    

    5. No olvidar agregar las fuentes al final del texto que contiene tu análisis de cada afirmación leída. Es muy importante.
    Este análisis que armaste se usará para ser mostrado en una página web que mostrará, para cada argumento, 
    cita del texto -> tu análisis (que debe incluir las fuentes) -> veredicto.
    No olvides las fuentes. No olvides las fuentes. No olvides las fuentes. No olvides las fuentes. No olvides las fuentes. 

    6. ¿Chequeaste que estén las fuentes? En serio, las fuentes deben estar. Debe estar incluido en el análisis de cada 
    argumento el listado de fuentes que usaste.  

    7. Chequeá de nuevo que estén las fuentes dentro del texto de tu análisis. Deben ser URLs. Esto no debe afectar al 
    campo que contiene el valor del veredicto (VERDADERO, FALSO, POLÉMICO).  

    El texto a analizar es el siguiente: {text} '''
        }
        ]
    )
    received_text = response.choices[0].message.content.strip().strip('```json').strip('```')
    try:
        data = json.loads(received_text)
    except Exception as e:
        print(e)
        raise e
    for analysis in data['analysis']:
        if analysis.get("Fuentes", analysis.get("fuentes", "")):
            analysis['analysis'] = analysis['analysis'] + analysis.get("Fuentes", analysis.get("fuentes", ""))
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


def get_limited_string(content: str, has_active_subscription: bool) -> str:
    limit = 5000 if has_active_subscription else 2000
    words = content.split()
    limited_words = words[:limit]
    return ' '.join(limited_words)

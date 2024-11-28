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


client = OpenAI(api_key="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")

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
            "content": f'Analiza el texto proporcionado al final de este mensaje para determinar si las afirmaciones son verdaderas, falsas, '
                       f'o, en su defecto, polémicas. Tu respuesta debe tener un máximo de 2000 caracteres. '
                       f'El formato debe ser un JSON object directamente parseable con JSON.loads() en Python (sin espacios ni newlines) con dos campos. '
                       f'El primero debe ser "title", con un título que explique de qué trata el texto entero. El segundo debe ser "analysis", que '
                       f'debe ser un array (nunca un object suelto, siempre array de objetos) '
                       f'donde cada elemento contenga los campos "affirmation" (para citar lo dicho en el texto), '
                       f'"analysis" (para explicar el análisis hecho de la afirmación), '
                       f'y "veredict" (para el veredicto, que debe decir exclusivamente una de las siguientes 3 opciones: "VERDADERO", "FALSO" O "POLÉMICO"). '
                       f'Prioriza y elige los argumentos más importantes, y asegúrate de proporcionar fuentes confiables de manera explícita '
                       f'(prioriza .edu y .org sobre otras) '
                       f'para cada verificación, porque, sin una fuente de calidad puntual para contrastar la información, el análisis no sirve. '
                       f'Argumentar que la fuente es un "análisis propio" no sirve. Siempre debe haber una fuente para información contrastable, sin excepciones. '
                       f'Si una afirmación no puede ser verificada con la información disponible, clasifícala como "POLÉMICO" '
                       f'o ignórala si no es contrastable con alguna fuente reputable, pero no la marques como falsa. '
                       f'No analices opiniones, hipérbolas, comentarios '
                       f'que no afirmen algo contrastable, o juicios subjetivos; busca argumentos con información contrastable. '
                       f'Cuando marques una afirmación como verdadera o falsa, explica el por qué proporcionando los datos correctos con su respectiva fuente. '
                       f'No expliques que estás haciendo un análisis, sólo llévalo a cabo. Y no recortes el texto de la '
                       f'afirmación que estés analizando sino que debes dejarlo completo (oración o párrafo entero), '
                       f'pues una persona debe poder entender el contexto. '
                       f'El texto a analizar es: {text}'
        }]
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


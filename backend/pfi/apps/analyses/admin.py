import json

from django.contrib import admin

from pfi.apps.analyses.models import Analysis


class AnalysisAdmin(admin.ModelAdmin):
    list_display = ['get_title', 'requester', 'created_at', 'is_premium_request']
    ordering = ['-created_at']

    def get_title(self, obj):
        try:
            result_json = json.loads(obj.result)
            return result_json.get('title', 'Sin título')
        except (ValueError, TypeError):
            return 'Formato inválido'

    # Nombre de la columna que aparecerá en la interfaz de administración
    get_title.short_description = 'Título del análisis'

admin.site.register(Analysis, AnalysisAdmin)

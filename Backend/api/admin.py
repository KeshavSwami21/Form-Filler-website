from django.contrib import admin

from .models import Template,FilledTemplate

@admin.register(Template)
class TemplateAdmin(admin.ModelAdmin):
    list_display = ('template_id', 'template_name', 'field')
    search_fields = ('template_name', 'template_desc', 'field','template_id')
    list_filter = ('field',)
    ordering = ('-template_id',)


@admin.register(FilledTemplate)
class FilledTemplateAdmin(admin.ModelAdmin):
    list_display = ('id', 'phno')
    search_fields = ('id', 'phno')
    list_filter = ('phno',)

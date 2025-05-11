from django.db import models
from api.helpers import create_template_id,create_filled_temp_id
import os

# Create your models here.
class Template(models.Model):
    template_id = models.CharField(max_length = 60,default =create_template_id, primary_key=True)
    template_name = models.CharField(max_length = 250)
    template_desc = models.TextField(default="",blank=True)
    template = models.FileField(upload_to="Empty_template/")
    field = models.CharField(
        max_length = 50, 
        choices = [
            ("Research Student","Research Student"),
            ("Undergraduate Students","Undergraduate Students"),
            ("College Of Technology Students","College Of Technology Students"),
            ("Specialized Training College","Specialized Training College"),
            ("Japanese Studies Students","Japanese Studies Students"),
            ("Young Leaders Program Students","Young Leaders Program Students"),
            ("Research Student","Research Student"),
        ]
    )

    def __str__(self) -> str:
        return self.template_id
    
class FilledTemplate(models.Model):
    id = models.CharField(max_length = 60, default = create_filled_temp_id, primary_key = True)
    template = models.FileField(upload_to="Filled_template/",null=True, blank=True)
    phno = models.CharField(max_length = 20, null=True, blank = True)
    photo = models.ImageField(upload_to="Images/",blank=True,null=True)

    def __str__(self) -> str:
        return self.id 

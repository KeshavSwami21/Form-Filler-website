from django.db.models.signals import post_delete
from django.dispatch import receiver
import os
from .models import FilledTemplate

@receiver(post_delete, sender=FilledTemplate)
def delete(sender, instance, **kwargs):
    # Delete template file from storage
    print(1)
    if instance.template:
        print(instance.template.path)
        os.remove(instance.template.path)

    # Delete photo file from storage
    if instance.photo:
        print(instance.photo.path)
        os.remove(instance.photo.path)
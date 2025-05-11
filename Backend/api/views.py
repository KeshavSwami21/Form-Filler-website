from django.shortcuts import render
from rest_framework.views import APIView
from api.models import Template, FilledTemplate
from api.helpers import fill_template_file,insert_image_url_in_html
from rest_framework.response import Response
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from django.core.files import File
import os
import json

class FetchTemplates(APIView):
    def get(self,request):
        template_id = request.GET.get("template_id",None)
        try:
            if template_id:
                obj = Template.objects.get(template_id=template_id)
                path = obj.template.path
                basename = path.split("/")[-1]
                print(f"basename : {basename}")
                
                return Response(
                    {
                        "data":{
                            "template_id":obj.template_id,
                            "template_name":obj.template_name,
                        }
                    },status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {
                        "error":"template_id is required"
                    },status=status.HTTP_400_BAD_REQUEST
                )
        except ObjectDoesNotExist:
            return Response(
                {
                    "error":"Invalid template id"
                },status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    "error":f"{e}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class GetAllFields(APIView):
    def get(self,request):
        try:
            print("hit")
            temps = Template.objects.all()
            data = [
                {
                    "template_id":i.template_id,
                    "field":i.field,
                    "template_desc":i.template_desc
                } for i in temps
            ]
            print(f"data : {data}")
            return Response(
                {
                    "data":data
                },status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {
                    "error":"Invalid template id"
                },status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    "error":f"{e}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
class PreviewAPI(APIView):
    def post(self,request):
        '''
        input format form data
        '''
        try:
            template_id = request.POST.get("template_id")
            template_input = json.loads(request.POST.get("template_input"))
            phno = request.POST.get("phone",None)
            image = request.FILES.get("image",None)
            image_id = request.POST.get("image_id",None)


            template_obj = Template.objects.get(template_id=template_id)
            print(template_input)
            # print(image_id)

            op = fill_template_file(html_file=template_obj.template,input_fields=template_input)
            print(1)
            
            obj = FilledTemplate.objects.create(
                phno = phno,
            )
            # obj = FilledTemplate.objects.create(
            #     phno = phno,
            #     photo=image,
            # )
            # op = insert_image_url_in_html(op,obj.photo,image_id,request)
            with open(op, 'rb') as f:
                django_file = File(f)
                obj.template = django_file
                obj.save()
            os.remove(op)
            return Response(
                {
                    "data":{
                        "file_url":request.build_absolute_uri(obj.template.url),
                        "template_id":obj.id
                    }
                },status=status.HTTP_200_OK
            )
            
        except ObjectDoesNotExist:
            return Response(
                {
                    "error":"Invalid template id"
                },status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            print(e)
            return Response(
                {
                    "error":f"{e}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DeleteFilledTemplate(APIView):
    def delete(self,request,pk):
        try:
            obj = FilledTemplate.objects.get(id=pk)
            obj.delete()
            return Response(
                {
                    "message":"success"
                },status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {
                    "error":"Invalid template id"
                },status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {
                    "error":f"{e}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

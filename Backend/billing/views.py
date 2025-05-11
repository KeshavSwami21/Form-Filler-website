from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status
from django.core.exceptions import ObjectDoesNotExist
from billing.models import PromoCode,TransactionHistory
import os
from rest_framework.response import Response
import razorpay
import json
with open("local.json", "r", encoding="utf-8") as f:
    data = json.load(f)
    os.environ["RAZORPAY_KEY_ID"] = data["RAZORPAY_KEY_ID"]
    os.environ["RAZORPAY_KEY_SECRET"] = data["RAZORPAY_KEY_SECRET"]


client = razorpay.Client(auth=(os.getenv("RAZORPAY_KEY_ID"), os.getenv("RAZORPAY_KEY_SECRET")))

# Create your views here.

class RazorPayCheckoutAPI(APIView):
    def post(self,request):
        print(os.getenv("RAZORPAY_KEY_ID"))
        data = request.data
        phone = data.get("phone")
        promo_code = data.get("promocode",None)
        try:
            if promo_code:
                try:
                    pc = PromoCode.objects.get(promocode=promo_code)
                    pc.used_by += 1
                    amount = pc.amount
                    pc.save()

                except ObjectDoesNotExist:
                    amount = 30
            else:
                amount = 30

            payment_order = client.order.create(
                {
                    "amount":amount*100, #convert it to paisa 
                    "currency":"INR", 
                    "payment_capture":1,
                    "notes": {
                        "phone": phone,
                    },
                }
            )
            response_data = {
                "order_id": payment_order["id"],
                "amount": amount*100,
                "currency": "INR",
                "key_id": os.getenv("RAZORPAY_KEY_ID")
            }
            return Response(
                response_data,status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {
                    "error":f"{e}"
                },status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
class RazorpayWebhookAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            data = request.data
            event = data.get("event")

            if event == "payment.captured":
                payment_info = data["payload"]["payment"]["entity"]
                payment_id = payment_info.get("id")
                order_id = payment_info.get("order_id")
                amount = payment_info.get("amount")

                notes = payment_info["notes"]
                phone = notes["phone"]

                TransactionHistory.objects.create(
                    transaction_id = payment_id,
                    amount = amount//100,
                    phone_number = phone,
                    status ="success"
                )

                return Response({"status": "payment captured"}, status=status.HTTP_200_OK)

            elif event == "payment.failed":
                payment_info = data["payload"]["payment"]["entity"]
                payment_id = payment_info.get("id")
                order_id = payment_info.get("order_id")
                amount = payment_info.get("amount")

                notes = payment_info["notes"]
                phone = notes["phone"]

                TransactionHistory.objects.create(
                    transaction_id = payment_id,
                    amount = amount//100,
                    phone_number = phone,
                    status ="failed"
                )
                return Response({"status": "payment failed"}, status=status.HTTP_200_OK)

            else:
                return Response({"status": "event ignored"}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

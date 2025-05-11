from django.db import models
from billing.helpers import generate_promo_code

# Create your models here.
class TransactionHistory(models.Model):
    transaction_id = models.CharField(max_length=100)
    amount = models.IntegerField()
    phone_number = models.CharField(max_length=20)
    status = models.CharField(
        max_length = 10,
        choices = [
            ("failed","Failed"),
            ("success","Success")
        ]
    )
    def __str__(self) -> str:
        return self.transaction_id
    
class PromoCode(models.Model):
    promocode = models.CharField(max_length=10,default=generate_promo_code,primary_key=True)
    amount = models.IntegerField()
    used_by = models.BigIntegerField(default=0)
    created_for = models.CharField(null=True,blank=True,max_length=100)

    def __str__(self) -> str:
        return self.promocode
from django.contrib import admin
from billing.models import TransactionHistory,PromoCode
# Register your models here.

@admin.register(TransactionHistory)
class TransactionHistoryAdmin(admin.ModelAdmin):
    list_display = ('transaction_id', 'amount', 'phone_number', 'status')
    search_fields = ('transaction_id', 'phone_number')
    list_filter = ('status',)
    ordering = ('-transaction_id',)

@admin.register(PromoCode)
class PromoCodeAdmin(admin.ModelAdmin):
    list_display = ('promocode', 'amount','used_by','created_for')
    search_fields = ('promocode',)
    ordering = ('-used_by',)
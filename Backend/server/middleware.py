from django.http import HttpResponse

class AllowIframeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        response['X-Frame-Options'] = 'ALLOWALL'  # Allow embedding from any origin
        response['Content-Security-Policy'] = "frame-ancestors 'self' http://127.0.0.1:5500;"  # Allow from specific port
        return response

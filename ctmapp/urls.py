from django.contrib import admin
from django.urls import path
from text.views import UserDataCreate, sms_response, thanks

app_name = "text"

urlpatterns = [
    path('', UserDataCreate.as_view()),
    path('admin/', admin.site.urls),
    path('sms', sms_response, name='sms'),
    path('thanks', thanks, name='thanks'),
]
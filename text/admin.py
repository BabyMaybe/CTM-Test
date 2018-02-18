from django.contrib import admin

from .models import UserData

class UserDataAdmin(admin.ModelAdmin):
  list_display = ['name', 'phone', 'message', 'response']

admin.site.register(UserData, UserDataAdmin)

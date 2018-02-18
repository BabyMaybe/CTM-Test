from django import forms
from django.forms import ModelForm

from text.models import UserData


class UserDataForm(ModelForm):
  class Meta:
    model = UserData
    fields = ['name', 'phone', 'message']
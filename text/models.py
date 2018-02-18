from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import urllib
import json

# Three Step validation process
#1) checks that number is 11 digits
#2) checks that all 11 digits are numbers
#3) checks that number is a valid US phone number
def validate_phone(value):
  if not len(value) == 11:
    raise ValidationError(
      _('%(value)s is not a 11 digits'),
      params={'value': value})

  for char in value:
    if not char.isdigit():
      raise ValidationError(
      _('%(value)s contains non number elements'),
      params={'value': value})

  url = 'http://apilayer.net/api/validate?access_key=0e69a23f8a5cc1c8060b86f848276b8f&number=' + value
  response = urllib.request.urlopen(url)
  j = json.loads(response.read().decode('utf8'))

  if not j.get('valid'):
    raise ValidationError(
      _('%(value)s is not a valid US phone number'),
      params={'value': value})

# Data model for User Data
# holds name, phone number, initial message, and user response
class UserData(models.Model):
     name = models.CharField(max_length=200)
     phone = models.CharField(max_length=11, validators=[validate_phone])
     message = models.CharField(max_length=153)
     response = models.CharField(max_length=153, blank=True)



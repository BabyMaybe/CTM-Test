#Django built ins
from django.views.generic.edit import CreateView
from django.shortcuts import render_to_response
from django.http import HttpResponse

from django.views.decorators.csrf import csrf_exempt

#Third Party
from twilio.twiml.messaging_response import MessagingResponse
from twilio.rest import Client

#Local
from text.models import UserData
from text.forms import UserDataForm


#View to handle creation of new data
class UserDataCreate(CreateView):
  model = UserData
  template_name = 'index.html'
  form_name = UserDataForm

  fields = ['name', 'phone', 'message']

  success_url = "thanks"

  def form_valid(self, form):

    account_sid = "AC00841016b857ddcea4b86fc7345d24bc"
    auth_token = "b21e9bd81954b8d13807e2a315c0693d"
    userNumber = "+" + form.cleaned_data['phone']
    userName = form.cleaned_data['name']

    client = Client(account_sid, auth_token)

    client.api.account.messages.create(
    to = userNumber,
    from_ = "+18334035447",
    body = "Hi " + userName + "! Thanks for signing up. Send me a reply and I'll store it in my database!")

    return super(UserDataCreate, self).form_valid(form)

#View to handle incoming sms calls
@csrf_exempt
def sms_response(request):
  p = request.POST

  #Retrieve first instance of UserData from database where
  #stored phone number matches sender's number
  ud = UserData.objects.filter(phone=p.get('From')[1:])[0]
  ud.response = p.get('Body')
  ud.save()

  resp = MessagingResponse()

  msg = resp.message('Thanks for your response, it has been stored!')

  return HttpResponse(str(resp))

#Confirmation page after successful UserData entry creation
#Sends user a welcome message
def thanks(request):
  return render_to_response('thanks.html')

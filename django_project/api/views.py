from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import PostSerializer
from .models import Gpt_call
import openai



@api_view(['GET'])
def gpt_calling(request):

    queryset = Gpt_call.objects.all()
    serializer = PostSerializer(queryset, many=True)
    return Response(serializer.data) # returns a JSON response 

    #ここから
    
    # print('POSTING')

    # user_input = request.POST.get('user_input')
    # print("USER INPUT: ", user_input)

    # response = openai.ChatCompletion.create(
    #     model="gpt-3.5-turbo",
    #     #stream=True,
    #     messages=[
    #         {"role": "system", "content": "You are a helpful assistant."},
    #         {"role": "user", "content": f"{user_input}"}
    #     ]
    # )

    # print("RESPONSE:", response)
    # chat_reply = response['choices'][0]['message']['content']

    # return JsonResponse({'response': response, 'chat_reply': chat_reply})
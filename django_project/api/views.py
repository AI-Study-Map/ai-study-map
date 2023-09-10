from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import PostSerializer
from django.middleware.csrf import get_token
import openai
import requests



@api_view(['POST'])
@renderer_classes([JSONRenderer])
def gpt_calling(request):
    
    # csrf_token = get_token(request)
    # print("CSRF_TOKEN: ", csrf_token)

    print('POSTING')
    
    user_input = request.data['user_input']
    print("USER INPUT: ", user_input)

    response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #stream=True,
            messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": f"{user_input}"}
        ]
    )

    print("RESPONSE:", response)
    chat_reply = response['choices'][0]['message']['content']

    # queryset = {'body': response}
    # print("QUERYSET: ", queryset)
    # serializer = PostSerializer(queryset, many=True)
    serializer = PostSerializer(data={"body": response})
    if serializer.is_valid():
        print("SERIALIZER IS VALID")
        serializer.save()
    else:
        print("SERIALIZE ERROR") # 35行でresponseを渡すとここでエラーになる (動きはする)
        print(serializer.errors)

    print("SERIALIZER: ", serializer.data)
    return Response(serializer.data) # returns a JSON response

def test(request):
    print("test")
    return render(request, 'api/test.html')
from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import PostSerializer, QuestionSerializer
from django.middleware.csrf import get_token
import openai
from django_project.settings_local import *
import random

openai.api_key = OPENAI_API_KEY
openai.api_base = OPENAI_API_BASE

@api_view(['POST'])
@renderer_classes([JSONRenderer])
def gpt_calling(request):
    
    # csrf_token = get_token(request)
    # print("CSRF_TOKEN: ", csrf_token)

    print('POSTING')

    system_word = """あなたは、与えられた単語を日本語でわかりやすく丁寧に説明する優秀なbotです。
    以下のフォーマットをJSON形式で返してください。
    '{
        "description",
        "example"
    }'
    """
    
    user_input = request.data['user_input']
    print("USER INPUT: ", user_input)

    response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            #stream=True,
            temperature = 0,
            messages=[
            {"role": "system", "content": f"{system_word}"},
            {"role": "user", "content": f"{user_input}"}
        ]
    )

    print("RESPONSE:", response)
    chat_reply = response['choices'][0]['message']['content']
    serializer = PostSerializer(data={"body": chat_reply})

    if serializer.is_valid():
        print("SERIALIZER IS VALID")
        serializer.save()
    else:
        print("SERIALIZE ERROR") # 35行でresponseを渡すとここでエラーになる (動きはする)
        print(serializer.errors)

    print("SERIALIZER: ", serializer.data)
    return Response(serializer.data) # returns a JSON response

@api_view(['POST'])
@renderer_classes([JSONRenderer])
def question(request):

    true_answer = ""
    n = random.randint(0, 3)
    match n:
        case 0:
            true_answer = "A"
        case 1:
            true_answer = "B"
        case 2:
            true_answer = "C"
        case 3:
            true_answer = "D"
    print("TRUE ANSWER: ", true_answer, n)

    system_word = """あなたは与えられた単語に対する4択問題を作り、JSON形式で返す優秀なbotです。
    回答はなるべく短い単語とし、文脈に沿って、単純な日本語問題にならないようにしてください。
    正解が""" + true_answer + """になるようにしてください。
    なお、ダブルクォーテーションとシングルクォーテーションの使い分けは以下の通りとしてください。
    '{
        "question",
        "choices"
        {
            "a":"aの回答",
            "b":"bの回答",
            "c":"cの回答",
            "d":"dの回答"
        }
        "answer"
    }'
    """
    
    question = request.data
    print("QUESTION: ", question)
    response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            temperature = 0,
            #stream=True,
            messages=[
            {"role": "system", "content": f"{system_word}"},
            {"role": "user", "content": f"{question}"}
        ]
    )
    chat_reply = response['choices'][0]['message']['content']
    serializer = QuestionSerializer(data={"body": chat_reply})

    if serializer.is_valid():
        print("SERIALIZER IS VALID")
        serializer.save()
    else:
        print("SERIALIZE ERROR") # 100行でresponseを渡すとここでエラーになる (動きはする)
        print(serializer.errors)

    print("SERIALIZER: ", serializer.data)
    return Response(serializer.data)


def test(request):
    print("test")
    return render(request, 'api/test.html')
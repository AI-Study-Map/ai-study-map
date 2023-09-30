from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import PostSerializer, QuestionSerializer
from django.middleware.csrf import get_token
import openai
import guidance
from django_project.settings_local import *
import random


openai.api_key = OPENAI_API_KEY
openai.api_base = OPENAI_API_BASE

@api_view(['POST'])
@renderer_classes([JSONRenderer])
def gpt_calling_old(request):
    
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
def question_old(request):

    true_answer = ["A", "B", "C", "D"]
    n = random.randint(0, 3)
    print("TRUE ANSWER: ", true_answer[n], n)

    system_word = """あなたは与えられた単語に対する4択問題を作り、JSON形式で返す優秀なbotです。
    """
    # descriptionを入れてないため、説明文の文脈に沿った問題を作ることができない
    question = request.data 
    print("QUESTION: ", question)
    question = """pythonにおける""" + question['title'] + """に関する問題を作ってください。
    回答はなるべく短い単語とし、文脈に沿って、単純な日本語問題にならないようにしてください。
    正解が""" + true_answer[n] + """になるようにしてください。
    なお、ダブルクォーテーションとシングルクォーテーションの使い分けは以下の通りとしてください。
    '{
        "question",
        "choices"
        {
            "a":"aの選択肢",
            "b":"bの選択肢",
            "c":"cの選択肢",
            "d":"dの選択肢"
        }
        "answer"
    }'
    """
   
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

@api_view(['POST'])
@renderer_classes([JSONRenderer])
def gpt_calling(request):
    question_title = request.data['user_input']
    guidance.llm= guidance.llms.OpenAI("gpt-3.5-turbo") 
    create_prompt = guidance("""
        {{#system~}}
            あなたは、学ぶ人にとっての教科書として、わかりやすく丁寧な解説を日本語で提供する優秀なbotです。
            以下のJSON形式で返してください。
            '{
                "description",
                "example"
            }'
        {{~/system}}
        {{#user~}}
            pythonにおける{{question_title}}に関する解説文を作ってください。
            このテーマにおける解説をdescriptionとして、それに対応する例をexampleとしてください。
            解説はなるべく詳細かつ網羅的である必要がありますが、300文字程度に収めてください。
            例は簡潔に、分かりやすさを重視してください。
            なお、descriptionとexampleの両方でマークダウン記法をフル活用し、分かりやすく表現してください。
            Be sure to output up to } to ensure that the output is not interrupted in the middle of the JSON format.
        {{~/user}}
        {{#assistant~}}
            {{gen 'response' temperature=0.5 }}
        {{/assistant~}}         
    """)
    out = create_prompt(question_title=question_title)
    print("out", out)
    #JSON形式で返されなかった時の対策
    if out["response"][-1] != "}":
        result = out["response"] + "\"}\n"
    else:
        result = out["response"] + "\n"

    return Response(result)

@api_view(['POST'])
@renderer_classes([JSONRenderer])
def question(request):
    true_answer = ["a", "b", "c", "d"]
    n = random.randint(0, 3)
    print("TRUE ANSWER: ", true_answer[n], n)
    question_title = request.data['title']
    description = request.data['description']
    example = request.data['example']
    guidance.llm= guidance.llms.OpenAI("gpt-4")
    create_prompt = guidance("""
        {{#system~}}
            あなたは教科書の中の章のまとめとして4択問題を作り、JSON形式で返す優秀なbotです。
        {{~/system}}
        {{#user~}}
            pythonにおける{{question_title}}に関する問題を日本語で作ってください。
            このトピックに使用した解説文と例は以下の通りです。
            解説文: {{description}}
            例: {{example}}        
            正解が{{true_answer}}になるようにしてください。
            トピックの難易度に合わせて問題の難易度を調整してください。
            可能な限り選択肢は1単語で出力してください。
            回答がただ一つに限られるようにしてください。
            Example of a problem that is not good:
            1. the choice is exactly the same as the topic
            2. the choice is not related to the topic
            3. the choice is related to the topic but the correct answer is obvious
            4. the choice could be interpreted as having more than one correct answer
            5. choices that use the same words that appear in the explanatory text or examples
            6. choices that are too long.
                             
            JSON形式で返してください。フォーマットは以下の通りです。
            フォーマットは以下の通りです。
            {
                "question",
                "choices": {
                    "a",
                    "b",
                    "c",
                    "d"
                },
                "answer"
            }
        {{/user~}}
        {{#assistant~}}
            {{gen 'question' temperature=0 max_tokens=500}}
        {{/assistant~}}                         
    """)
    out = create_prompt(question_title=question_title, true_answer=true_answer, description=description, example=example)
    result = out["question"] + "\n"
    print(result)
    return Response(result)

#送られたdescriptionが不十分だった場合に、descriptionに後付けで追加する
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def add_description(request):
    title = request.data['title']
    description = request.data['description']
    guidance.llm= guidance.llms.OpenAI("gpt-3.5-turbo")
    create_prompt = guidance("""
        {{#system~}}
            あなたは、学ぶ人にとっての教科書として、わかりやすく丁寧な解説を日本語で提供する優秀なbotです。
        {{~/system}}
        {{#user~}}
            あなたは説明を追加することを求められました
            与えられた情報をもとに、descriptionに自然につながるように説明文を追加してください。
            その際、もとの文章を返答を繰り返す必要はなく、続きのみを出力してください。
            また、与えられた文章と内容が被らないようにしてください。
            その際、マークダウン記法を用いて分かりやすく表現してください。
            テーマ: {{title}}
            description: {{description}}
            以下のJSON形式で返してください。
            '{
                "add_description"
            }'
        {{/user~}}
        {{#assistant~}}
            {{gen 'add_description' temperature=0 max_tokens=500}}
        {{/assistant~}}                         
    """)
    out = create_prompt(title=title, description=description)
    print("OUT\n", out)
    result = out["add_description"]
    print(result)
    return Response(result)
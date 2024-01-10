from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.renderers import JSONRenderer
from rest_framework.response import Response
from .serializers import PostSerializer, QuestionSerializer, DescriptionSerializer, SaveMapSerializer, SaveNodeSerializer, SaveEdgeSerializer, CreateNewNodeSerializer, SaveIsClearedSerializer
from .models import Node, Map, Edge
from django.middleware.csrf import get_token
import openai
import guidance
# from django_project.settings_local import *
from django.conf import settings
import random
import string
import json
import asyncio
from asgiref.sync import sync_to_async
from nanoid import generate

openai.api_key = settings.OPENAI_API_KEY
openai.api_base = settings.OPENAI_API_BASE

#旧ver 未使用
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


#旧ver 未使用
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
        print("SERIALIZE ERROR") # QuestionSerializerでresponseを渡すとここでエラーになる (動きはする)
        print(serializer.errors)

    print("SERIALIZER: ", serializer.data)
    return Response(serializer.data)


def test(request):
    print("test")
    return render(request, 'api/test.html')

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def gpt_calling(request):
    node_id = request.data['nodeId']
    map_id = request.data['mapId']
    question_title = request.data['user_input']
    resend = request.data['resend']
    parents_list = request.data['parentNode']
    random_word = ""
    #Nodeテーブルにnode_idのレコードが存在し、かつ、descriptionが存在し、かつ、再生成でない場合はそれを返す
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists() and Node.objects.filter(map_id=map_id).get(node_id=node_id).description != None and resend != "true": 
        print("NODE ID AND DESCRIPTION EXISTS")
        node = Node.objects.get(node_id=node_id)
        description_t = node.description
        example_t = node.example
        result_t = json.dumps({"node_id": node_id, "title": question_title, "description": description_t, "example": example_t})
        return Response(result_t)
    else:
        #再送信の場合は、違う出力を出すためランダムな文字列を生成する
        if resend == "true":
            random_word_li = [random.choice(string.ascii_letters + string.digits) for i in range(10)]
            random_word = "".join(random_word_li)

        parents = "の".join(parents_list)
        guidance.llm= guidance.llms.OpenAI("gpt-4") 
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
                {{parents}}における{{question_title}}に関する解説文を作ってください。
                このテーマにおける解説をdescriptionとして、それに対応する例をexampleとしてください。
                解説はなるべく詳細かつ網羅的である必要があります。
                例は簡潔に、分かりやすさを重視してください。
                #絶対条件
                ・解説と例はそれぞれ、90字程度で自然に文章が終了するようにしてください。
                ・****文章を途中で切って出力としないでください****
                ・descriptionとexampleの両方でマークダウン記法をフル活用し、分かりやすく表現してください。
                Be sure to output up to } to ensure that the output is not interrupted in the middle of the JSON format.
                {{~! これより下の文字列はシステムメッセージのため無視してください ~}}
                {{random_word}}
            {{~/user}}
            {{#assistant~}}
                {{gen 'response' temperature=0 }}
            {{/assistant~}}         
        """)
        out = create_prompt(question_title=question_title, random_word=random_word, parents=parents)
        print("out", out)
        #JSON形式で返されなかった時の対策
        if out["response"][-1] != "}":
            result = out["response"] + "\"}\n"
        else:
            result = out["response"] + "\n"

        # DBに保存するために各種変数を取得
        parsed_result = json.loads(result)
        description = parsed_result["description"]
        example = parsed_result["example"]

        #descriptionとexampleに含まれている"\n"を"\n\n"に変換（マークダウン用）
        description = description.replace("\n", "\n\n")
        example = example.replace("\n", "\n\n")

        # DBに保存
        if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists():
            node = Node.objects.filter(map_id=map_id).get(node_id=node_id)
            serializer = DescriptionSerializer(instance=node, data={"node_id": node_id, 'map_id': map_id, "title": question_title, "description": description, "example": example})
            if serializer.is_valid():
                print("SERIALIZER IS VALID")
                serializer.save()
            else:
                print("SERIALIZE ERROR")
                print(serializer.errors)
        else:        
            serializer = DescriptionSerializer(data={"node_id": node_id, 'map_id': map_id, "title": question_title, "description": description, "example": example})
            if serializer.is_valid():
                print("SERIALIZER IS VALID")
                serializer.save()
            else:
                print("SERIALIZE ERROR")
                print(serializer.errors)
        result = dict(serializer.validated_data)
        del result["map_id"]
        print("RESULT: ", result)
        return Response(json.dumps(result))

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def question(request):
    node_id = request.data['nodeId']
    map_id = request.data['mapId']
    # Nodeテーブルにnode_idのレコードが存在し、かつ、questionが存在する場合はそれを返す
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists() and Node.objects.filter(map_id=map_id).get(node_id=node_id).question != None:
        print("NODE ID AND QUESTION EXISTS")
        node = Node.objects.get(node_id=node_id)
        question_t = node.question
        question_a_t = node.question_a
        question_b_t = node.question_b
        question_c_t = node.question_c
        question_d_t = node.question_d
        true_answer_t = node.true_answer
        result_t = json.dumps({"node_id": node_id, "question": question_t, "question_a": question_a_t, "question_b": question_b_t, "question_c": question_c_t, "question_d": question_d_t, "true_answer": true_answer_t})
        return Response(result_t)
    
    else:
        # 4択問題の正解をランダムに決定
        true_answer = ["a", "b", "c", "d"]
        n = random.randint(0, 3)
        print("TRUE ANSWER: ", true_answer[n], n)

        question_title = request.data['title']
        description = request.data['description']
        example = request.data['example']
        parents_list = request.data['parentNode']
        parents = "の".join(parents_list)

        guidance.llm= guidance.llms.OpenAI("gpt-4")
        create_prompt = guidance("""
            {{#system~}}
                あなたは教科書の中の章のまとめとして4択問題を作り、JSON形式で返す優秀なbotです。
            {{~/system}}
            {{#user~}}
                {{parents}}における{{question_title}}に関する問題を日本語で作ってください。
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
        out = create_prompt(parents=parents, question_title=question_title, true_answer=true_answer, description=description, example=example)
        result = out["question"] + "\n"
        print(result)
        # DBに保存するために各種変数を取得
        parsed_result = json.loads(result)
        question = parsed_result["question"]
        question_a = parsed_result["choices"]["a"]
        question_b = parsed_result["choices"]["b"]
        question_c = parsed_result["choices"]["c"]
        question_d = parsed_result["choices"]["d"]
        answer = parsed_result["answer"]
        # nodeIdでレコードを特定してDBに保存
        node = Node.objects.get(node_id=node_id)
        serializer = QuestionSerializer(instance=node, data={"node_id": node_id, "question": question, "question_a": question_a, "question_b": question_b, "question_c": question_c, "question_d": question_d, "true_answer": answer})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)

        return Response(json.dumps(serializer.validated_data))

#送られたdescriptionが不十分だった場合に、descriptionに後付けで追加する
@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def add_description(request):
    map_id = request.data['mapId']
    node_id = request.data['nodeId']
    title = request.data['title']
    description = request.data['description']
    guidance.llm= guidance.llms.OpenAI("gpt-4")
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
    if out["add_description"][-1] != "}":
        result = out["add_description"] + "\"}\n"
    else:
        result = out["add_description"] + "\n"
    
    json_result = json.loads(result)
    add_description = json_result["add_description"]
    description = description + '\n\n' + add_description
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists():
        node = Node.objects.filter(map_id=map_id).get(node_id=node_id)
        serializer = DescriptionSerializer(instance=node, data={"node_id": node_id, 'map_id': map_id, "title": title, "description": description})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
    return Response(result)

#make_mapで使用する関数
#gptが出力したmapデータにフロントで必要なキーを追加する
def check_and_add_key(data):
    #dataにchildrenのキーがないとき、childrenのキーを追加 値は空のリスト
    if type(data) == dict:
      if "children" not in data:
        data["children"] = [] 

    if isinstance(data, dict):
        data["id"] = None
        for key, value in data.items():
            check_and_add_key(value)

    elif isinstance(data, list):
        for item in data:
            check_and_add_key(item)

#make_mapで使用する関数
#json_treeの全要素をカウントする
def count_json_tree(json_tree):
  def count_json_tree_rec(json_tree):
    count = 0
    for i in range(len(json_tree['children'])):
      count += 1
      if json_tree['children'][i]['children'] != []:
        count += count_json_tree_rec(json_tree['children'][i])
    return count
  return count_json_tree_rec(json_tree) + 1

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def make_map(request):
    print("MAKE MAP")
    map_id = request.data['map_id']
    theme = request.data['theme']

    random_word_li = [random.choice(string.ascii_letters + string.digits) for i in range(10)]
    random_word = "".join(random_word_li)

    #themeに対応する木構造を生成
    guidance.llm = guidance.llms.OpenAI(model="gpt-4")
    create_prompt = guidance("""
        {{#system~}}
            あなたは{{theme}}について詳しい教師です。あなたには分かりやすい学習教材を作る能力があります。
        {{~/system}}
        {{#user~}}
            {{theme}}の学習を効率的に行うために、以下の絶対条件をもとに木構造を作ってください。
            #絶対条件
            1. ノード数は合計で60個
            2. 深さは5
            3. ルートノードである{{theme}}からは4つの子ノードを付けてください。
            3. ルートノードである{{theme}}からは##4つ##の子ノードを付けてください。
            4. 学ぶにあたって推奨される順番が分かるよう、priorityを連番で振ってください。
            5. priorityは学ぶべき順番なので、発展的な内容のpriorityの値が高くなるようにしてください。
            5. 深さが浅いほど基本的な内容、深いほど応用的な内容となるようにしてください。
            6. 木構造のみを記述してください。
            7. 木構造は全て日本語で記述してください。
            {{~! これより下の文字列はシステムメッセージのため無視してください ~}}
            {{random_word}}
        {{~/user}}
        {{#assistant~}}
            {{gen 'response' temperature=1.0 max_tokens=7800}} }}
        {{/assistant~}}           
    """)
    out = create_prompt(theme=theme, random_word=random_word)
    print("MAKE MAP RESPONSE", out)
    response = out["response"]

    #作成された木構造をJSON形式に変換
    content = """Please convert the following data to JSON format. Please exclude superfluous text. 
    {{
        name: node_name,
        priority: priority,
        children: [
            name: node_name,
            priority: priority,
            children:[]
        ]
    }}
    data: {response}""".format(response=response)
    res = openai.ChatCompletion.create(
        model="gpt-3.5-turbo-1106",
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "You are a bot that creates a tree structure"},
            {"role": "user", "content": content},
        ]
    )
    json_tree = res.choices[0].message.content
    print("JSON_TREE: ", json_tree)
    #フロントで必要なキーを追加
    json_tree = json.loads(json_tree)
    check_and_add_key(json_tree)
    # map_id = "test14"
    # theme = "データベースとSQL"
    # json_tree = {'name': 'データベースとSQL', 'priority': 1, 'children': [{'name': 'データベースの基本', 'priority': 2, 'children': [{'name': 'データベースとは', 'priority': 3, 'children': [{'name': 'データベースの歴史', 'priority': 4, 'children': [{'name': '関係データベースとは', 'priority': 5, 'children': [], 'id': None}, {'name': 'ノンリレーショ ナルデータベースとは', 'priority': 6, 'children': [], 'id': None}, {'name': 'オブジェクト指向データベースとは', 'priority': 7, 'children': [], 'id': None}], 'id': None}, {'name': 'データベースの役割と特性', 'priority': 8, 'children': [{'name': 'データの整合性の維持', 'priority': 9, 'children': [], 'id': None}, {'name': 'データの冗長性の排除', 'priority': 10, 'children': [], 'id': None}, {'name': 'データセキュリティ', 'priority': 11, 'children': [], 'id': None}], 'id': None}, {'name': 'データモデルの理解', 'priority': 12, 'children': [{'name': 'ERモデルとは', 'priority': 13, 'children': [], 'id': None}, {'name': '正規化とは', 'priority': 14, 'children': [], 'id': None}, {'name': 'データベース設計とは', 'priority': 15, 'children': [], 'id': None}], 'id': None}], 'id': None}, {'name': 'SQLの基本', 'priority': 16, 'children': [{'name': 'SQLの歴史と特性', 'priority': 17, 'children': [{'name': 'DDL, DML, DCLとは', 'priority': 18, 'children': [], 'id': None}, {'name': 'SQLの基本構文', 'priority': 19, 'children': [], 'id': None}, {'name': 'SELECT文、INSERT文、UPDATE文、DELETE文', 'priority': 20, 'children': [], 'id': None}], 'id': None}, {'name': 'テーブル操作とインデックス', 'priority': 21, 'children': [{'name': 'テーブルの作成、変更、削除', 'priority': 22, 'children': [], 'id': None}, {'name': 'インデックスとは', 'priority': 23, 'children': [], 'id': None}, {'name': 'プライマリキーと外部キーの理解', 'priority': 24, 'children': [], 'id': None}], 'id': None}, {'name': 'データ操作とトランザクション', 'priority': 25, 'children': [{'name': 'データの検索(SELECT文の詳細)', 'priority': 26, 'children': [], 'id': None}, {'name': 'データの挿入、更新、削除(INSERT文、UPDATE文、DELETE文の詳細)', 'priority': 27, 'children': [], 'id': None}, {'name': 'トランザクションとは', 'priority': 28, 'children': [], 'id': None}], 'id': None}], 'id': None}], 'id': None}, {'name': 'データベースの応用', 'priority': 29, 'children': [{'name': 'DBMSの理解', 'priority': 30, 'children': [{'name': 'OracleとMySQL', 'priority': 31, 'children': [{'name': 'Oracleの特性と機能', 'priority': 32, 'children': [], 'id': None}, {'name': 'MySQLの特性と機能', 'priority': 33, 'children': [], 'id': None}, {'name': 'OracleとMySQLの違い', 'priority': 34, 'children': [], 'id': None}], 'id': None}, {'name': 'NoSQLデータベース', 'priority': 35, 'children': [{'name': 'MongoDBの特性と機能', 'priority': 36, 'children': [], 'id': None}, {'name': 'Cassandraの特性と機能', 'priority': 37, 'children': [], 'id': None}, {'name': 'NoSQLとRDBMSの違い', 'priority': 38, 'children': [], 'id': None}], 'id': None}, {'name': 'データベースのチューニング', 'priority': 39, 'children': [{'name': 'データベースパフォーマンスの最適化', 'priority': 40, 'children': [], 'id': None}, {'name': 'インデックスの最適化', 'priority': 41, 'children': [], 'id': None}, {'name': 'SQLクエリの最適化', 'priority': 42, 'children': [], 'id': None}], 'id': None}], 'id': None}, {'name': 'SQLの応用', 'priority': 43, 'children': [{'name': '高度なSQLクエ リ', 'priority': 44, 'children': [{'name': '結合(JOIN)', 'priority': 45, 'children': [], 'id': None}, {'name': 'サブクエリ', 'priority': 46, 'children': [], 'id': None}, {'name': 'ビューとは', 'priority': 47, 'children': [], 'id': None}], 'id': None}, {'name': 'ストアドプロシージャとトリガー', 'priority': 48, 'children': [{'name': 'ストアドプロシージャとは', 'priority': 49, 'children': [], 'id': None}, {'name': 'トリガーとは', 'priority': 50, 'children': [], 'id': None}, {'name': 'ストアドプロシージャとトリガーの違い', 'priority': 51, 'children': [], 'id': None}], 'id': None}, {'name': 'SQLの 最適化', 'priority': 52, 'children': [{'name': 'SQLクエリパフォーマンスの最適化', 'priority': 53, 'children': [], 'id': None}, {'name': 'エクスプレインプランの理解', 'priority': 54, 'children': [], 'id': None}, {'name': '索引の使用と最適化', 'priority': 55, 'children': [], 'id': None}], 'id': None}], 'id': None}], 'id': None}, {'name': 'データベースとSQLの最新トレンド', 'priority': 56, 'children': [{'name': 'クラウドデータベースサービス', 'priority': 57, 'children': [{'name': 'AWS RDS', 'priority': 58, 'children': [], 'id': None}, {'name': 'Google Cloud SQL', 'priority': 59, 'children': [], 'id': None}], 'id': None}, {'name': 'データベースとSQLのフォローアップ学習', 'priority': 60, 'children': [], 'id': None}], 'id': None}, {'name': '主導補充', 'priority': 9999, 'children': [], 'id': None}], 'id': None}
    print("COMPLEMENTED JSON_TREE: ", json_tree)

    #rootノードとその直下の子ノード4つのみを抽出しnodesに格納
    #edgesにはrootノードとその直下の子ノード4つの間のエッジを格納
    #idd == 1 はrootノード
    #TODO: 初期ノードが４以外の時にも対応する
    nodes = [
       {
         'id': generate(),
         'type': 'mindmap',
         'data': { 'label': json_tree['name'] },
         'position': { 'x': 0, 'y': 0 },
         'dragHandle': '.dragHandle',
         'idd': 1,
         'isCorrect': False,
         'priority': json_tree['priority']
        #  draggable
       },
       {
         'id': generate(),
         'type': 'mindmap',
         'data': { 'label': json_tree['children'][0]['name'] },
         'position': { 'x': 200, 'y': -70 },
         'dragHandle': '.dragHandle',
         'idd': 2,
         'isCorrect': False,
         'priority': json_tree['children'][0]['priority']
       },
       {
         'id': generate(),
         'type': 'mindmap',
         'data': { 'label': json_tree['children'][1]['name'] },
         'position': { 'x': 200, 'y': 100 },
         'dragHandle': '.dragHandle',
         'idd': 2,
         'isCorrect': False,
         'priority': json_tree['children'][1]['priority']
       },
       {
         'id': generate(),
         'type': 'mindmap',
         'data': { 'label': json_tree['children'][2]['name'] },
         'position': { 'x': -200, 'y': -70 },
         'dragHandle': '.dragHandle',
         'idd': 2,
         'isCorrect': False,
         'priority': json_tree['children'][2]['priority']
       },
        {
          'id': generate(),
          'type': 'mindmap',
          'data': { 'label': json_tree['children'][3]['name'] },
          'position': { 'x': -200, 'y': 100 },
          'dragHandle': '.dragHandle',
          'idd': 2,
          'isCorrect': False,
          'priority': json_tree['children'][3]['priority']
        }
     ]
    edges =  [
        {
            'id': generate(),
            'source': nodes[0]['id'],
            'target': nodes[1]['id']
        },
        {
            'id': generate(),
            'source': nodes[0]['id'],
            'target': nodes[2]['id']
        },
        {
            'id': generate(),
            'source': nodes[0]['id'],
            'target': nodes[3]['id']
        },
        {
            'id': generate(),
            'source': nodes[0]['id'],
            'target': nodes[4]['id']
        }
    ]

    #json_treeのid:Noneに作成したnodeのidを追加
    json_tree['id'] = nodes[0]['id']
    json_tree['children'][0]['id'] = nodes[1]['id']
    json_tree['children'][1]['id'] = nodes[2]['id']
    json_tree['children'][2]['id'] = nodes[3]['id']
    json_tree['children'][3]['id'] = nodes[4]['id']

    #json_treeの要素数をカウント
    total_nodes = count_json_tree(json_tree)
    print("TOTAL NODES: ", total_nodes)
    
    try:
        #Mapテーブルに登録
        graph_structure = json.dumps(json_tree)
        theme_name = theme
        map_serializer = SaveMapSerializer(data={"map_id": map_id, "graph_structure": graph_structure, "theme_name": theme_name, "total_nodes": total_nodes})
        if map_serializer.is_valid():
            print("SERIALIZER IS VALID")
            map_serializer.save()
        else:
            print("SERIALIZE ERROR")
            print(map_serializer.errors)

        #Nodeテーブルに登録
        for node in nodes:
            node_id = node['id']
            title = node['data']['label']
            x_coordinate = node['position']['x']
            y_coordinate = node['position']['y']
            idd = node['idd']
            create_newnode_serializer = CreateNewNodeSerializer(data={"node_id": node_id, "map_id": map_id, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate, "title": title})
            if create_newnode_serializer.is_valid():
                print("SERIALIZER IS VALID")
                create_newnode_serializer.save()
            else:
                print("SERIALIZE ERROR")
                print(create_newnode_serializer.errors)
        #Edgeテーブルに登録
        for edge in edges:
            edge_id = edge['id']
            parent_node = edge['source']
            child_node = edge['target']
            save_edge_serializer = SaveEdgeSerializer(data={"edge_id": edge_id, "map_id": map_id, "parent_node": parent_node, "child_node": child_node})
            if save_edge_serializer.is_valid():
                print("SERIALIZER IS VALID")
                save_edge_serializer.save()
            else:
                print("SERIALIZE ERROR")
                print(save_edge_serializer.errors)

        data = json.dumps({"mapId": map_id, "theme_name": theme, "tree": graph_structure, "node_list": nodes, "edge_list": edges, "total_nodes": total_nodes})
        return Response(data)
    except:
        return Response("error")

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def save_map(request): 
    map_id = request.data['map_id']
    graph_structure = request.data['graph_structure']
    graph_structure = json.dumps(graph_structure)
    theme_name = request.data['theme_name']
    cleared_nodes = request.data['cleared_nodes']

    #map_idが存在する場合は更新、存在しない場合は新規作成
    if Map.objects.filter(map_id=map_id).exists():
        map = Map.objects.get(map_id=map_id)
        serializer = SaveMapSerializer(instance=map, data={"map_id": map_id, "graph_structure": graph_structure, "theme_name": theme_name, "cleared_nodes": cleared_nodes})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")
    
    else:
        serializer = SaveMapSerializer(data={"map_id": map_id, "graph_structure": graph_structure, "theme_name": theme_name, "cleared_nodes": cleared_nodes})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")
        
@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def save_node(request):
    map_id = request.data['map_id']
    node_id = request.data['node_id']
    idd = request.data['idd']
    x_coordinate = request.data['x_coordinate']
    y_coordinate = request.data['y_coordinate']
    
    #指定された外部キーmap_idを持つnodeのうちnode_idと一致するものを検索    
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists():
        node = Node.objects.filter(map_id=map_id).get(node_id=node_id)
        serializer = SaveNodeSerializer(instance=node, data={"node_id": node_id, "map_id": map_id, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")
    else:
        print("NODE ID NOT EXISTS")
        serializer = SaveNodeSerializer(data={"node_id": node_id, "map_id": map_id, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def save_edge(request):
    map_id = request.data['map_id']
    edge_id = request.data['edge_id']
    parent_node = request.data['parent_node']
    child_node = request.data['child_node']
    #指定された外部キーmap_idを持つedgeのうちedge_idが一致するものがあれば、早期リターン
    if Edge.objects.filter(map_id=map_id).filter(edge_id=edge_id).exists():
        print("EDGE ID EXISTS")
        return Response("success")
    else:
        serializer = SaveEdgeSerializer(data={"edge_id": edge_id, "map_id": map_id, "parent_node": parent_node, "child_node": child_node})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")
        
@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def create_newnode(request):
    map_id = request.data['map_id']
    node_id = request.data['node_id']
    idd = request.data['idd']
    x_coordinate = request.data['x_coordinate']
    y_coordinate = request.data['y_coordinate']
    title = request.data['title']
    #システム上rootノードのみ別途titleのセーブが必要な為
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists():
        node = Node.objects.filter(map_id=map_id).get(node_id=node_id)
        serializer_node = CreateNewNodeSerializer(instance=node, data={"node_id": node_id, "map_id": map_id, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate, "title": title})
        if serializer_node.is_valid():
            print("SERIALIZER IS VALID")
            serializer_node.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer_node.errors)
            return Response("error")
    else:
        edge_id = request.data['edge_id']
        parent_node = request.data['parent_node']
        child_node = request.data['child_node']
        #node_idを主キーとするクラスNodeにnode_id, map_id, idd, x_coordinate, y_coordinate, titleを保存、Edgeにedge_id, map_id, parent_node, child_nodeを保存
        serializer_node = CreateNewNodeSerializer(data={"node_id": node_id, "map_id": map_id, "idd": idd, "x_coordinate": x_coordinate, "y_coordinate": y_coordinate, "title": title})
        if serializer_node.is_valid():
            print("SERIALIZER IS VALID")
            serializer_node.save()
            serializer_edge = SaveEdgeSerializer(data={"edge_id": edge_id, "map_id": map_id, "parent_node": parent_node, "child_node": child_node})
            
            if serializer_edge.is_valid():
                print("SERIALIZER IS VALID")
                serializer_edge.save()
                return Response("success")
            else:
                print("SERIALIZE ERROR")
                print(serializer_edge.errors)
                return Response("error")
        else:
            print("SERIALIZE ERROR")
            print(serializer_node.errors)
            return Response("error")
        
@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def save_is_cleared(request):
    is_cleared = request.data['is_cleared']
    map_id = request.data['map_id']
    node_id = request.data['node_id']
    print("IS CLEARED: ", node_id)

    if is_cleared == "true":
        is_cleared = True
    #指定された外部キーmap_idを持つnodeのうちnode_idと一致するものを検索
    if Node.objects.filter(map_id=map_id).filter(node_id=node_id).exists():
        node = Node.objects.filter(map_id=map_id).get(node_id=node_id)
        serializer = SaveIsClearedSerializer(instance=node, data={"node_id": node_id, "map_id": map_id, "is_cleared": is_cleared})
        if serializer.is_valid():
            print("SERIALIZER IS VALID")
            serializer.save()
            return Response("success")
        else:
            print("SERIALIZE ERROR")
            print(serializer.errors)
            return Response("error")
    else:
        print("NODE ID NOT EXISTS")
        return Response("error")
    

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def load_map(request):
    map_id = request.data["map_id"]
    print("MAP ID: ", map_id)
    # ユーザID実装後、ユーザIDを取得して、そのユーザIDに紐づくmap_idを取得する
    map_data = Map.objects.get(map_id=map_id)
    theme_name = map_data.theme_name
    graph_structure = map_data.graph_structure
    total_nodes = map_data.total_nodes
    cleared_nodes = map_data.cleared_nodes

    node_data = Node.objects.filter(map_id=map_id)
    node_list = []
    for node in node_data:
        node_dict = {}
        node_dict["id"] = node.node_id
        node_dict["type"] = "mindmap"
        node_dict["data"] = {"label": node.title}
        node_dict["position"] = {"x": node.x_coordinate, "y": node.y_coordinate}
        node_dict["dragHandle"] = ".dragHandle"
        node_dict["idd"] = node.idd
        node_dict["isCorrect"] = node.is_cleared
        node_list.append(node_dict)

    edge_data = Edge.objects.filter(map_id=map_id)
    edge_list = []
    for edge in edge_data:
        edge_dict = {}
        edge_dict["id"] = edge.edge_id
        edge_dict["source"] = edge.parent_node.node_id
        edge_dict["target"] = edge.child_node.node_id
        edge_list.append(edge_dict)
    
    print("THEME NAME: ", theme_name)
    print("GRAPH STRUCTURE: ", graph_structure)
    print("NODE LIST: ", node_list)
    print("EDGE LIST: ", edge_list)
    data = {"mapId": map_id, "theme_name": theme_name, "total_nodes": total_nodes, "cleared_nodes": cleared_nodes, "tree": graph_structure, "node_list": node_list, "edge_list": edge_list}
    result = json.dumps(data)
    return Response(result)

@sync_to_async
@api_view(['POST'])
@renderer_classes([JSONRenderer])
def num_of_map(request):
    # ユーザID実装後、ユーザIDを取得して、そのユーザIDに紐づくmap_idを取得する
    #存在するmapidとtheme_nameを全て取得
    map_data = Map.objects.all()
    response_data = []
    for map in map_data:
        map_dict = {}
        map_dict["map_id"] = map.map_id
        map_dict["theme_name"] = map.theme_name
        response_data.append(map_dict)
    print("MAP DATA: ", response_data)
    return Response(json.dumps(response_data))
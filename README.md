<img width="656" alt="スクリーンショット 2023-12-11 153430" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/071f295f-50d9-4c62-a475-0c61ade64917">

<br/>

# AI-Study-Map
<p style="display: inline">
  <img src="https://img.shields.io/badge/-Node.js-000000.svg?logo=node.js&style=for-the-badge">
  <img src="https://img.shields.io/badge/-javascript-000000.svg?logo=javascript&style=for-the-badge">
  <img src="https://img.shields.io/badge/-React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/-Django-092E20.svg?logo=django&style=for-the-badge">
  <img src="https://img.shields.io/badge/-Python-F2C63C.svg?logo=python&style=for-the-badge">
  <img src="https://img.shields.io/badge/-SQLite-003B57.svg?logo=sqlite&style=for-the-badge">
</p>

AI-Study-MapはChatGPTとマインドマップを活用して学習をすることができます。
<br/>```※画像は開発中のものです```

<br/>

## アプリ開発の背景
近年、大学生の授業外での学習活動、つまり予習や復習、課題の取り組み時間が減少しているという課題が大学教育において指摘されています。この問題を克服し、学生たちによる主体的な授業外学習を促進するために、今話題の生成型AIを利用して、自主的かつ体系的に学習する機会を提供することができないかと考えました。

<br/>

## アプリの概要
このアプリはだれでも手軽に素早く体系的に学習できるような大学生向けの学習支援Webアプリケーションです。
<br/>人間と同様の自然な対話が可能で高度なAI技術を用いたChatGPTと、思考内容を視覚化するマインドマップ機能を掛け合わせた新たな学びの形として学習効率の向上を目指します。

<br/>

## アプリケーションのイメージ
![プレゼンテーション1](https://github.com/AI-Study-Map/ai-study-map/assets/85663346/95799dee-ba2b-4129-a36f-7982f384d738)



<br/>

## 機能画面別一覧
| ホーム画面 |　テーマ入力画面 |
| ---- | ---- |
| <img width="960" alt="2023-12-06" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/89c9f98d-9489-4d46-ba71-9aa94a6df63a"> | <img width="960" alt="2024-01-20 (2)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/f38bde21-fef6-4c0a-82b1-b36d6e15578b"> |
| AI-Study-Mapを活用して学ぶためのスタート地点です。 | 学習を始めたいテーマを入力することでマインドマップが作成されます！ |

| テーマ選択画面 | マインドマップ画面 |
| ---- | ---- |
| <img width="960" alt="2024-01-20 (1)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/a3defbcb-8624-4761-85af-b597a74803ea"> | <img width="960" alt="2023-12-07 (2)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/1c338888-814d-4db9-8285-3dd6dc1e519a"> |
| 学習したいテーマを決めて入力することによってマインドマップが作成され、あなたのAI-Study-Map学習が始まります。 | マインドマップの作成が終わると実際のテーマを決めたマインドマップが画面上に反映され、テーマノードから学習を始めることができます。 |

<!--
| 問題画面 |  |
| ---- | ---- |
| <img width="960" alt="2023-12-07 (5)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/b6de2c88-5bf4-45c6-a659-80800c9f4786"> |  |
| ノードに関する4択問題を解き進めることで、現在のノードに関連するノードが追加されていきます。 |  |
-->

<br/>

## ChatGPTの使用先
<table>
<tr>
<td>ノードの木構造作成</td>
<td>入力されたテーマをもとにChatGPTがそれに関連する木構造を作成しマインドマップを表示します。</td>
<td><img width="721" alt="2024-01-17" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/713a2ee5-fc85-4bb3-b7e8-ca02aaf86f11"></td>
</tr>
<tr>
<td>説明文</td>
<td>選択したノードに関する文章をChatGPTが作成して表示しています。文章には説明文や例が書いてあります。</td>
<td><img width="308" alt="2024-01-17 (1)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/e3dcb4fc-7f85-460d-adc9-590c3db83003"></td>
</tr>
<tr>
<td>選択問題</td>
<td>ノードに関する4択問題をChatGPTが生成します。これによりそのノードについての理解をより深めることができます。</td>
<td><img width="200" alt="2023-12-09 (5)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/5b046e4b-4e82-4563-bc2f-2981e40e5fa3"></td>
</tr>
<tr>
<td>詳細説明（説明文追加）</td>
<td>先ほどの説明文だけで理解が不十分だった際に説明文をつけ足すことができます。</td>
<td><img width="388" alt="2024-01-20 (48)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/0dd2b6fb-e22d-4181-b2be-6dd8397a9e57"></td>
</tr>
</table>

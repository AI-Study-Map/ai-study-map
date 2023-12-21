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
![AI-Study-Map1](https://github.com/AI-Study-Map/ai-study-map/assets/85663346/0a93775d-7e24-4049-92a0-7ee058bc8ac5)

<br/>

## 機能画面別一覧
| ホーム画面 |　テーマ選択画面 |
| ---- | ---- |
| <img width="960" alt="2023-12-06" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/aae522f7-f471-4956-844a-c0dc09f142d9"> | <img width="960" alt="2023-12-06 (4)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/81cf7864-273a-4d36-894c-f1aff0d03427"> |
| AI-Study-Mapを活用して学ぶためのスタート地点です。 | 学習したいテーマを決めて入力することによってマインドマップが作成され、あなたのAI-Study-Map学習が始まります。 |

| マインドマップ画面 | 問題画面 |
| ---- | ---- |
| <img width="960" alt="2023-12-07 (2)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/1c338888-814d-4db9-8285-3dd6dc1e519a"> | <img width="960" alt="2023-12-07 (5)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/b6de2c88-5bf4-45c6-a659-80800c9f4786"> |
| マインドマップの作成が終わると実際のテーマを決めたマインドマップが画面上に反映され、テーマノードから学習を始めることができます。 | ノードに関する4択問題を解き進めることで、現在のノードに関連するノードが追加されていきます。 |

<br/>

## ChatGPTの使用先
<table>
<tr>
<td>ノードの木構造作成</td>
<td>入力されたテーマをもとにChatGPTがそれに関連する木構造を作成しマインドマップを表示します。</td>
<td><img width="620" alt="2023-12-09 (2)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/ecf74f13-1420-4380-99c0-f733fef0e1aa"></td>
</tr>
<tr>
<td>説明文</td>
<td>選択したノードに関する文章をChatGPTが作成して表示しています。文章には説明文や例が書いてあります。</td>
<td><img width="417" alt="2023-12-09 (4)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/01eff363-6d7b-4e2d-a473-6144af98e789"></td>
</tr>
<tr>
<td>選択問題</td>
<td>ノードに関する4択問題をChatGPTが生成します。これによりそのノードについての理解をより深めることができます。</td>
<td><img width="200" alt="2023-12-09 (5)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/5b046e4b-4e82-4563-bc2f-2981e40e5fa3"></td>
</tr>
<tr>
<td>詳細説明（説明文追加）</td>
<td>先ほどの説明文だけで理解が不十分だった際に説明文をつけ足すことができます。</td>
<td><img width="449" alt="2023-12-09 (6)" src="https://github.com/AI-Study-Map/ai-study-map/assets/85663346/3d8f9cd6-9368-40f7-8b63-2b041ca14686"></td>
</tr>
</table>

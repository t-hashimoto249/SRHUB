---
title: <レポートタイトル>
slug: <slug>                    # URL 用 ID。ファイル名（拡張子なし）と同じにする
race_slug: <レースの slug>        # 紐付くレースの slug。content/races/<race_slug>.md と一致させる
contributor: <寄稿者 ID>          # content/contributors/<id>.md と一致させる
date: 2026-04-30                # YYYY-MM-DD
purpose: completion             # completion（完走志向） | competitive（上位志向） | personal（マイペース志向）
hero_image: /images/reports/<slug>.jpg
summary: <一覧カードや OGP に表示される 1〜2 文の要約>

# 任意：外部リソースへのリンク（食料管理シート、装備リスト、写真アルバム等）
# 不要なら attachments の行ごと削除して OK
attachments:
  - title: 食料管理スプレッドシート
    url: https://docs.google.com/spreadsheets/d/xxxxx
    kind: spreadsheet           # spreadsheet / document / photos / video / other
    description: 1日ごとの摂取カロリーと重量の内訳
  - title: 装備一覧（重量込み）
    url: https://docs.google.com/spreadsheets/d/yyyyy
    kind: spreadsheet

# 任意：写真と動画のギャラリー（本文末尾にグリッド表示される）
# 画像は /images/reports/<slug>/ 以下、動画ファイルは /videos/reports/<slug>/ 以下に配置するのがおすすめ
# YouTube は動画 ID（URL の v= に続く文字列、例 dQw4w9WgXcQ）
gallery:
  - kind: image
    src: /images/reports/mds-2021-tk-hashimoto/day1-start.jpg
    caption: 1日目スタート時の様子
    alt: スタートラインに並ぶランナーたち
  - kind: image
    src: /images/reports/mds-2021-tk-hashimoto/dunes.jpg
    caption: メルズーガの砂丘
  - kind: youtube
    src: dQw4w9WgXcQ          # YouTube 動画 ID のみ（URL ではない）
    caption: 公式ハイライト映像
  - kind: video
    src: /videos/reports/mds-2021-tk-hashimoto/day4-night.mp4   # サイトに置いた動画ファイル（public/ 起点）
    poster: /images/reports/mds-2021-tk-hashimoto/day4-night.jpg # 任意：再生前のサムネイル
    mime: video/mp4                                              # 任意：MIME type
    caption: オーバーナイトステージの夜間走行
---

<!--
  使い方：
  1. このファイルを別名でコピーしてから編集してください
       cp content/reports/_template.md content/reports/<好きなファイル名>.md
     `_` で始まるファイルはサイトに表示されません（テンプレート扱い）。
  2. frontmatter の race_slug は content/races/ のファイル名（拡張子なし）と一致させる必要があります。
     例: サハラマラソン → race_slug: marathon-des-sables
  3. 各見出し（## 練習・準備 / ## 装備 / ## 食事・補給 / ## レースレポート / ## 振り返り）は、
     目的別タブで装備セクションだけを比較する等の機能のため、変更せずに使ってください。
-->

<レース全体への取り組みを 2〜3 段落で。何を目指して参加したか、結果はどうだったか、本文の見どころを示す導入。>

## 練習・準備

レース前のトレーニング計画、現地適応のための取り組み、出走時のフィットネス目標などを記載。

- 期間：例) 6ヶ月前から
- 週あたりの距離：
- 主な練習内容：
- 現地特有の準備（暑熱順化／高所順化／装備慣らし／砂走りなど）：

## 装備

実際に持って行った装備一式と、選択理由・使ってみた感想を記載。重量管理・必携装備への対応・自分なりの工夫などをまとめると後続の読者の参考になります。

- バックパック：
- シューズ：
- ウェア：
- ナイトラン装備：
- 救急・サバイバル：
- 必携装備への対応：
- 装備総重量：

## 食事・補給

1日あたりの摂取カロリー設計、行動食の選び方、レース前後の食事戦略、現地調達の有無などを記載。

- 1日の目標カロリー：
- 持参した食料：
- 行動食：
- リカバリー食：
- 失敗・後悔ポイント：

## レースレポート

各ステージの様子、印象的なシーン、トラブルとその対処を記載。長すぎず、ポイントを絞って書くと読み返しやすくなります。

### Day 1 — <距離 / 地形>

### Day 2 — <距離 / 地形>

### Day 3 — <距離 / 地形>

<以下、各ステージごとに>

## 振り返り

完走（または DNF）後の感想、これから挑戦する人へのアドバイス、次に挑戦したいレースなど。

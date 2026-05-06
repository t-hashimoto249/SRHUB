# Claude Design 向け デザインブリーフ

このファイルは、Claude Design に画面デザインを依頼する際に丸ごと渡すためのブリーフです。
プロジェクトの要件・技術前提・必要なアウトプット形式をまとめてあります。

---

# プロジェクト概要

ステージレース（複数日かけて 250km 等を走るマラソン大会）の紹介・参加レポート・動画を、日本人ウルトラマラソン／トレイルランナーに届ける Web サイトを作ります。

- ターゲット: ウルトラマラソン／トレイルラン経験者（マラソンより過酷なレースを走っている層）
- メインコンテンツ: 世界中のステージレース紹介、参加レポート、関連動画
- 言語: 日本語のみ
- 想定アクセス: 月数千 PV 程度
- SEO 重視
- MVP 公開：来週

---

# 技術前提（厳守）

- **Next.js 16 (App Router)**
- **React 19**
- **TypeScript（`.tsx` で出力）**
- **Tailwind CSS 4**（`@theme` ディレクティブでデザイントークンを定義可能）
- ファイル構成は `src/` ディレクトリ前提（`src/app/...`, `src/components/...` など）
- インポートエイリアス: `@/*` → `src/*`
- **追加 UI ライブラリは使わない**（shadcn/ui 等を使う場合は明示してください）
- **モバイルファースト** / レスポンシブ
- 日本語コンテンツ（フォント: Noto Sans JP など、Google Fonts 推奨）
- アクセシビリティは最低限（セマンティック HTML までで OK）

---

# 必要なページ（MVP）

| パス | 内容 |
| --- | --- |
| `/` | トップ。サイトのコンセプト紹介、ピックアップレース数枚、リード文 |
| `/races` | レース一覧。カード形式で 10 件のレースを表示。MVP では絞り込み UI は未実装 |
| `/races/[slug]` | レース詳細。ヒーロー画像、概要、スケジュール、装備、参加までの流れ、関連動画、参加レポート一覧（**目的別フィルタつき**：完走志向／上位志向／マイペース志向）、公式サイトへのリンク |
| `/about` | サイトの目的・運営者紹介 |

# 共通要素

- サイトヘッダー（ロゴ、ナビ：レース一覧 / About）
- サイトフッター（コピーライト、SNS リンク等）

---

# デザインの雰囲気

- 過酷さ・冒険感・世界各地の壮大さが伝わる、**写真主役**のデザイン
- ヒーロー画像を大きく使い、ランナーの没入感を演出
- 読みやすさ重視（長文記事が多いため、本文は十分な行間と読みやすい字サイズ）
- ノイズの少ない、ややシリアスで落ち着いたトーン
- カラーパレットは砂漠・山岳・極地などの自然色からインスパイア（提案 OK）
- 地形（砂漠／山岳／極地／ジャングル）を視覚的に区別できるアイコンや色のヒントがあると、レース一覧でランナーが直感的に選べて望ましい

---

# 参加レポートの目的別分類（重要な体験設計）

各レースには参加ランナーのレポートが紐付きます。レポートは「ランナーの目的」によって 3 種類に分類されます。

| key | 表示ラベル | 想定読者 |
| --- | --- | --- |
| `completion` | 完走志向 | 制限時間内に走り切ることを目標とするランナー |
| `competitive` | 上位志向 | タイム・順位を狙う経験豊富なランナー |
| `personal` | マイペース志向 | 写真・観光・自分なりのテーマを持って楽しむランナー |

**レース詳細ページでは、目的別にレポートをフィルタ／切り替えできる UI を用意してください。** 同じレースでも目的が違えば装備・食事・練習方法が大きく異なるため、読者が自分の目的に合うレポートを見つけやすくする必要があります。

UI イメージ：
- レース詳細ページの中盤に「参加レポート」セクション
- セクション冒頭に **タブまたはトグルボタン**：`完走志向 (3)` `上位志向 (1)` `マイペース志向 (2)`
- 選択した目的に該当するレポートのカード一覧を表示
- 各レポートカードに目的バッジ（小さなラベル）を付ける
- 全件表示モードもあると便利（任意）

---

# レポート本文の構成（テンプレート）

レポート本文（`contentHtml`）は以下の見出し構成で書かれることを前提に CSS をスタイリングしてください。

1. 導入文（無見出し、1〜3 段落）
2. `## 練習・準備`
3. `## 装備`
4. `## 食事・補給`
5. `## レースレポート`（各ステージは `### Day 1` のような h3 で）
6. `## 振り返り`

本文は長文になるため：
- `h2` は強めにスタイリング
- 段落間のスペースを十分に
- 目次（Table of Contents）コンポーネントもあると親切（任意）

---

# 必要なアウトプット

1. **`.tsx` コンポーネントファイル一式**（コンポーネント単位で分割）

   **ページ**
   - `HomePage`
   - `RaceListPage`
   - `RaceDetailPage`
   - `AboutPage`

   **共通レイアウト**
   - `SiteHeader`
   - `SiteFooter`
   - `RootLayout`（フォント、`@theme` 適用）

   **レース関連の部品**
   - `RaceCard`（一覧用カード）
   - `RaceHero`（詳細ページのヒーローセクション）
   - `RaceMeta`（距離・国・難易度・地形等のメタ情報チップ）
   - `ScheduleTable`（ステージ別スケジュール）
   - `GearList`（持ち物リスト）
   - `EntryFlow`（参加までの流れ。Markdown を `dangerouslySetInnerHTML` で受け取る想定でも、構造化された `string[]` でも、どちらかでお任せ）
   - `VideoGrid`（YouTube 動画埋め込み複数）
   - `OfficialSiteLink`（公式サイトへの誘導 CTA）

   **レポート関連の部品**
   - `ReportPurposeTabs`（完走／上位／マイペース 切り替え UI）
   - `ReportCard`（タイトル、寄稿者、日付、目的バッジ、サマリー）
   - `ReportPurposeBadge`（カード内に貼る小ラベル）

2. **`globals.css` に追加する `@theme` 定義**（カラー、フォント、スペーシング、角丸、影など）

3. **`Race` / `Report` / `Contributor` 型を props で受け取る構造**（ダミーデータの埋め込みは避ける）

4. **静的画像はプレースホルダ URL（unsplash 等）で OK**。後で本物の画像と差し替える前提

5. **欠損フィールドへの配慮**：`entry_fee`、`participants_approx`、`gear`、`schedule`、`videos` などは `?` で optional。表示時は値があれば表示、なければセクションごと省略してください

---

# props で受ける型

`src/types/content.ts` に定義済み。コンポーネントはこれらを props として受け取れる構造にしてください。

```ts
export type Continent =
  | "アジア"
  | "ヨーロッパ"
  | "アフリカ"
  | "北アメリカ"
  | "南アメリカ"
  | "オセアニア"
  | "南極";

export type Terrain = "砂漠" | "山岳" | "極地" | "ジャングル" | "その他";
export type SupportType = "self" | "full";
export type Currency = "JPY" | "USD" | "EUR" | "GBP" | "AUD" | "其他";
export type ContactMethod = "email" | "x" | "instagram" | "youtube" | "facebook" | "website";

export interface Contact {
  method: ContactMethod;
  value: string; // メールアドレス または SNS の URL
}

export type ReportPurpose = "completion" | "competitive" | "personal";
// 表示ラベル：completion → 完走志向 / competitive → 上位志向 / personal → マイペース志向

export interface EntryFee {
  amount: number;
  currency: Currency;
}

export interface ScheduleEntry {
  day: number;
  description: string;
}

export interface RaceVideo {
  id: string;     // YouTube ID
  title: string;
}

export interface RaceFrontmatter {
  title: string;
  title_en?: string;
  slug: string;
  country: string;
  continent: Continent;
  distance_km: number;
  stages: number;
  duration_days: number;
  start_month: number;        // 1-12
  terrain: Terrain[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  support: SupportType;
  organizer: string;
  participants_approx?: number;
  entry_fee?: EntryFee;
  official_url: string;
  hero_image?: string;
  summary: string;
  gear?: string[];
  schedule?: ScheduleEntry[];
  entry_flow?: string;        // Markdown
  videos?: RaceVideo[];
}

export interface Race extends RaceFrontmatter {
  contentHtml: string;        // Markdown 本文を HTML 化したもの
}

export interface ReportFrontmatter {
  title: string;
  slug: string;
  race_slug: string;
  contributor: string;
  date: string;               // YYYY-MM-DD
  purpose: ReportPurpose;     // 目的別分類（必須）
  hero_image?: string;
  summary: string;
}

export interface Report extends ReportFrontmatter {
  contentHtml: string;
}

export interface ContributorFrontmatter {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  contacts: Contact[];        // 複数指定可。順番に表示
}

export interface Contributor extends ContributorFrontmatter {
  contentHtml: string;
}
```

---

# 現在用意されているコンテンツ（プレビュー用に使ってください）

`content/races/` 以下に以下 10 件のレース原稿が用意されています。レース一覧ページの実物データとして使えます。

| slug | 国 | 距離 | ステージ | 月 | 難易度 | サポート | 地形 |
| --- | --- | ---: | ---: | ---: | ---: | --- | --- |
| marathon-des-sables | モロッコ | 250km | 6 | 4 | 5 | self | 砂漠 |
| the-coastal-challenge | コスタリカ | 240km | 6 | 2 | 4 | full | ジャングル / 山岳 |
| ultra-race-romania | ルーマニア | 250km | 6 | 8 | 5 | self | 山岳 |
| everest-trail-race | ネパール | 170km | 6 | 11 | 5 | full | 山岳（高地） |
| trans-sahara-marathon | モロッコ | 138km | 4 | 3 | 3 | full | 砂漠 |
| ultra-africa-race | モザンビーク | 220km | 5 | 11 | 4 | self | 海岸 / その他 |
| ultra-bolivia-race | ボリビア | 220km | 7 | 9 | 5 | self | 砂漠（高地）/ 山岳 |
| mongolia-trail-run | モンゴル | 170km | 6 | 8 | 3 | full | 山岳 / その他 |
| the-track-australia | オーストラリア | 520km | 9 | 5 | 5 | self | 砂漠 |
| grand-to-grand-ultra | アメリカ合衆国 | 275km | 6 | 9 | 5 | self | 砂漠 |

レポートはまだ用意されていないため、デザインモックでは仮のレポートデータ（次セクション）を使ってください。

---

# サンプルデータ

## サンプル Race（marathon-des-sables）

```ts
const sampleRace: Race = {
  title: "サハラマラソン",
  title_en: "Marathon des Sables",
  slug: "marathon-des-sables",
  country: "モロッコ",
  continent: "アフリカ",
  distance_km: 250,
  stages: 6,
  duration_days: 7,
  start_month: 4,
  terrain: ["砂漠"],
  difficulty: 5,
  support: "self",
  organizer: "Marathon des Sables",
  official_url: "https://www.marathondessables.com/en",
  hero_image: "/images/races/marathon-des-sables.jpg",
  summary:
    "モロッコ・サハラ砂漠を6ステージ約250kmで走破する、世界で最も有名なセルフサポート式ステージレース。",
  gear: [
    "必携：シュラフ、ヘッドランプ、コンパス",
    "推奨：ゲイター、サングラス",
  ],
  schedule: [
    { day: 1, description: "33km、丘陵地帯" },
    { day: 2, description: "38km、砂丘エリア" },
    { day: 3, description: "31km、岩場" },
    { day: 4, description: "82km、ロングステージ" },
    { day: 5, description: "42km、フルマラソンステージ" },
    { day: 6, description: "16km、表彰ゴール" },
  ],
  videos: [
    { id: "dQw4w9WgXcQ", title: "2024 年大会ハイライト" },
    { id: "abc123XYZ", title: "公式プロモーション映像" },
  ],
  contentHtml: "<p>レース本文の HTML がここに入ります。</p>",
};
```

## サンプル Report 群（同一レースに 3 つの目的）

```ts
const sampleReports: Report[] = [
  {
    title: "初挑戦で完走を目指したサハラマラソン2024",
    slug: "mds-2024-completion-tanaka",
    race_slug: "marathon-des-sables",
    contributor: "tanaka",
    date: "2024-04-20",
    purpose: "completion",
    hero_image: "/images/reports/mds-2024-tanaka.jpg",
    summary:
      "ウルトラ未経験から1年半の準備で挑んだサハラマラソン。完走するための装備選びと食事戦略をまとめました。",
    contentHtml: "<p>...</p>",
  },
  {
    title: "サハラマラソン2024 トップ50入り戦略",
    slug: "mds-2024-competitive-sato",
    race_slug: "marathon-des-sables",
    contributor: "sato",
    date: "2024-04-22",
    purpose: "competitive",
    hero_image: "/images/reports/mds-2024-sato.jpg",
    summary:
      "上位を狙うランナー向け：最軽量装備・高強度練習・現地での攻めの補給計画。",
    contentHtml: "<p>...</p>",
  },
  {
    title: "写真と一緒に砂漠を旅したサハラマラソン",
    slug: "mds-2024-personal-yamada",
    race_slug: "marathon-des-sables",
    contributor: "yamada",
    date: "2024-04-25",
    purpose: "personal",
    hero_image: "/images/reports/mds-2024-yamada.jpg",
    summary:
      "完走順位より体験重視。カメラ片手に砂漠の風景を楽しんだ7日間の記録。",
    contentHtml: "<p>...</p>",
  },
];
```

## サンプル Contributor

```ts
const sampleContributor: Contributor = {
  id: "tanaka",
  name: "田中 太郎",
  bio: "アマチュアランナー。フルマラソン3:30、トレラン100km完走経験あり。",
  avatar: "/images/contributors/tanaka.jpg",
  contacts: [
    { method: "email", value: "tanaka@example.com" },
    { method: "instagram", value: "https://instagram.com/tanaka_runs" },
    { method: "youtube", value: "https://youtube.com/@tanaka-runs" },
  ],
  contentHtml: "",
};
```

---

# 進め方の希望

- まずは **トップ + レース一覧 + レース詳細 + About** の 4 ページぶんのデザインを上記の型に沿って `.tsx` で出してください
- 共通レイアウト（ヘッダー / フッター）は別コンポーネントに分けてください
- スタイルはすべて Tailwind CSS 4 のユーティリティクラスで完結させてください
- ハードコードされた色は避け、`@theme` の CSS 変数経由で参照してください
- レース詳細ページは特に重要なので、**目的別レポートタブ UI** を含めてしっかり作ってください
- 出力時は各ファイルの配置先（`src/app/...` か `src/components/...` か）を明示してください

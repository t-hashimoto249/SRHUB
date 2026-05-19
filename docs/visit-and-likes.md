# 訪問カウンター & いいね 機能

静的書き出し（`output: 'export'`）の Next.js サイトに、Cloudflare Pages Functions + KV
でサイト訪問数カウンターとレポートのいいね機能を追加した。

## 構成

```
web/
├── functions/                ← Pages Functions（Workers ランタイム）
│   ├── _shared.ts            共通ユーティリティ（IP ハッシュ・カウンタ操作）
│   ├── tsconfig.json         workers-types を読み込む独立 tsconfig
│   └── api/
│       ├── visits.ts         GET /api/visits, POST /api/visits
│       └── likes/[slug].ts   GET /api/likes/<slug>, POST /api/likes/<slug>
└── src/components/
    ├── VisitorCounter.tsx    フッターに埋め込むクライアントコンポーネント
    └── LikeButton.tsx        レポート詳細ページに埋め込むボタン
```

## KV キー設計

| キー | 用途 | TTL |
|---|---|---|
| `visits:total` | サイト総アクセス数 | なし |
| `visit-ip:<sha256(IP)>` | 同一 IP の 1 時間以内の重複カウント抑止 | 3600s |
| `likes:<slug>` | レポート毎のいいね合計 | なし |
| `like-ip:<sha256(IP)>:<slug>:<YYYY-MM-DD>` | 同一 IP × 同一レポート × 同一日付の重複抑止 | 86400s |

IP は SHA-256 でハッシュ化してから保存（生 IP は KV に置かない）。

## Cloudflare Pages 側のセットアップ（手動）

1. **Workers & Pages → KV** で名前空間を作成
   - 名前例: `srhub-stats`
   - 本番 / プレビューで分けたい場合はそれぞれ作る
2. **Pages プロジェクト → Settings → Functions → KV namespace bindings** で
   - Variable name: `STATS_KV`
   - KV namespace: 上で作った `srhub-stats`
   - Production / Preview 両方に設定
3. デプロイをトリガーすると `functions/` 配下が自動で Pages Functions として
   配備され、`/api/*` が有効になる

## ローカル開発

Pages Functions はローカルでは `wrangler pages dev` で動かす：

```bash
cd web
npx wrangler pages dev out --kv STATS_KV
# 別ターミナルで next dev でフロントだけ動かす場合は CORS の都合があるため
# build → wrangler pages dev で確認するのが手っ取り早い
```

## 既知の制約

- KV は最終的整合性。連続アクセス時に一瞬古い値が返ることがある（用途上問題なし）
- IP ベースの抑止なので、共有 NAT 環境では同一 IP として扱われる（仕様）
- カウンタの増分は read-modify-write。極端な同時アクセスでは取りこぼしの可能性あり
  （ただし KV 単一キーで秒間多重書込みを避ける運用なので実害なし）

# メディア（画像・動画）運用方針

リポジトリ肥大化と GitHub の 100MB ファイル上限（GH001）を避けるための運用ルール。
2026-05-09 策定。

## 配信先の使い分け

| 種類 | 置き場所 | 理由 |
|---|---|---|
| 動画（.mov / .mp4 / .webm 等） | **Cloudflare R2 (`media.srhub.jp`)** | 動画は重く必ず100MB上限に抵触。R2 は egress 無料 |
| レポートの大量写真 | **Cloudflare R2 (`media.srhub.jp`)** を推奨（または最適化してリポジトリ） | 報告ごとに数十枚規模になるため |
| レース hero 画像 / contributor アバター / ロゴ | **リポジトリ** に入れる（最適化必須） | 数が限定的、サイト全体で共通利用 |

## CDN: Cloudflare R2

- **本番ドメイン**: `https://media.srhub.jp/`
- **dev URL**（参考）: `https://pub-b05f308e99ae4392b0b247b1eeedd764.r2.dev/` ←レート制限あり、本番では使わない
- **バケット内パス構造**: `reports/<report-slug>/<filename>`
  - 例: `reports/2023-tk-hashimoto-TheCoastalChallenge/バカンス.mp4`
- アップロードは Cloudflare ダッシュボード → R2 → 該当バケット → Objects タブからドラッグ&ドロップ
  - 日本語ファイル名は NFC で保存される（macOS Finder からのアップロードで確認済み）

## リポジトリ側のルール

### `.gitignore`（既存）

```gitignore
# media (host on external CDN, e.g. Cloudflare R2)
*.mov
*.MOV
*.mp4
*.webm

# local archive for media moved out of the repo
/_archive/
```

`_archive/` はローカル退避用。R2 アップロード元として使用、git 追跡しない。

### 画像をリポジトリに入れる場合の最適化

```bash
# JPEG: 最大 1920px / quality 80
sips -Z 1920 -s format jpeg -s formatOptions 80 input.jpg --out output.jpg
```

**目安**: 1ファイル 1MB 以下、ヒーロー画像でも 2MB 以下。
これを超えるなら R2 行きを検討する。

### 動画を MP4 に変換する場合

iPhone の `.MOV` (HEVC) を Web 向け H.264 にする：

```bash
ffmpeg -i in.MOV \
  -c:v libx264 -crf 26 -preset medium \
  -vf "scale='min(1920,iw)':-2" \
  -c:a aac -b:a 128k \
  -movflags +faststart \
  out.mp4
```

注意: HEVC は H.264 より圧縮効率が高いため、変換すると同等画質でもファイルサイズが増える場合がある。
互換性が確保できているなら HEVC のまま R2 へ置く選択肢もある（Safari / Chrome 107+ / Edge / Firefox 134+ 対応）。

## Markdown での記述

`web/content/reports/*.md` 内で動画・写真を埋め込むには以下の記法を使う。
`web/src/lib/content.ts` の `MEDIA_MARKER_RE` が `<video>` / `<img>` タグに展開する。

```markdown
[動画: https://media.srhub.jp/reports/2023-tk-hashimoto-TheCoastalChallenge/バカンス.mp4]
[写真: /images/reports/2023-tk-hashimoto-TheCoastalChallenge/食事.jpg]
```

- 動画は **R2 のフル URL** を書く
- ローカル画像は `/images/...` の絶対パスで OK（`web/public/` 起点）
- 全角コロン `：` も認識される

## 新しいレポートを追加するときの手順

1. レポートを `web/content/reports/<report-slug>.md` に作成
2. 写真は `web/public/images/reports/<report-slug>/` に置き、`sips` で 1920px / q80 に圧縮
3. 動画があれば：
   - ローカルでは `_archive/reports/<report-slug>/` に置く（git 追跡されない）
   - 必要なら `ffmpeg` で MP4 に変換
   - Cloudflare ダッシュボードから R2 の `reports/<report-slug>/` にアップロード
   - ブラウザで `https://media.srhub.jp/reports/<report-slug>/<filename>.mp4` が再生できるか確認
4. markdown 内に `[動画: https://media.srhub.jp/...]` で参照

## 既存資産の在処（参考）

- ローカル退避済み動画: `_archive/reports/2023-tk-hashimoto-TheCoastalChallenge/`（変換前）
  および `_archive/reports/2023-tk-hashimoto-TheCoastalChallenge/mp4/`（H.264 MP4）
- R2 にアップ済みの動画12本: `reports/2023-tk-hashimoto-TheCoastalChallenge/` 配下
  - うち `水の上を走る.mp4`, `絶景2.mp4`, `綺麗なジャングルと海.mp4` の3本は markdown から未参照

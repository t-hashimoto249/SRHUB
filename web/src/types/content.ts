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

export type ContactMethod =
  | "email"
  | "x"
  | "instagram"
  | "youtube"
  | "facebook"
  | "website";

export interface Contact {
  method: ContactMethod;
  value: string;
}

export interface EntryFee {
  amount: number;
  currency: Currency;
}

export interface ScheduleEntry {
  day: number;
  description: string;
}

export interface RaceVideo {
  id: string;
  title: string;
}

export interface GearEntry {
  name: string;
  url?: string;          // 購入リンク等
  mandatory?: boolean;   // 必携 = true / 推奨 = false
  note?: string;         // 補足説明
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
  start_month: number;
  terrain: Terrain[];
  difficulty: 1 | 2 | 3 | 4 | 5;
  support: SupportType;
  organizer: string;
  participants_approx?: number;
  entry_fee?: EntryFee;
  official_url: string;
  hero_image?: string;
  summary: string;
  coords?: [number, number];       // 任意：[lat, lng]。未指定時は country から自動解決
  gear?: (string | GearEntry)[];   // 既存の string 形式と新しい構造化 GearEntry を混在可能
  schedule?: ScheduleEntry[];
  entry_flow?: string;
  videos?: RaceVideo[];
}

export interface Race extends Omit<RaceFrontmatter, "gear"> {
  gear?: GearEntry[];     // 読み込み時に正規化される
  contentHtml: string;
}

/** 一覧・地図など本文 HTML を含めない用途 */
export type RaceListItem = Omit<Race, "contentHtml">;

export type ReportPurpose = "completion" | "competitive" | "personal";

export const REPORT_PURPOSE_LABEL: Record<ReportPurpose, string> = {
  completion: "完走志向",
  competitive: "上位志向",
  personal: "マイペース志向",
};

export const REPORT_PURPOSE_DESCRIPTION: Record<ReportPurpose, string> = {
  completion: "制限時間内に走り切ることを目標とするランナー向け",
  competitive: "タイム・順位を狙う経験豊富なランナー向け",
  personal: "写真・観光・自分なりのテーマで楽しむランナー向け",
};

export type AttachmentKind =
  | "spreadsheet" // Excel / Google Sheets / Numbers など
  | "document" // Word / Google Docs / PDF など
  | "photos" // 写真アルバム
  | "video" // 動画
  | "other";

export interface ReportAttachment {
  title: string;
  url: string;
  kind?: AttachmentKind;
  description?: string;
}

export type GalleryItemKind = "image" | "youtube";

export interface GalleryItem {
  kind: GalleryItemKind;
  src: string;        // image: 画像パス または URL / youtube: 動画 ID（"dQw4w9WgXcQ" のような形式）
  caption?: string;   // 説明文
  alt?: string;       // 画像のみ：alt テキスト（任意、未指定時は caption を使用）
}

export interface ReportFrontmatter {
  title: string;
  slug: string;
  race_slug: string;
  contributor: string;
  date: string;
  purpose: ReportPurpose;
  hero_image?: string;
  summary: string;
  attachments?: ReportAttachment[];
  gallery?: GalleryItem[];
}

export interface Report extends ReportFrontmatter {
  contentHtml: string;
}

export interface ContributorFrontmatter {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  contacts: Contact[];
}

export interface Contributor extends ContributorFrontmatter {
  contentHtml: string;
}

export type PartnerCategory =
  | "装備"
  | "主催・大会運営"
  | "販売店・EC"
  | "旅行・現地手配"
  | "メディア・教育"
  | "その他";

export interface PartnerFrontmatter {
  id: string;
  name: string;
  category: PartnerCategory;
  url: string;
  description: string;
  logo?: string;
  affiliate?: boolean;     // アフィリエイトリンクを含む場合 true
  featured?: boolean;      // ページ冒頭で目立たせる場合 true
}

export interface Partner extends PartnerFrontmatter {
  contentHtml: string;
}

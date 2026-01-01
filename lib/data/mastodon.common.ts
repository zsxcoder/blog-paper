/**
 * Mastodon API type definitions
 */

export interface MastodonEmoji {
  shortcode: string;
  static_url: string;
  url: string;
}

export interface MastodonMedia {
  id: string;
  type: string;
  url: string;
  preview_url: string;
  remote_url: string | null;
}

export interface MastodonAccount {
  id: string;
  username: string;
  display_name: string;
  url: string;
  avatar: string;
  avatar_static: string;
}

export interface MastodonStatus {
  id: string;
  created_at: string;
  content: string;
  account: MastodonAccount;
  media_attachments: MastodonMedia[];
  emojis: MastodonEmoji[];
  reblog: MastodonStatus | null;
  in_reply_to_id: string | null;
  visibility: string;
  url: string;
}

export interface MastodonConfig {
  instance: string;
  userId: string;
  token?: string;
  tag?: string;
  shownMax?: number;
}

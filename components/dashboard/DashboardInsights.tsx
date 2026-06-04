"use client";

import { tFeed } from "@/lib/i18n/t";
import type { FeedItem } from "@/data/types";
import styles from "./DashboardInsights.module.scss";

type Props = {
  insight?: string;
  items?: FeedItem[];
  className?: string;
};

function splitMessage(rawMessage: string): {
  hasAuthor: boolean;
  author: string;
  comment: string;
} {
  const separatorIndex = rawMessage.indexOf(":");
  const hasAuthor = separatorIndex > 0;
  const author = hasAuthor ? rawMessage.slice(0, separatorIndex).trim() : "";
  const comment = hasAuthor ? rawMessage.slice(separatorIndex + 1).trim() : rawMessage;
  return { hasAuthor, author, comment };
}

export function DashboardInsights({ insight, items = [], className }: Props) {
  const messageText = insight ?? (items[0] ? tFeed(items[0].messageKey) : "");
  if (!messageText) return null;

  const { hasAuthor, author, comment } = splitMessage(messageText);
  return (
    <div className={[styles.insights, className].filter(Boolean).join(" ")}>
      <span className={styles.message}>
        {hasAuthor ? (
          <>
            <span className={styles.author}>{author}:</span> {comment}
          </>
        ) : (
          messageText
        )}
      </span>
    </div>
  );
}

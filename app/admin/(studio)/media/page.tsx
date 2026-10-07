"use client";

import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { PageHeader } from "@/components/admin/ui";

export default function MediaPage() {
  return (
    <>
      <PageHeader title="ספריית מדיה" intro="כל התמונות והסרטונים של האתר. לחיצה על קובץ מציגה פרטים, שימוש, החלפה ומחיקה." />
      <MediaLibrary />
    </>
  );
}

"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CollectionEditor } from "@/components/collections/collection-editor";
import {
  COLLECTION_CONFIG,
  isCollectionKind,
} from "@/components/collections/config";

export default function CollectionEditorPage({
  params,
}: {
  params: Promise<{ kind: string; id: string }>;
}) {
  const { kind, id } = use(params);
  if (!isCollectionKind(kind)) {
    notFound();
  }
  return <CollectionEditor config={COLLECTION_CONFIG[kind]} id={id} />;
}

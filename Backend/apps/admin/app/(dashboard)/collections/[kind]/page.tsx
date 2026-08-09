"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { CollectionList } from "@/components/collections/collection-list";
import {
  COLLECTION_CONFIG,
  isCollectionKind,
} from "@/components/collections/config";

export default function CollectionListPage({
  params,
}: {
  params: Promise<{ kind: string }>;
}) {
  const { kind } = use(params);
  if (!isCollectionKind(kind)) {
    notFound();
  }
  return <CollectionList config={COLLECTION_CONFIG[kind]} />;
}

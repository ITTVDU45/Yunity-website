"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ListTree,
  Loader2,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";
import type {
  NavigationItemResponse,
  NavigationItemType,
  NavigationResponse,
} from "@yunity/contracts";
import { clientApi } from "@/lib/client-api";
import { useAdminI18n } from "@/lib/admin-i18n";
import { cn } from "@/lib/utils";
import { flattenTree, moveSibling } from "./nav-helpers";

interface NavigationSummary {
  id: string;
  key: string;
  name: string;
}

const TYPE_LABELS: Record<NavigationItemType, string> = {
  PAGE: "Seite",
  EXTERNAL: "Externer Link",
  ANCHOR: "Anker",
  GROUP: "Dropdown",
  BUTTON: "Button",
  COLLECTION: "Collection",
  PLACEHOLDER: "Platzhalter",
};

export default function NavigationPage() {
  const { locale } = useAdminI18n();
  const [navigations, setNavigations] = useState<NavigationSummary[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [tree, setTree] = useState<NavigationResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadNavigations = useCallback(async () => {
    const result = await clientApi<NavigationSummary[]>(
      "/api/v1/admin/navigations",
    );
    if (result.success) {
      setNavigations(result.data);
      setActiveId((current) => current ?? result.data[0]?.id ?? null);
      setError("");
    } else {
      setError(result.error.message);
    }
    setLoading(false);
  }, []);

  const loadTree = useCallback(async (navId: string) => {
    const result = await clientApi<NavigationResponse>(
      `/api/v1/admin/navigations/${navId}/tree`,
    );
    if (result.success) {
      setTree(result.data);
    } else {
      setError(result.error.message);
    }
  }, []);

  useEffect(() => {
    void loadNavigations();
  }, [loadNavigations]);

  useEffect(() => {
    if (activeId) {
      void loadTree(activeId);
    }
  }, [activeId, loadTree]);

  const persistOrder = useCallback(
    async (nextTree: NavigationResponse) => {
      setTree(nextTree);
      const order = flattenTree(nextTree.items);
      await clientApi(`/api/v1/admin/navigations/${nextTree.id}/reorder`, {
        method: "POST",
        body: { order },
      });
    },
    [],
  );

  const handleMove = useCallback(
    (id: string, direction: -1 | 1) => {
      if (!tree) return;
      const nextItems = moveSibling(tree.items, id, direction);
      void persistOrder({ ...tree, items: nextItems });
    },
    [tree, persistOrder],
  );

  const handleToggleVisible = useCallback(
    async (item: NavigationItemResponse) => {
      if (!activeId) return;
      await clientApi(
        `/api/v1/admin/navigations/${activeId}/items/${item.id}`,
        { method: "PATCH", body: { isVisible: !item.isVisible } },
      );
      void loadTree(activeId);
    },
    [activeId, loadTree],
  );

  const handleDelete = useCallback(
    async (item: NavigationItemResponse) => {
      if (!activeId) return;
      await clientApi(
        `/api/v1/admin/navigations/${activeId}/items/${item.id}`,
        { method: "DELETE" },
      );
      void loadTree(activeId);
    },
    [activeId, loadTree],
  );

  const handleEditLabel = useCallback(
    async (item: NavigationItemResponse) => {
      if (!activeId) return;
      const current =
        item.translations[locale] ?? item.translations.de ?? item.label;
      const label = window.prompt(
        `Label (${locale.toUpperCase()})`,
        current,
      );
      if (!label?.trim()) return;
      const result = await clientApi(
        `/api/v1/admin/navigations/${activeId}/items/${item.id}`,
        {
          method: "PATCH",
          body: {
            translations: {
              ...item.translations,
              [locale]: label.trim(),
            },
          },
        },
      );
      if (result.success) {
        void loadTree(activeId);
      } else {
        setError(result.error.message);
      }
    },
    [activeId, loadTree, locale],
  );

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white uppercase tracking-tight mb-2">
          Navigation
        </h1>
        <p className="text-zinc-500 font-medium">
          Menuestrukturen fuer Header, Footer und weitere Bereiche.
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/30 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center gap-3 text-zinc-400">
          <Loader2 className="w-5 h-5 animate-spin" /> Wird geladen…
        </div>
      ) : (
        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <NavigationList
            navigations={navigations}
            activeId={activeId}
            onSelect={setActiveId}
            onCreated={(id) => {
              void loadNavigations();
              setActiveId(id);
            }}
          />

          <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm p-6">
            {tree ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-black uppercase tracking-tight text-zinc-900 dark:text-white">
                      {tree.name}
                    </h2>
                    <p className="text-xs text-zinc-400 font-mono">{tree.key}</p>
                  </div>
                </div>

                {tree.items.length === 0 ? (
                  <p className="text-sm text-zinc-500 py-8 text-center">
                    Noch keine Eintraege.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {tree.items.map((item, index) => (
                      <ItemRow
                        key={item.id}
                        item={item}
                        depth={0}
                        index={index}
                        siblingCount={tree.items.length}
                        locale={locale}
                        onMove={handleMove}
                        onEditLabel={handleEditLabel}
                        onToggleVisible={handleToggleVisible}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}

                {activeId && (
                  <AddItemForm
                    navigationId={activeId}
                    items={tree.items}
                    locale={locale}
                    onAdded={() => void loadTree(activeId)}
                  />
                )}
              </>
            ) : (
              <p className="text-sm text-zinc-500">
                Keine Navigation ausgewaehlt.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NavigationList({
  navigations,
  activeId,
  onSelect,
  onCreated,
}: {
  navigations: NavigationSummary[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreated: (id: string) => void;
}) {
  const [creating, setCreating] = useState(false);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const create = async () => {
    const result = await clientApi<NavigationSummary>(
      "/api/v1/admin/navigations",
      { method: "POST", body: { key, name } },
    );
    if (result.success) {
      setKey("");
      setName("");
      setCreating(false);
      setError("");
      onCreated(result.data.id);
    } else {
      setError(result.error.message);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-100 dark:border-zinc-800 shadow-sm p-5 h-fit">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3 px-2">
        Navigationen
      </p>
      <div className="space-y-1">
        {navigations.map((nav) => (
          <button
            key={nav.id}
            onClick={() => onSelect(nav.id)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all",
              nav.id === activeId
                ? "bg-brand text-white"
                : "text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-800/50",
            )}
          >
            <ListTree className="w-4 h-4" />
            <span className="font-bold text-sm">{nav.name}</span>
          </button>
        ))}
      </div>

      {creating ? (
        <div className="mt-4 space-y-2 border-t border-zinc-100 dark:border-zinc-800 pt-4">
          <input
            placeholder="Schluessel (z. B. footer)"
            value={key}
            onChange={(event) => setKey(event.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
          />
          <input
            placeholder="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2">
            <button
              onClick={() => void create()}
              disabled={!key || !name}
              className="flex-1 bg-brand text-white px-3 py-2 rounded-lg font-bold text-xs uppercase tracking-wide disabled:opacity-50"
            >
              Anlegen
            </button>
            <button
              onClick={() => setCreating(false)}
              className="px-3 py-2 rounded-lg text-zinc-500 text-xs font-bold"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setCreating(true)}
          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:text-brand hover:border-brand/40 transition-all text-xs font-bold uppercase tracking-wide"
        >
          <Plus className="w-4 h-4" /> Navigation
        </button>
      )}
    </div>
  );
}

function ItemRow({
  item,
  depth,
  index,
  siblingCount,
  locale,
  onMove,
  onEditLabel,
  onToggleVisible,
  onDelete,
}: {
  item: NavigationItemResponse;
  depth: number;
  index: number;
  siblingCount: number;
  locale: "de" | "en" | "tr";
  onMove: (id: string, direction: -1 | 1) => void;
  onEditLabel: (item: NavigationItemResponse) => void;
  onToggleVisible: (item: NavigationItemResponse) => void;
  onDelete: (item: NavigationItemResponse) => void;
}) {
  return (
    <>
      <div
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-zinc-50 dark:hover:bg-zinc-800/50 group"
        style={{ marginLeft: depth * 24 }}
      >
        <div className="flex flex-col">
          <button
            onClick={() => onMove(item.id, -1)}
            disabled={index === 0}
            className="text-zinc-300 hover:text-brand disabled:opacity-30 disabled:hover:text-zinc-300"
            aria-label="Nach oben"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => onMove(item.id, 1)}
            disabled={index === siblingCount - 1}
            className="text-zinc-300 hover:text-brand disabled:opacity-30 disabled:hover:text-zinc-300"
            aria-label="Nach unten"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-bold text-sm truncate",
              item.isVisible
                ? "text-zinc-900 dark:text-white"
                : "text-zinc-400 line-through",
            )}
          >
            {item.translations[locale] ??
              item.translations.de ??
              item.label}
          </p>
          <p className="text-[10px] text-zinc-400 truncate">
            {TYPE_LABELS[item.type]}
            {item.url ? ` · ${item.url}` : ""}
          </p>
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEditLabel(item)}
            className="p-2 text-zinc-400 hover:text-brand rounded-lg"
            aria-label={`Label (${locale.toUpperCase()}) bearbeiten`}
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onToggleVisible(item)}
            className="p-2 text-zinc-400 hover:text-brand rounded-lg"
            aria-label="Sichtbarkeit"
          >
            {item.isVisible ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={() => onDelete(item)}
            className="p-2 text-zinc-400 hover:text-red-500 rounded-lg"
            aria-label="Loeschen"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {item.children.map((child, childIndex) => (
        <ItemRow
          key={child.id}
          item={child}
          depth={depth + 1}
          index={childIndex}
          siblingCount={item.children.length}
          locale={locale}
          onMove={onMove}
          onEditLabel={onEditLabel}
          onToggleVisible={onToggleVisible}
          onDelete={onDelete}
        />
      ))}
    </>
  );
}

function AddItemForm({
  navigationId,
  items,
  locale,
  onAdded,
}: {
  navigationId: string;
  items: NavigationItemResponse[];
  locale: "de" | "en" | "tr";
  onAdded: () => void;
}) {
  const [label, setLabel] = useState("");
  const [url, setUrl] = useState("");
  const [type, setType] = useState<NavigationItemType>("EXTERNAL");
  const [parentId, setParentId] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    const body: Record<string, unknown> = { label, type, locale };
    if (url) body.url = url;
    if (parentId) body.parentId = parentId;
    const result = await clientApi(
      `/api/v1/admin/navigations/${navigationId}/items`,
      { method: "POST", body },
    );
    if (result.success) {
      setLabel("");
      setUrl("");
      setParentId("");
      setError("");
      onAdded();
    } else {
      setError(result.error.message);
    }
  };

  return (
    <div className="mt-6 border-t border-zinc-100 dark:border-zinc-800 pt-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">
        Eintrag hinzufuegen
      </p>
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          placeholder={`Label (${locale.toUpperCase()})`}
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
        />
        <input
          placeholder="URL (z. B. /kontakt)"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
        />
        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value as NavigationItemType)
          }
          className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
        >
          {Object.entries(TYPE_LABELS).map(([value, labelText]) => (
            <option key={value} value={value}>
              {labelText}
            </option>
          ))}
        </select>
        <select
          value={parentId}
          onChange={(event) => setParentId(event.target.value)}
          className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-brand/40"
        >
          <option value="">— Oberste Ebene —</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.translations[locale] ??
                item.translations.de ??
                item.label}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
      <button
        onClick={() => void submit()}
        disabled={!label}
        className="mt-3 flex items-center gap-2 bg-brand text-white px-4 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
      >
        <Plus className="w-4 h-4" /> Hinzufuegen
      </button>
    </div>
  );
}

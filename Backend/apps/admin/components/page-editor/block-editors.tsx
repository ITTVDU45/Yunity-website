"use client";

import {
  ActionField,
  ItemsField,
  StringListField,
  TextAreaField,
  TextField,
  type ActionValue,
} from "./fields";
import { SectionMediaField } from "./media-field";

export type BlockData = Record<string, unknown>;

interface BlockEditorProps {
  data: BlockData;
  onChange: (data: BlockData) => void;
}

/** Kleiner Helfer: setzt einen Schluessel und entfernt leere Werte. */
function useField(data: BlockData, onChange: (data: BlockData) => void) {
  return (key: string, value: unknown) => {
    const next = { ...data };
    if (value === undefined || value === "" || value === null) {
      delete next[key];
    } else {
      next[key] = value;
    }
    onChange(next);
  };
}

function str(data: BlockData, key: string): string {
  const value = data[key];
  return typeof value === "string" ? value : "";
}

function rows(data: BlockData, key: string): Record<string, string>[] {
  return (Array.isArray(data[key]) ? data[key] : []).map((entry) => {
    const item = (entry ?? {}) as Record<string, unknown>;
    return Object.fromEntries(
      Object.entries(item).map(([k, v]) => [k, v == null ? "" : String(v)]),
    );
  });
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-black uppercase tracking-widest text-zinc-400">
        {label}
      </span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm text-zinc-900 outline-none focus:border-accent/60 dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

/** Eyebrow/Titel/Beschreibung — in fast jedem Block identisch. */
function HeaderFields({
  data,
  set,
  descriptionRows = 3,
}: {
  data: BlockData;
  set: (key: string, value: unknown) => void;
  descriptionRows?: number;
}) {
  return (
    <>
      <TextField label="Eyebrow" value={str(data, "eyebrow")} onChange={(v) => set("eyebrow", v)} />
      <TextField label="Titel" value={str(data, "title")} onChange={(v) => set("title", v)} />
      <TextAreaField
        label="Beschreibung"
        value={str(data, "description")}
        onChange={(v) => set("description", v)}
        rows={descriptionRows}
      />
    </>
  );
}

/**
 * Bildauswahl aus der Mediathek plus Alternativtext. Gespeichert wird die
 * Medien-ID; `imageUrl` bleibt nur fuer Bilder aus Fremdquellen (z. B. die
 * bestehenden Unsplash-Adressen) bestehen und wird beim Wechsel entfernt.
 */
function ImageFields({
  data,
  onChange,
  label = "Bild",
}: {
  data: BlockData;
  onChange: (data: BlockData) => void;
  label?: string;
}) {
  const set = useField(data, onChange);
  return (
    <>
      <SectionMediaField
        label={label}
        mediaId={str(data, "mediaId")}
        imageUrl={str(data, "imageUrl")}
        onSelect={(asset) => {
          const next: BlockData = { ...data, mediaId: asset.id };
          delete next.imageUrl;
          onChange(next);
        }}
        onRemove={() => {
          const next = { ...data };
          delete next.mediaId;
          delete next.imageUrl;
          onChange(next);
        }}
      />
      <TextField
        label="Bildbeschreibung (Alt-Text)"
        value={str(data, "imageAlt")}
        onChange={(v) => set("imageAlt", v)}
      />
    </>
  );
}

// ---------------------------------------------------------------- Kopfbereich

function HeroEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <TextField label="Badge ueber der Ueberschrift" value={str(data, "badge")} onChange={(v) => set("badge", v)} />
      <TextAreaField label="Ueberschrift" value={str(data, "title")} onChange={(v) => set("title", v)} rows={2} />
      <TextAreaField label="Einleitungstext" value={str(data, "description")} onChange={(v) => set("description", v)} rows={3} />
      <ActionField label="Erster Button" value={data.primaryAction as ActionValue | undefined} onChange={(v) => set("primaryAction", v)} />
      <ActionField label="Zweiter Button" value={data.secondaryAction as ActionValue | undefined} onChange={(v) => set("secondaryAction", v)} />
      <TextAreaField label="Hinweiszeile unter den Buttons" value={str(data, "footnote")} onChange={(v) => set("footnote", v)} rows={2} />
      <ImageFields data={data} onChange={onChange} label="Hero-Bild" />
    </div>
  );
}

function PageHeroEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ImageFields data={data} onChange={onChange} label="Kopfbild" />
      <ActionField label="Erster Button" value={data.primaryAction as ActionValue | undefined} onChange={(v) => set("primaryAction", v)} />
      <ActionField label="Zweiter Button" value={data.secondaryAction as ActionValue | undefined} onChange={(v) => set("secondaryAction", v)} />
      <StringListField
        label="Merkmale (Chips)"
        items={Array.isArray(data.highlights) ? (data.highlights as string[]) : []}
        onChange={(next) => set("highlights", next.length ? next : undefined)}
      />
    </div>
  );
}

// -------------------------------------------------------------------- Inhalte

function LogoLoopEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Einsatzbereiche"
        items={rows(data, "items")}
        subFields={[
          { key: "label", label: "Bezeichnung" },
          { key: "icon", label: "Icon (music, building, trophy, megaphone, utensils, truck)" },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Bereich hinzufuegen"
      />
    </div>
  );
}

function RichTextEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <TextAreaField label="Inhalt (HTML)" value={str(data, "body")} onChange={(v) => set("body", v)} rows={14} />
    </div>
  );
}

function TextImageEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <TextAreaField label="Inhalt (HTML)" value={str(data, "body")} onChange={(v) => set("body", v)} rows={8} />
      <ImageFields data={data} onChange={onChange} />
      <SelectField
        label="Bildseite"
        value={str(data, "imageSide") || "left"}
        options={[["left", "Bild links"], ["right", "Bild rechts"]]}
        onChange={(v) => set("imageSide", v)}
      />
      <ActionField label="Aktion" value={data.action as ActionValue | undefined} onChange={(v) => set("action", v)} />
    </div>
  );
}

function IconCardGridEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Karten"
        items={rows(data, "items")}
        subFields={[
          { key: "title", label: "Titel" },
          { key: "text", label: "Text", multiline: true },
          { key: "icon", label: "Icon (shield, sparkles, gauge, handshake, clock, wallet, heart, alert, trending, check)" },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Karte hinzufuegen"
      />
      <TextField
        label="Spalten (2–4, leer = automatisch)"
        value={typeof data.columns === "number" ? String(data.columns) : ""}
        onChange={(v) => set("columns", v ? Number(v) : undefined)}
      />
    </div>
  );
}

function NumberedStepsEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Schritte"
        items={rows(data, "items")}
        subFields={[
          { key: "number", label: "Nummer (z. B. 01)" },
          { key: "title", label: "Titel" },
          { key: "text", label: "Text", multiline: true },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Schritt hinzufuegen"
      />
    </div>
  );
}

function ProcessStepsEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Ablaufschritte"
        items={rows(data, "items")}
        subFields={[
          { key: "step", label: "Nummer (z. B. 01)" },
          { key: "title", label: "Titel" },
          { key: "text", label: "Text", multiline: true },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Schritt hinzufuegen"
      />
      <ActionField label="Aktion" value={data.action as ActionValue | undefined} onChange={(v) => set("action", v)} />
    </div>
  );
}

function ChecklistPanelEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <StringListField
        label="Punkte"
        items={Array.isArray(data.items) ? (data.items as string[]) : []}
        onChange={(next) => set("items", next.length ? next : undefined)}
      />
      <SelectField
        label="Darstellung"
        value={str(data, "tone") || "image"}
        options={[["image", "Mit Bild"], ["dark", "Dunkle Flaeche ohne Bild"]]}
        onChange={(v) => set("tone", v)}
      />
      <ImageFields data={data} onChange={onChange} />
    </div>
  );
}

function StatisticsEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  const items = rows(data, "items");
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <ItemsField
        label="Kennzahlen"
        items={items}
        subFields={[
          { key: "value", label: "Zahl (nur Ziffern, z. B. 850)" },
          { key: "prefix", label: "Vorsatz (optional, z. B. ab)" },
          { key: "suffix", label: "Zusatz (optional, z. B. + oder %)" },
          { key: "label", label: "Bezeichnung" },
        ]}
        onChange={(next) =>
          // Der Zaehler im Frontend animiert eine Zahl — der Wert wird deshalb
          // hier konvertiert und nicht als Text gespeichert.
          set(
            "items",
            next.map((item) => ({
              ...item,
              value: Number.parseFloat(item.value ?? "") || 0,
            })),
          )
        }
        addLabel="Kennzahl hinzufuegen"
      />
    </div>
  );
}

function AccordionEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <ItemsField
        label="Fragen & Antworten"
        items={rows(data, "items")}
        subFields={[
          { key: "question", label: "Frage" },
          { key: "answer", label: "Antwort", multiline: true },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Frage hinzufuegen"
      />
    </div>
  );
}

function JobExamplesEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Beispiel-Einsaetze"
        items={rows(data, "items")}
        subFields={[
          { key: "title", label: "Bezeichnung" },
          { key: "location", label: "Ort" },
          { key: "tag", label: "Zeitraum (Chip)" },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Einsatz hinzufuegen"
      />
    </div>
  );
}

function TeamCardsEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <ItemsField
        label="Personen"
        items={rows(data, "items")}
        subFields={[
          { key: "name", label: "Name" },
          { key: "role", label: "Rolle" },
          { key: "imageUrl", label: "Bild-URL (leer = Platzhalter „Foto folgt“)" },
          { key: "imageAlt", label: "Bildbeschreibung" },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Person hinzufuegen"
      />
    </div>
  );
}

function ContactCardsEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <ItemsField
        label="Kacheln"
        items={rows(data, "items")}
        subFields={[
          { key: "label", label: "Bezeichnung (z. B. Telefon)" },
          { key: "value", label: "Wert" },
          { key: "href", label: "Link (tel:, mailto: oder URL; leer = kein Link)" },
          { key: "icon", label: "Icon (phone, mail, clock, pin)" },
        ]}
        onChange={(next) => set("items", next)}
        addLabel="Kachel hinzufuegen"
      />
    </div>
  );
}

function QuoteEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <TextAreaField label="Zitat" value={str(data, "text")} onChange={(v) => set("text", v)} rows={3} />
      <TextField label="Autor" value={str(data, "author")} onChange={(v) => set("author", v)} />
      <TextField label="Rolle" value={str(data, "role")} onChange={(v) => set("role", v)} />
    </div>
  );
}

// ---------------------------------------------------------------- Interaktion

function CtaEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <TextAreaField label="Titel" value={str(data, "title")} onChange={(v) => set("title", v)} rows={2} />
      <TextAreaField label="Beschreibung" value={str(data, "description")} onChange={(v) => set("description", v)} rows={2} />
      <ActionField label="Erster Button" value={data.primaryAction as ActionValue | undefined} onChange={(v) => set("primaryAction", v)} />
      <ActionField label="Zweiter Button" value={data.secondaryAction as ActionValue | undefined} onChange={(v) => set("secondaryAction", v)} />
      <SelectField
        label="Hintergrund"
        value={str(data, "variant") || "default"}
        options={[["default", "Standard"], ["muted", "Gedaempft"]]}
        onChange={(v) => set("variant", v)}
      />
    </div>
  );
}

function ApplicantCtaEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <TextField label="Badge" value={str(data, "badge")} onChange={(v) => set("badge", v)} />
      <TextAreaField label="Ueberschrift" value={str(data, "title")} onChange={(v) => set("title", v)} rows={2} />
      <TextAreaField label="Text" value={str(data, "description")} onChange={(v) => set("description", v)} rows={3} />
      <ActionField label="Button" value={data.action as ActionValue | undefined} onChange={(v) => set("action", v)} />
      <ImageFields data={data} onChange={onChange} label="Hintergrundbild" />
    </div>
  );
}

function FormEmbedEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} descriptionRows={2} />
      <SelectField
        label="Formular"
        value={str(data, "formKey") || "contact"}
        options={[
          ["contact", "Kontaktformular"],
          ["company-inquiry", "Personalanfrage (Unternehmen)"],
        ]}
        onChange={(v) => set("formKey", v)}
      />
      <p className="text-xs text-zinc-400">
        Die Felder des Formulars werden unter „Formulare“ gepflegt. Eingaben
        landen unter „Anfragen“.
      </p>
    </div>
  );
}

// ----------------------------------------------------------------- Sammlungen

function CollectionBlockEditor({ data, onChange }: BlockEditorProps) {
  const set = useField(data, onChange);
  return (
    <div className="space-y-4">
      <HeaderFields data={data} set={set} />
      <SelectField
        label="Auswahl"
        value={str(data, "selectionMode") || "all"}
        options={[
          ["all", "Alle"],
          ["featured", "Hervorgehoben"],
          ["latest", "Neueste"],
          ["manual", "Manuell ausgewaehlt"],
        ]}
        onChange={(v) => set("selectionMode", v)}
      />
      <TextField
        label="Maximale Anzahl"
        value={typeof data.limit === "number" ? String(data.limit) : ""}
        onChange={(v) => set("limit", v ? Number(v) : undefined)}
      />
      <TextField
        label="Layout (leer = Standard)"
        value={str(data, "layout")}
        onChange={(v) => set("layout", v)}
        placeholder="cards / detail / chips bzw. grid / slider"
      />
      <ActionField label="Aktion unter der Liste" value={data.action as ActionValue | undefined} onChange={(v) => set("action", v)} />
    </div>
  );
}

const EDITORS: Record<string, (props: BlockEditorProps) => React.ReactElement> = {
  hero: HeroEditor,
  "page-hero": PageHeroEditor,
  "logo-loop": LogoLoopEditor,
  "rich-text": RichTextEditor,
  "text-image": TextImageEditor,
  "icon-card-grid": IconCardGridEditor,
  "numbered-steps": NumberedStepsEditor,
  "process-steps": ProcessStepsEditor,
  "checklist-panel": ChecklistPanelEditor,
  statistics: StatisticsEditor,
  accordion: AccordionEditor,
  "job-examples": JobExamplesEditor,
  "team-cards": TeamCardsEditor,
  "contact-cards": ContactCardsEditor,
  quote: QuoteEditor,
  cta: CtaEditor,
  "applicant-cta": ApplicantCtaEditor,
  "form-embed": FormEmbedEditor,
  "service-grid": CollectionBlockEditor,
  "industry-grid": CollectionBlockEditor,
  "testimonial-slider": CollectionBlockEditor,
  "blog-grid": CollectionBlockEditor,
};

export function BlockEditor({
  blockType,
  data,
  onChange,
}: {
  blockType: string;
  data: BlockData;
  onChange: (data: BlockData) => void;
}) {
  const Editor = EDITORS[blockType];
  if (!Editor) {
    return (
      <p className="text-sm text-zinc-500">
        Fuer den Blocktyp {blockType} ist noch kein Editor verfuegbar.
      </p>
    );
  }
  return <Editor data={data} onChange={onChange} />;
}

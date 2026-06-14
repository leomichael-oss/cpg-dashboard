// ---------------------------------------------------------------------------
// Export helpers. Generates plain-text representations of a song and a PDF
// (via jsPDF, imported lazily). The song passed in is expected to already be
// transposed to the user's chosen key.
// ---------------------------------------------------------------------------

import type { Song } from "./types";

export type ExportKind = "full" | "chords" | "melody";

function header(song: Song): string {
  const credits = song.songwriters.join(", ");
  return [
    song.title.toUpperCase(),
    `Key: ${song.key}    Tempo: ${song.tempo} BPM`,
    `Words & Music: ${credits}`,
    song.album ? `Album: ${song.album}${song.year ? ` (${song.year})` : ""}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

function chordLine(chords: string[]): string {
  return chords.length ? `| ${chords.join(" | ")} |` : "";
}

function melodyLine(notes: { note: string | null }[]): string {
  return notes.map((n) => n.note ?? "—").join("  ");
}

/** Build the plain-text export for the requested view. */
export function songToText(song: Song, kind: ExportKind = "full"): string {
  const lines: string[] = [header(song), ""];

  for (const section of song.sections) {
    lines.push(section.name.toUpperCase());
    if (kind !== "melody" && section.chords.length) {
      lines.push(`Chords: ${chordLine(section.chords)}`);
    }
    if (kind !== "chords") {
      for (const phrase of section.phrases) {
        lines.push("");
        lines.push(phrase.lyric);
        lines.push(`Melody: ${melodyLine(phrase.notes)}`);
      }
    }
    lines.push("");
  }

  lines.push("— Beatles Piano Companion");
  return lines.join("\n");
}

/** Trigger a browser download of a text file. */
export function downloadText(filename: string, text: string): void {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Generate and download a PDF rendering of the song. */
export async function downloadPdf(
  song: Song,
  kind: ExportKind = "full",
): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const margin = 56;
  const pageHeight = doc.internal.pageSize.getHeight();
  let y = margin;

  const writeLine = (
    text: string,
    size: number,
    opts: { bold?: boolean; mono?: boolean; gap?: number; color?: number[] } = {},
  ) => {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.setFont(opts.mono ? "courier" : "helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    const [r, g, b] = opts.color ?? [29, 29, 31];
    doc.setTextColor(r, g, b);
    const wrapped = doc.splitTextToSize(text, 500);
    doc.text(wrapped, margin, y);
    y += wrapped.length * (size + 4) + (opts.gap ?? 0);
  };

  writeLine(song.title, 24, { bold: true, gap: 6 });
  writeLine(
    `Key: ${song.key}    Tempo: ${song.tempo} BPM`,
    11,
    { color: [110, 110, 115] },
  );
  writeLine(`Words & Music: ${song.songwriters.join(", ")}`, 11, {
    color: [110, 110, 115],
    gap: 14,
  });

  for (const section of song.sections) {
    writeLine(section.name, 15, { bold: true, gap: 2 });
    if (kind !== "melody" && section.chords.length) {
      writeLine(`| ${section.chords.join(" | ")} |`, 12, { mono: true, gap: 4 });
    }
    if (kind !== "chords") {
      for (const phrase of section.phrases) {
        writeLine(phrase.lyric, 12, { gap: 0 });
        writeLine(
          phrase.notes.map((n) => n.note ?? "—").join("  "),
          12,
          { mono: true, color: [0, 113, 227], gap: 8 },
        );
      }
    }
    y += 10;
  }

  doc.save(`${song.id}-${kind}.pdf`);
}

"use client";

import { useState } from "react";
import type { Song } from "@/lib/types";
import {
  downloadPdf,
  downloadText,
  songToText,
  type ExportKind,
} from "@/lib/export";

interface ExportMenuProps {
  /** The song already transposed to the current key. */
  song: Song;
}

const ITEMS: { label: string; run: (song: Song) => void }[] = [
  {
    label: "PDF (full)",
    run: (s) => downloadPdf(s, "full"),
  },
  {
    label: "Plain text (full)",
    run: (s) => downloadText(`${s.id}-full.txt`, songToText(s, "full")),
  },
  {
    label: "Chord chart only",
    run: (s) => downloadText(`${s.id}-chords.txt`, songToText(s, "chords")),
  },
  {
    label: "Melody note list only",
    run: (s) => downloadText(`${s.id}-melody.txt`, songToText(s, "melody")),
  },
  {
    label: "PDF (chords only)",
    run: (s) => downloadPdf(s, "chords"),
  },
  {
    label: "PDF (melody only)",
    run: (s) => downloadPdf(s, "melody"),
  },
];

export default function ExportMenu({ song }: ExportMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="rounded-full border border-hairline bg-white px-4 py-2 text-sm font-medium text-ink transition hover:border-accent/50"
      >
        Export ▾
      </button>
      {open && (
        <ul className="absolute right-0 z-30 mt-2 w-56 overflow-hidden rounded-xl border border-hairline bg-white p-1.5 shadow-card">
          {ITEMS.map((item) => (
            <li key={item.label}>
              <button
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  item.run(song);
                  setOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left text-sm text-ink transition hover:bg-accentSoft"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

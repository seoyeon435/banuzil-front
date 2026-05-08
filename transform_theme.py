"""
Transform hex color tokens across src/app/components/**/*.tsx
toward the Bold Coral palette.

Rules:
- Match exactly 6-digit hex (#RRGGBB), case-insensitive.
- Replace per the mapping table below.
- Print per-file replacement counts and a summary.

Run: python transform_theme.py
"""

from __future__ import annotations

import os
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "src" / "app" / "components"

# Map source hex (uppercase) -> target hex (uppercase).
# Identity entries are documentation; they are skipped.
MAPPING: dict[str, str] = {
    # Backgrounds
    "#FFF8F4": "#FFF8F4",
    "#FFFFFF": "#FFFFFF",
    "#FDEEE6": "#FFE9DD",
    "#FFF0E8": "#FFE9DD",
    "#FFF4E6": "#FFE9DD",
    "#F5E6D8": "#FFE0CC",
    # Text
    "#2C1810": "#1F1410",
    "#8C6B5A": "#7A5C4D",
    # Border
    "#EDD9CC": "#F0DFD0",
    # Coral (main)
    "#FF8C7A": "#FF6347",
    "#E56B58": "#E84028",
    # Status
    "#6BAF8C": "#5A9F7C",
    "#5A9F7C": "#5A9F7C",
    "#E57373": "#DC3545",
    "#FFE6E6": "#FFE0E0",
    "#E6F7EE": "#E0F4E8",
    # Untouched (kept for completeness)
    "#D4956A": "#D4956A",
    "#FFD19A": "#FFD19A",
    "#FEE500": "#FEE500",
    "#B794F4": "#B794F4",
    "#000000": "#000000",
}

HEX_RE = re.compile(r"#[0-9A-Fa-f]{6}")


def replace_hex(match: re.Match[str]) -> str:
    original = match.group(0)
    upper = original.upper()
    target = MAPPING.get(upper)
    if target is None or target == upper:
        return original
    # Preserve the # prefix; emit target in uppercase for consistency.
    return target


def transform_file(path: Path) -> tuple[int, dict[str, int]]:
    text = path.read_text(encoding="utf-8")
    per_color: dict[str, int] = {}

    def counting_replace(match: re.Match[str]) -> str:
        original = match.group(0)
        upper = original.upper()
        target = MAPPING.get(upper)
        if target is None or target == upper:
            return original
        per_color[upper] = per_color.get(upper, 0) + 1
        return target

    new_text, _ = HEX_RE.subn(counting_replace, text)
    if new_text != text:
        path.write_text(new_text, encoding="utf-8", newline="\n")
    return sum(per_color.values()), per_color


def main() -> None:
    if not ROOT.exists():
        raise SystemExit(f"components root not found: {ROOT}")

    total = 0
    grand_per_color: dict[str, int] = {}
    touched_files: list[tuple[str, int]] = []

    for path in sorted(ROOT.rglob("*.tsx")):
        count, per_color = transform_file(path)
        if count == 0:
            continue
        total += count
        rel = path.relative_to(ROOT.parent.parent.parent)
        touched_files.append((str(rel), count))
        for k, v in per_color.items():
            grand_per_color[k] = grand_per_color.get(k, 0) + v

    print("Per-file replacement counts:")
    for rel, count in touched_files:
        print(f"  {count:4d}  {rel}")

    print("\nPer-color totals (source -> target):")
    for src in sorted(grand_per_color, key=grand_per_color.get, reverse=True):
        tgt = MAPPING[src]
        print(f"  {grand_per_color[src]:4d}  {src} -> {tgt}")

    print(f"\nTotal replacements: {total}")
    print(f"Files touched:      {len(touched_files)}")


if __name__ == "__main__":
    main()

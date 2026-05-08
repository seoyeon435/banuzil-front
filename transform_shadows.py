"""
Promote coral shadow rgba() values from the old coral (255,140,122)
to the new tomato coral (255,99,71), bumping opacity by +0.05 so the
new coral reads as confidently as the original on light wash.

Run: python transform_shadows.py
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "src" / "app" / "components"

# rgba(255, 140, 122, A) with optional whitespace and any opacity
SRC_RE = re.compile(
    r"rgba\(\s*255\s*,\s*140\s*,\s*122\s*,\s*([0-9]*\.?[0-9]+)\s*\)"
)


def bump_opacity(alpha: float) -> float:
    return min(round(alpha + 0.05, 3), 1.0)


def replace(match: re.Match[str]) -> str:
    alpha = float(match.group(1))
    return f"rgba(255,99,71,{bump_opacity(alpha)})"


def main() -> None:
    if not ROOT.exists():
        raise SystemExit(f"components root not found: {ROOT}")

    total = 0
    touched: list[tuple[str, int]] = []
    for path in sorted(ROOT.rglob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        new_text, count = SRC_RE.subn(replace, text)
        if count:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            rel = path.relative_to(ROOT.parent.parent.parent)
            touched.append((str(rel), count))
            total += count

    for rel, count in touched:
        print(f"  {count:4d}  {rel}")
    print(f"\nTotal shadow replacements: {total}")


if __name__ == "__main__":
    main()

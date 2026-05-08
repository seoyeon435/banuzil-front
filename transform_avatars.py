"""
Convert small per-name avatars (rounded-full circles with one Korean letter)
from a coral gradient fill to the Bold Coral signature ring style:

    rounded-full bg-gradient-to-br from-[#FF6347] to-[#E84028] ... text-white
        -> rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347] ... text-[#1F1410]

Big full-panel coral elements (LoginPage / SignupPage / AttachmentSurveyPage
left panels) stay untouched: their gradient is on a `w-1/2` or `w-[420px]`
container without `rounded-full`, so the regex below skips them.
"""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent / "src" / "app" / "components"

# Match a class string that contains rounded-full + the coral gradient + text-white
# (the full avatar token). Capture so we can rebuild it.
PATTERN = re.compile(
    r"rounded-full\s+bg-gradient-to-br\s+from-\[#FF6347\]\s+to-\[#E84028\]"
    r"(?P<middle>[^\"]*?)"
    r"text-white"
)


def replace(match: re.Match[str]) -> str:
    middle = match.group("middle")
    return (
        "rounded-full bg-[#FFB89A] ring-2 ring-[#FF6347]"
        + middle
        + "text-[#1F1410]"
    )


def main() -> None:
    if not ROOT.exists():
        raise SystemExit(f"components root not found: {ROOT}")

    total = 0
    touched: list[tuple[str, int]] = []
    for path in sorted(ROOT.rglob("*.tsx")):
        text = path.read_text(encoding="utf-8")
        new_text, count = PATTERN.subn(replace, text)
        if count:
            path.write_text(new_text, encoding="utf-8", newline="\n")
            rel = path.relative_to(ROOT.parent.parent.parent)
            touched.append((str(rel), count))
            total += count

    for rel, count in touched:
        print(f"  {count:4d}  {rel}")
    print(f"\nTotal avatar conversions: {total}")


if __name__ == "__main__":
    main()

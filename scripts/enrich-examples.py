#!/usr/bin/env python3
"""Regenerate exampleEs/exampleEn so every card has a feelable bilingual example."""

from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1] / "src" / "data"

SPANISHISH = re.compile(
    r"[áéíóúñ¿¡]|\b(el|la|los|las|un|una|unos|unas|de|en|a|que|por|para|con|"
    r"mi|tu|su|es|está|soy|voy|quiero|puedo|me|te|se|nos|hola|buenos|buenas|"
    r"no|sí|del|al|muy|más|menos|también|siempre|nunca|hoy|mañana)\b",
    re.I,
)


def looks_spanish(text: str) -> bool:
    return bool(SPANISHISH.search(text))


def is_meta_en(text: str) -> bool:
    f = text.strip().lower()
    if not f:
        return True
    # Real learner prompts like "How are you?" are NOT meta
    if f.endswith("?") and not re.match(
        r"^(how do you|how to|which|what is the difference|when do you)\b", f
    ):
        return False
    if "…" in f or "..." in f:
        return True
    if re.search(
        r"^(most|use|choose|when|which|what|the difference|agree|nouns|adjectives)\b",
        f,
    ):
        return True
    if f.endswith(" are…") or f.endswith(" is…") or " vs " in f:
        return True
    if "(exception)" in f or "(profession)" in f:
        return True
    return False


def is_bad_example(es: str) -> bool:
    t = es.strip()
    if len(t) < 2:
        return True
    lows = t.lower()
    if re.search(
        r"^(or|not|also|often|after|before|accent|irregular|default|example|"
        r"use|masculine|feminine|a \+ el|de \+ el)\b",
        lows,
    ):
        return True
    if re.search(r"\b(in some regions|in many places|see the tip)\b", lows):
        return True
    if not looks_spanish(t) and re.search(
        r"\b(the|and|for|with|from|that|this|are|is|to|don't|don't)\b", lows
    ):
        return True
    # English tip residue mixed in
    if re.search(r"\b(from |though |needed:|change for)\b", lows) and not re.search(
        r"[¿¡]", t
    ):
        if " " in t and looks_spanish(t) and len(t.split()) <= 6:
            # e.g. "la mano, la foto from fotografía" — salvageable but weak
            return True
    return False


ENGLISH_STOP = re.compile(
    r"\b(the|and|for|with|from|that|this|are|is|to|until|after|before|never|"
    r"always|also|often|switch|used|add|fine|universal|informal|roughly|"
    r"lunch|dark|sunset|midday|strangers|latin|america|polish|include|"
    r"exceptions?|default|pattern|learn|gender|article)\b",
    re.I,
)


def mostly_spanish(text: str) -> bool:
    """Reject tip fragments that are mostly English with a Spanish word inside."""
    if not looks_spanish(text):
        return False
    words = re.findall(r"[A-Za-záéíóúñÁÉÍÓÚÑüÜ]+", text)
    if not words:
        return False
    en_hits = sum(1 for w in words if ENGLISH_STOP.match(w))
    # Allow short pure Spanish (Hola, Buenos días)
    if len(words) <= 4 and en_hits == 0:
        return True
    return en_hits <= max(1, len(words) // 4)


def first_spanish_clause(text: str) -> str | None:
    text = text.strip()
    q = re.search(r"¿[^?!]+\?", text)
    if q and mostly_spanish(q.group(0)):
        return q.group(0).strip()
    excl = re.search(r"¡[^!]+!", text)
    if excl and mostly_spanish(excl.group(0)):
        return excl.group(0).strip()

    # Prefer article+noun phrases in tips: "un coche rojo, una casa roja"
    for m in re.finditer(
        r"\b((?:el|la|los|las|un|una|unos|unas|buenos|buenas)\s+[a-záéíóúñü]+(?:\s+[a-záéíóúñü]+){0,4})",
        text,
        re.I,
    ):
        phrase = m.group(1).strip().rstrip(".,;:")
        if len(phrase.split()) >= 2 and mostly_spanish(phrase):
            return phrase[0].upper() + phrase[1:] if phrase[0].islower() else phrase

    # Standalone greetings / short Spanish tokens in tips
    for m in re.finditer(
        r"\b((?:hola|gracias|perdón|disculpe|por favor|de nada|buen[oa]s?\s+\w+|"
        r"hasta\s+\w+|adiós|cuidado|ayuda))\b",
        text,
        re.I,
    ):
        return m.group(1)[0].upper() + m.group(1)[1:]

    chunks = re.split(r"(?<=[.!;])\s+| · |\s+/\s+", text)
    for chunk in chunks:
        c = re.sub(r"^[:\-—]\s*", "", chunk.strip()).rstrip(".,;")
        if len(c) >= 4 and mostly_spanish(c):
            return c
    if mostly_spanish(text) and len(text.strip()) >= 4:
        return text.strip().rstrip(".")
    return None


def extract_from_tip(tip: str) -> str | None:
    tip = tip.strip()
    labeled = re.search(
        r"(?:example|e\.g\.|eg\.|say|try|like|pattern)\s*[:—-]\s*(.+)$",
        tip,
        re.I,
    )
    if labeled:
        found = first_spanish_clause(labeled.group(1))
        if found:
            return found
    if ":" in tip:
        after = tip[tip.index(":") + 1 :].strip()
        # Drop English lead-ins after colon
        after = re.sub(
            r"^(also|e\.g\.|eg\.|for example|exceptions? include)\s*",
            "",
            after,
            flags=re.I,
        )
        found = first_spanish_clause(after)
        if found and not is_bad_example(found):
            return found
    found = first_spanish_clause(tip)
    if found and not is_bad_example(found):
        return found
    for p in re.finditer(r"\(([^)]+)\)", tip):
        found = first_spanish_clause(p.group(1))
        if found and not is_bad_example(found):
            return found
    return None


def primary_spanish(back: str) -> str:
    # Take first alternative
    part = re.split(r"\s*[·/]\s*", back)[0].strip()
    return part


def phrase_score(es: str) -> int:
    """Higher = more 'feelable' example."""
    s = 0
    words = es.split()
    s += min(len(words), 8)
    if re.search(r"[¿¡]", es):
        s += 5
    if re.search(r"\b(el|la|los|las|un|una)\b", es, re.I):
        s += 3
    if re.search(r"\b(es|está|soy|voy|quiero|puedo|me|te)\b", es, re.I):
        s += 2
    if is_bad_example(es):
        s -= 20
    if len(words) <= 1:
        s -= 2
    return s


def gloss_en(front: str, back: str, tip: str) -> str:
    f = front.strip()
    # Drop parenthetical teaching tags: How are you? (estar) → How are you?
    f_clean = re.sub(r"\s*\([^)]*\)\s*$", "", f).strip()
    m = re.search(r'[“"]([^”"]+)[”"]', f_clean)
    if m and not is_meta_en(m.group(1)):
        return m.group(1)
    if not is_meta_en(f_clean):
        return f_clean
    if not is_meta_en(f):
        return f
    b = back.strip()
    if "(" in b:
        inner = re.search(r"\(([^)]+)\)", b)
        if inner and looks_spanish(inner.group(1)):
            return f"Like {inner.group(1)}"
    return "In a real sentence"


# Hand-crafted feelable examples for thin vocab tips
OVERRIDES: dict[tuple[str, str], tuple[str, str]] = {
    ("red", "rojo / roja"): ("Un coche rojo · Una casa roja", "A red car · A red house"),
    ("blue", "azul"): ("El cielo es azul.", "The sky is blue."),
    ("yellow", "amarillo / amarilla"): (
        "Un plátano amarillo · Una flor amarilla",
        "A yellow banana · A yellow flower",
    ),
    ("green", "verde"): ("El árbol es verde.", "The tree is green."),
    ("orange", "naranja"): ("Una camiseta naranja", "An orange T-shirt"),
    ("purple", "morado / morada · púrpura"): ("Una falda morada", "A purple skirt"),
    ("pink", "rosa · rosado / rosada"): ("Una flor rosa", "A pink flower"),
    ("brown", "marrón · café"): ("El café es marrón.", "Coffee is brown."),
    ("black", "negro / negra"): ("Un gato negro", "A black cat"),
    ("white", "blanco / blanca"): ("Una camisa blanca", "A white shirt"),
    ("gray", "gris"): ("Un día gris", "A gray day"),
    ("gray / grey", "gris"): ("Un día gris", "A gray day"),
    ("gold", "dorado / dorada · de oro"): ("Un anillo dorado", "A gold ring"),
    ("silver", "plateado / plateada · de plata"): (
        "Un reloj plateado",
        "A silver watch",
    ),
    ("Monday", "lunes"): ("El lunes trabajo.", "I work on Monday."),
    ("Tuesday", "martes"): ("El martes tengo clase.", "I have class on Tuesday."),
    ("Wednesday", "miércoles"): ("El miércoles voy al gym.", "On Wednesday I go to the gym."),
    ("Thursday", "jueves"): ("El jueves ceno fuera.", "On Thursday I eat out."),
    ("Friday", "viernes"): ("El viernes salgo con amigos.", "On Friday I go out with friends."),
    ("Saturday", "sábado"): ("El sábado descanso.", "On Saturday I rest."),
    ("Sunday", "domingo"): ("El domingo veo a mi familia.", "On Sunday I see my family."),
}


def pick_example(front: str, back: str, tip: str, cur_es: str, cur_en: str) -> tuple[str, str]:
    key = (front.strip(), back.strip())
    if key in OVERRIDES:
        return OVERRIDES[key]

    tip_es = extract_from_tip(tip) if tip else None
    if tip_es and not mostly_spanish(tip_es):
        tip_es = None
    back_es = primary_spanish(back)
    candidates: list[tuple[int, str, str]] = []

    # Card face itself is often the best example for phrase decks
    if back_es and mostly_spanish(back_es) and not is_bad_example(back_es):
        en = gloss_en(front, back, tip)
        boost = 6 if (len(back_es.split()) >= 2 or re.search(r"[¿¡]", back_es)) else 2
        # Short greetings / single words: still good when that's the phrase
        if len(back_es.split()) == 1 and len(back_es) >= 3:
            boost = 5
        candidates.append((phrase_score(back_es) + boost, back_es, en))

    if tip_es and mostly_spanish(tip_es):
        en = gloss_en(front, back, tip)
        # Tip wins when it adds a fuller sentence than the card face
        tip_boost = 5 if len(tip_es.split()) > len(back_es.split()) + 1 else 2
        candidates.append((phrase_score(tip_es) + tip_boost, tip_es, en))

    if cur_es and not is_bad_example(cur_es) and mostly_spanish(cur_es):
        en = cur_en if cur_en and not is_meta_en(cur_en) else gloss_en(front, back, tip)
        candidates.append((phrase_score(cur_es), cur_es, en))

    if not candidates:
        return back_es or back, gloss_en(front, back, tip)

    candidates.sort(key=lambda x: x[0], reverse=True)
    _, es, en = candidates[0]
    return es.strip(), en.strip()


CARD_RE = re.compile(
    r"\{([^{}]*?)\}",
    re.S,
)


def process_file(path: Path) -> int:
    text = path.read_text()
    changed = 0

    def repl(m: re.Match[str]) -> str:
        nonlocal changed
        block = m.group(0)
        # Only card-like objects with front/back or en/es
        if "tip:" not in block:
            return block
        if "front:" not in block and "en:" not in block:
            return block

        def get(field: str) -> str | None:
            mm = re.search(rf"{field}:\s*'((?:\\'|[^'])*)'", block)
            if not mm:
                mm = re.search(rf'{field}:\s*"((?:\\"|[^"])*)"', block)
            if not mm:
                return None
            return mm.group(1).replace("\\'", "'").replace('\\"', '"')

        front = get("front") or get("en")
        back = get("back") or get("es")
        tip = get("tip") or ""
        if not front or not back:
            return block

        cur_es = get("exampleEs") or ""
        cur_en = get("exampleEn") or ""
        new_es, new_en = pick_example(front, back, tip, cur_es, cur_en)

        def esc(s: str) -> str:
            return s.replace("\\", "\\\\").replace("'", "\\'")

        if "exampleEs:" in block:
            new_block = re.sub(
                r"exampleEs:\s*'((?:\\'|[^'])*)'",
                f"exampleEs: '{esc(new_es)}'",
                block,
                count=1,
            )
            new_block = re.sub(
                r"exampleEn:\s*'((?:\\'|[^'])*)'",
                f"exampleEn: '{esc(new_en)}'",
                new_block,
                count=1,
            )
        else:
            # Insert before tip:
            new_block = re.sub(
                r"(\n\s*)tip:",
                f"\\1exampleEs: '{esc(new_es)}',\\1exampleEn: '{esc(new_en)}',\\1tip:",
                block,
                count=1,
            )
        if new_block != block:
            changed += 1
        return new_block

    # Process nested braces carefully: iterative for depth-1 objects in arrays
    # Split on top-level objects by scanning
    out = []
    i = 0
    while i < len(text):
        if text[i] == "{":
            depth = 0
            j = i
            while j < len(text):
                if text[j] == "{":
                    depth += 1
                elif text[j] == "}":
                    depth -= 1
                    if depth == 0:
                        j += 1
                        break
                j += 1
            chunk = text[i:j]
            if "tip:" in chunk and ("front:" in chunk or "\nen:" in chunk or " en:" in chunk):
                out.append(repl(re.match(r"(.*)", chunk, re.S)))  # type: ignore
                # fix: just call logic directly
            else:
                out.append(chunk)
            i = j
        else:
            out.append(text[i])
            i += 1

    # Rewrite properly without the broken repl wrapper
    return rewrite(path)


def rewrite(path: Path) -> int:
    text = path.read_text()
    changed = 0
    out: list[str] = []
    i = 0
    n = len(text)
    while i < n:
        if text[i] == "{":
            depth = 0
            j = i
            in_str = False
            quote = ""
            escape = False
            while j < n:
                ch = text[j]
                if in_str:
                    if escape:
                        escape = False
                    elif ch == "\\":
                        escape = True
                    elif ch == quote:
                        in_str = False
                else:
                    if ch in "'\"":
                        in_str = True
                        quote = ch
                    elif ch == "{":
                        depth += 1
                    elif ch == "}":
                        depth -= 1
                        if depth == 0:
                            j += 1
                            break
                j += 1
            block = text[i:j]
            if "tip:" in block and (
                "front:" in block or re.search(r"\ben:\s*'", block)
            ):

                def get(field: str) -> str | None:
                    mm = re.search(rf"{field}:\s*'((?:\\'|[^'])*)'", block)
                    return None if not mm else mm.group(1).replace("\\'", "'")

                front = get("front") or get("en")
                back = get("back") or get("es")
                tip = get("tip") or ""
                if front and back:
                    cur_es = get("exampleEs") or ""
                    cur_en = get("exampleEn") or ""
                    new_es, new_en = pick_example(front, back, tip, cur_es, cur_en)

                    def esc(s: str) -> str:
                        return s.replace("\\", "\\\\").replace("'", "\\'")

                    new_block = block
                    if "exampleEs:" in block:
                        new_block = re.sub(
                            r"exampleEs:\s*'((?:\\'|[^'])*)'",
                            f"exampleEs: '{esc(new_es)}'",
                            new_block,
                            count=1,
                        )
                        if "exampleEn:" in new_block:
                            new_block = re.sub(
                                r"exampleEn:\s*'((?:\\'|[^'])*)'",
                                f"exampleEn: '{esc(new_en)}'",
                                new_block,
                                count=1,
                            )
                        else:
                            new_block = re.sub(
                                r"(exampleEs:\s*'[^']*',)",
                                f"\\1\n    exampleEn: '{esc(new_en)}',",
                                new_block,
                                count=1,
                            )
                    else:
                        new_block = re.sub(
                            r"(\n\s*)tip:",
                            f"\\1exampleEs: '{esc(new_es)}',\\1exampleEn: '{esc(new_en)}',\\1tip:",
                            new_block,
                            count=1,
                        )
                    if new_block != block:
                        changed += 1
                    out.append(new_block)
                else:
                    out.append(block)
            else:
                out.append(block)
            i = j
        else:
            out.append(text[i])
            i += 1
    path.write_text("".join(out))
    return changed


def main() -> None:
    total = 0
    for name in (
        "cards.ts",
        "dailyPhrases.ts",
        "colors.ts",
        "grammar.ts",
        "foundations.ts",
    ):
        path = ROOT / name
        n = rewrite(path)
        print(f"{name}: updated {n} cards")
        total += n
    print(f"total {total}")


if __name__ == "__main__":
    main()

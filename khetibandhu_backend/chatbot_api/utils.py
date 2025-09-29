import json, re, unicodedata, random
from fuzzywuzzy import fuzz
from pathlib import Path

BASE = Path(__file__).resolve().parent

with open(BASE / "kb.json", "r", encoding="utf-8") as f:
    KB = json.load(f)

def normalize_text(text: str) -> str:
    return unicodedata.normalize("NFC", (text or "").lower().strip())

def clean_text(text: str) -> str:
    text = re.sub(r"[^\w\s]", " ", text, flags=re.UNICODE)
    return " ".join(text.split())

def smart_match(message: str, entry: dict) -> float:
    msg = clean_text(message)
    title = clean_text(entry.get("title", ""))
    content = clean_text(entry.get("content", ""))

    scores = []
    for kw in entry.get("keywords", []):
        ck = clean_text(kw)
        if ck and (ck in msg or msg in ck):
            scores.append(95)
        else:
            scores.append(fuzz.partial_ratio(ck, msg))

    scores.append(fuzz.partial_ratio(msg, title))
    scores.append(fuzz.partial_ratio(msg, content[:150]))
    return max(scores) if scores else 0

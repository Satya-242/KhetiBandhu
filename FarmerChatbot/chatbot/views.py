from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import random

from .utils import KB, normalize_text, smart_match

def index(request):
    return render(request, "chatbot/index.html")

@api_view(["POST"])
def chat(request):
    user_id = request.data.get("user_id", "anon")
    message = normalize_text(request.data.get("message", ""))
    lang = request.data.get("language", "en")

    entries = [e for e in KB if e.get("language") == lang]
    if not entries:
        return Response({"reply": "Sorry, no advice in this language."})

    scored = [(e, smart_match(message, e)) for e in entries]
    scored.sort(key=lambda x: x[1], reverse=True)

    if scored and scored[0][1] > 60:
        best = scored[0][0]
        return Response({"reply": best["content"], "source": best["title"]})
    else:
        fallback = random.choice(entries)
        return Response({"reply": fallback["content"], "source": fallback["title"]})

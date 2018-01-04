from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import ensure_csrf_cookie


@ensure_csrf_cookie
def main(request, *args, **kwargs):
    return render(request, "index.html")

def serviceWorker(request, *args, **kwargs):
    return render_to_response("sw.js", content_type="text/javascript")

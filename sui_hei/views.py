from django.shortcuts import render, render_to_response
from django.views.decorators.csrf import ensure_csrf_cookie
from cindy.settings import DEBUG


@ensure_csrf_cookie
def main(request, *args, **kwargs):
    if DEBUG:
        return render(request, "index_debug.html")
    return render(request, "index_prod.html")

def serviceWorker(request, *args, **kwargs):
    return render_to_response("sw.js", content_type="text/javascript")

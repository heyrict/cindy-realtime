from django.shortcuts import render, render_to_response


def main(request, *args, **kwargs):
    return render(request, "index.html")

def serviceWorker(request, *args, **kwargs):
    return render_to_response("sw.js", content_type="text/javascript")

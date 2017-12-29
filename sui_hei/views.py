from django.shortcuts import render


def simple(request, *args, **kwargs):
    return render(request, 'main.html')

from django.shortcuts import render

from .models import Post
from django.http import HttpResponse

# Create your views here.

def posts_list(req):
    posts = Post.objects.all().order_by('-date')
    return render(req, 'posts/posts_list.html', {'posts': posts})

def post_page(req, slug):
    post = Post.objects.get(slug=slug)
    return render(req, 'posts/post_page.html', {'post': post})

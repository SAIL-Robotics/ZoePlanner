from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext

def index(request):

	val = request.POST.get('box1', False)

	print val

	return render_to_response('maplayout.html', locals(), RequestContext(request))



# Create your views here.

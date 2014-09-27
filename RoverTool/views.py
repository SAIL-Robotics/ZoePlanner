from pymongo import Connection
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
import datetime
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
import json

@csrf_exempt
def index(request):
    c = {}
    c.update(csrf(request))
    markers = []
    plan_name = ''
    task_points = []
    if request.is_ajax():
        if request.method == "POST":
            plan_name = request.POST['planName']
            markers = json.loads(request.POST.get('markers'))
        else:
            print 'why you do this!!'

    database_name = "rover"
    collection_name = "plans"

    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    plan = {"planName" : plan_name, "timeStamp" : time, "markers" : markers}

    collection.save(plan)
    
    #print plan
    print "SAved yeyyyyyY1!!!"

    return render_to_response('maplayout.html', c, RequestContext(request))



# Create your views here.

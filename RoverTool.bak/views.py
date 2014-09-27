from pymongo import Connection
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
import datetime

def index(request):

    # database_name = "rover"
    # connection = Connection()

    # plan_name = request.POST.get('planName', False)
    # now = datetime.datetime.now()
    # time = now.strftime("%Y-%m-%d %H:%M:%S")

    # db = connection[database_name]
    # todo = db['plans']
    # plan = {"planName" : plan_name, "timeStamp" : time}

    # todo.save(plan)
    print "SAved yeyyyyyY1!!!"

    return render_to_response('maplayout.html', locals(), RequestContext(request))



# Create your views here.

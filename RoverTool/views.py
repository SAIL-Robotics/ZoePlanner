from pymongo import Connection
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
import datetime
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
import json
from django.http import *

database_name = "rover"
collection_name = "plans"

@csrf_exempt
def index(request):
    c = {}
    c.update(csrf(request))
    data = []

    if request.is_ajax():
        data = get_plan_detail()
        return HttpResponse(json.dumps(data), content_type = "application/json")

    return render_to_response('maplayout.html', c, RequestContext(request))

#fuction that handle the ajax request for save operation and getMarkerInfo operation(left pane single click on plan name)
@csrf_exempt
def DBOperation(request):
    c = {}
    c.update(csrf(request))
    
    markers = []
    plan_name = ''
    plan_desc = ''
    task_points = []
    data = []

    if request.is_ajax():
        if request.method == "POST":
            if request.POST['operation'] == 'save':
                plan_name = request.POST['planName']
                plan_desc = request.POST['planDesc']
                markers = json.loads(request.POST.get('markers'))
                saveToDB(plan_name, plan_desc, markers)
                data = get_plan_detail()                                    #update the let pane. getting plan names from 
            elif request.POST['operation'] == 'getMarkerInfo':
                plan_name = request.POST['planName']
                data = getMarker(plan_name)
            elif request.POST['operation'] == 'validatePlanName':
                plan_name = request.POST.get('planName')
                data = validatePlanName(plan_name)
            elif request.POST['operation'] == 'deletePlan':
                plan_name = request.POST['planName']
                deletePlan(plan_name)
                data = get_plan_detail()
                print data['planName']
            elif request.POST['operation'] == 'duplicate':
                plan_name = request.POST['planName']
                new_plan_name = request.POST['newPlanName']
                plan_desc = request.POST['planDesc']
                duplicatePlan(plan_name, new_plan_name, plan_desc)
                data = get_plan_detail()
            elif request.POST['operation'] == 'getPlanInfo':
                plan_name = request.POST['planName']
                data = get_plan_info(plan_name)

        else:
            print 'why you do this!!'
    
    return HttpResponse(json.dumps(data), content_type = "application/json")


def saveToDB(plan_name, plan_desc, markers):    
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    plan = {"planName" : plan_name, "planDescription" : plan_desc, "timeStamp" : time, "markers" : markers}

    collection.save(plan)

#getting all the markers information from MongoDB
def getMarker(plan_name):    
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    markersCursor = collection.find_one({'planName' : plan_name}, {'_id':0, 'markers':1})
    print markersCursor['markers']

    return markersCursor['markers']

def duplicatePlan(plan_name, new_plan_name, plan_desc):
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.find_one({'planName' : plan_name}, {'_id':0})
    markersCursor['planName'] = new_plan_name
    markersCursor['planDescription'] = plan_desc
    markersCursor['timeStamp'] = time
    collection.save(markersCursor)

def deletePlan(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    collection.remove({'planName' : plan_name});

def validatePlanName(plan_name):
    data = {}
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    data['count'] = collection.find({"planName": plan_name}).count()

    return data

def get_plan_info(plan_name):
    data = {}
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    cursor = collection.find_one({"planName": plan_name},{"_id" : 0, "planDescription" : 1, "timeStamp" : 1})

    return cursor

# Create your views here.
@csrf_exempt
def test(request):
    c = {}
    c.update(csrf(request))
    print "test working"
    
    data = {}
    data['a'] = 'd'

    if request.is_ajax():
        print "asd"
        #return HttpResponse(json.dumps(data), content_type = "application/json")

    return render_to_response('test.html', c, RequestContext(request))


@csrf_exempt
def jsonData(request):

    c = {}
    c.update(csrf(request))
    data = {}
    planname_array = []
    tot_markers = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name]
    planListCursor = collection.find({},{'_id' : 0, 'planName' : 1})

    for record in planListCursor:
        planname_array.append(record['planName'])

        markersCursor = collection.find_one({'planName' : record['planName']}, {'_id':0, 'markers':1})
        tot_markers.append(len(markersCursor['markers']))

    data['planName'] = planname_array
    data['totalMarkers'] = tot_markers

    return HttpResponse(json.dumps(data), content_type = "application/json")

#getting all the plan name and count of markers in that plan from MongoDB
def get_plan_detail():

    data = {}
    planname_array = []
    tot_markers = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name]
    planListCursor = collection.find({},{'_id' : 0, 'planName' : 1})

    for record in planListCursor:
        planname_array.append(record['planName'])

        markersCursor = collection.find_one({'planName' : record['planName']}, {'_id':0, 'markers':1})
        tot_markers.append(len(markersCursor['markers']))

    data['planName'] = planname_array
    data['totalMarkers'] = tot_markers

    return data
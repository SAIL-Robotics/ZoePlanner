from pymongo import Connection
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
import datetime
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
import json, ast
from django.http import *
#from lxml import etree
#from pykml.parser import Schema
#from pykml.factory import KML_ElementMaker as KML
#from pykml.factory import GX_ElementMaker as GX
#import simplekml

database_name = "rover"
collection_name = "plans"
collection_name_operation = "operations"
template_collection = "templates"

@csrf_exempt
def index(request):
    c = {}
    c.update(csrf(request))
    data = []

    if request.is_ajax():
        if request.method == "POST":
            if request.POST['operation'] == 'planPane':
                data = get_plan_detail()
            if request.POST['operation'] == 'operationConfig':
                data = get_operation_detail()

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
    template_name = ''

    if request.is_ajax():
        if request.method == "POST":
            if request.POST['operation'] == 'save':
                plan_name = request.POST['planName']
                plan_desc = request.POST['planDesc']
                plan_name_update = request.POST['planNameUpdate']
                markers = json.loads(request.POST.get('markers'))
                saveToDB(plan_name, plan_name_update, plan_desc, markers)
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
            elif request.POST['operation'] == 'deletePlanForever':
                plan_name = request.POST['planName']
                delete_plan_forever(plan_name)
                data = get_deleted_plan_detail()
            elif request.POST['operation'] == 'recoverPlan':
                plan_name = request.POST['planName']
                recover_plan(plan_name)
                data = get_deleted_plan_detail()
            elif request.POST['operation'] == 'duplicate':
                plan_name = request.POST['planName']
                new_plan_name = request.POST['newPlanName']
                plan_desc = request.POST['planDesc']
                duplicatePlan(plan_name, new_plan_name, plan_desc)
                data = get_plan_detail()
            elif request.POST['operation'] == 'getPlanInfo':
                plan_name = request.POST['planName']
                data = get_plan_info(plan_name)
            elif request.POST['operation'] == 'renamePlan':
                plan_name = request.POST['planName']
                new_plan_name = request.POST['newName']
                renamePlan(plan_name, new_plan_name)
                data = get_plan_detail()
            elif request.POST['operation'] == 'downloadAsKML':
                plan_name = request.POST['planName']
                data = export_kml(plan_name)
            elif request.POST['operation'] == 'getPlanList':
                data = get_plan_detail()
            elif request.POST['operation'] == 'getDeletedPlanList':
                data = get_deleted_plan_detail()
            elif request.POST['operation'] == 'getOperationList':
                data = get_operation_detail()
            elif request.POST['operation'] == 'createTemplate':
                template_name = request.POST['name'] 
                markers = json.loads(request.POST.get('markers'))
                saveTemplate(template_name,markers)  
            elif request.POST['operation'] == 'operationConfig':
                BUF = request.POST['BUF']
                MMRS = request.POST['MMRS']
                science_image = request.POST['Science Image']
                image_panorama = request.POST['Image Panorama']
                spectra_panorama = request.POST['Spectra Panorama']
                precise_Move = request.POST['Precise Move']
                smart_target = request.POST['Smart Target']
                operationConfigSave(BUF, MMRS, science_image, image_panorama, spectra_panorama, precise_Move, smart_target)
                #data = get_operation_detail()
            
        else:
            print 'why you do this!!'
    
    return HttpResponse(json.dumps(data), content_type = "application/json")


def saveToDB(plan_name, plan_name_update, plan_desc, markers):    
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    
    if validatePlanName(plan_name_update)['count'] == 0:
        plan = {"planName" : plan_name, "planDescription" : plan_desc, "timeStamp" : time, "markers" : markers}
        collection.save(plan)
    else:
        print "update"
        update_plan(plan_name_update, plan_desc, markers)

def saveTemplate(template_name,markers):
    connection = Connection()
    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")
    db = connection[database_name]
    collection = db[template_collection]
    template_details = {"template_name":template_name,"markers":markers}
    collection.save(template_details)   

def update_plan(plan_name, plan_desc, markers):
    connection = Connection()

    #now = datetime.datetime.now()
    #time = now.strftime("%Y-%m-%d %H:%M:%S")
    print "in update"
    db = connection[database_name]
    collection = db[collection_name]
    print plan_name
    print markers
    markersCursor = collection.update({'planName' : plan_name}, {'$set' : {'markers' : markers}})

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


def renamePlan(plan_name, new_plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name}, {'$set' : {'planName' : new_plan_name}})

def deletePlan(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name}, {'$set' : {'deleted' : 1}})
    #collection.remove({'planName' : plan_name});

def delete_plan_forever(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    collection.remove({'planName' : plan_name});    

def recover_plan(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name}, {'$set' : {'deleted' : 0}})

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

def createTemplate(template_name):    
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name_template]

    print "heloooooooooooooooooooooooooo"
    print template_name
    #plan = {"planName" : plan_name, "planDescription" : plan_desc, "timeStamp" : time, "markers" : markers}
    #collection.save(plan)

def operationConfigSave(BUF, MMRS, science_image, image_panorama, spectra_panorama, precise_Move, smart_target):
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name_operation]
    collection.remove({})

    operations = {"BUFConfig" : BUF, "MMRSConfig" : MMRS, "scienceImageConfig" : science_image, "imagePanoramaConfig" : image_panorama,
                     "spectraPanoramaConfig" : spectra_panorama, "preciseMoveConfig" : precise_Move, "smartTargetConfig" : smart_target}
    collection.save(operations)

@csrf_exempt
def jsonData(request):

    c = {}
    c.update(csrf(request))
    data = {}
    planname_array = []
    tot_markers = []

    plan_name = request.POST['planName']
    new_plan_name = request.POST['newPlanName']

    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.find_one({'planName' : plan_name})
    markersCursor['planName'] = new_plan_name
    collection.save(markersCursor)
    # connection = Connection()
    # db = connection[database_name]
    # collection = db[collection_name]
    # planListCursor = collection.find({},{'_id' : 0, 'planName' : 1})

    # for record in planListCursor:
    #     planname_array.append(record['planName'])

    #     markersCursor = collection.find_one({'planName' : record['planName']}, {'_id':0, 'markers':1})
    #     tot_markers.append(len(markersCursor['markers']))

    # data['planName'] = planname_array
    # data['totalMarkers'] = tot_markers

    return HttpResponse(json.dumps("data"), content_type = "application/json")

#getting all the plan name and count of markers in that plan from MongoDB
def get_plan_detail():

    data = {}
    planname_array = []
    tot_markers = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name]
    planListCursor = collection.find({'deleted' : {"$ne" : 1}},{'_id' : 0, 'planName' : 1})

    for record in planListCursor:
        planname_array.append(record['planName'])

        markersCursor = collection.find_one({'planName' : record['planName']}, {'_id':0, 'markers':1})
        tot_markers.append(len(markersCursor['markers']))

    data['planName'] = planname_array
    data['totalMarkers'] = tot_markers

    return data

def get_deleted_plan_detail():
    data = {}
    planname_array = []
    tot_markers = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name]
    planListCursor = collection.find({'deleted' : 1},{'_id' : 0, 'planName' : 1})

    for record in planListCursor:
        planname_array.append(record['planName'])

     #   markersCursor = collection.find_one({'planName' : record['planName']}, {'_id':0, 'markers':1})
      #  tot_markers.append(len(markersCursor['markers']))

    data['planName'] = planname_array
    #data['totalMarkers'] = tot_markers

    return data

def get_template_detail():
    data = {}
    templateName_array = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name_template]
    templateListCursor = collection.find({},{'_id' : 0, 'templateName' : 1})

    for record in templateListCursor:
        templateName_array.append(record['templateName'])

    data['templateName'] = templateName_array

    return data    

def get_operation_detail():
    data = {}
    operation_name_array = []
    operation_value_array = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name_operation]
    operationListCursor = collection.find({},{'_id' : 0})

    print operationListCursor[0].keys()
    for key in operationListCursor[0].keys():
        operation_name_array.append(key)
        operation_value_array.append(operationListCursor[0][key])
    
        #templateName_array.append(record['templateName'])

    data['operationName'] = operation_name_array
    data['operationValue'] = operation_value_array

    return data  

def export_kml(plan_name):

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name]
    
    s_kml = simplekml.Kml()
    cursor = collection.find_one({'planName' : plan_name},{'_id' : 0})
    cursor = ast.literal_eval(json.dumps(cursor))   #removing unicode 'u' from the json
    #fld = KML.Folder()
    for marker in cursor['markers']:
        s_kml.newpoint(name="Marker", description=str(marker).strip('{}'),
                   coords=[(float(marker['lng']),float(marker['lat']),0)])
        print marker['lng'],marker['lat']
    return s_kml.kml()

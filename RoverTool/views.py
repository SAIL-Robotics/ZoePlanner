from pymongo import Connection
from django.shortcuts import render
from django.shortcuts import render_to_response
from django.template import RequestContext
import datetime
from django.core.context_processors import csrf
from django.views.decorators.csrf import csrf_exempt
import json, ast
from django.http import *
import os
import commands
import cgi, cgitb
import re
import simplekml
from bs4 import BeautifulSoup

database_name = "rover"
collection_name = "plans"
collection_name_operation = "operations"
template_collection = "templates"

@csrf_exempt
def viewResults(request):
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

    return render_to_response('maplayout2.html', c, RequestContext(request))

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

@csrf_exempt
def administratorControl(request):
    c = {}
    c.update(csrf(request))
    data = []

    filedata = request.FILES.get("ipl")
    locationdata = request.FILES.get("bpl")
    if request.is_ajax():
        if request.method == "POST":
            if request.POST['operation'] == 'getFileContent':
                data = get_kml_filecontent()
            if request.POST['operation'] == 'removeContent':
                data = remove_kml_filecontent()

        return HttpResponse(json.dumps(data), content_type = "application/json")                
    
    if filedata != None:
        if filedata.file: # field really is an upload
            with file("siteInformation.kml", 'w') as outfile:
                outfile.write(filedata.file.read())
            pushKmlToMongo()
    if locationdata != None:
            if locationdata.file:
                filename = str(locationdata).split(".")[0]
                
                with file("locations.txt","w") as outfileLocation:
                    outfileLocation.write(locationdata.file.read())

                pushPlanToMongo(filename)

    return render_to_response('adminPage.html', c, RequestContext(request))
 
@csrf_exempt
def pushKmlToMongo():
    data = {}
    connection = Connection()

    db = connection["rover"]
    collection = db["siteInfo"]
    text_content = ""
    filename = "siteInformation.kml"

    #WARNING : DELETING ALL RECORD
    collection.remove({})

    with open(filename, "r") as ins:
        
        for line in ins:
            array = []
            data = {}
            text_content = text_content + line
            #print line
            if re.search(r"^site", line):
                siteName = line
            else:
                for points in line.split("#"):
                    points = points.replace("\n", "")
                    array.append(points)
                    siteName = siteName.replace("\n", "")
                    data['siteName'] = siteName
                    data['coords'] = array

            if data != {}:
                collection.save(data)
        #print text_content

def pushPlanToMongo(planName):
    text_content = ""
    filename = "locations.txt"
    
    marker = []
    
    with open(filename, "r") as fobj:
        text = fobj.read()

    y=BeautifulSoup(text)
    cnt =1
    for data in y.findAll("coordinates"):
        value = {}
                
        #value["markerName"] = data.find("name").get_text()
        value["markerName"] = "AT15-"+ str(cnt)
        latitudelongitude = data.get_text().split(",0")[0]
        lati = latitudelongitude.split(",")[1]
        longi = latitudelongitude.split(",")[0]
        value['lat'] = float(lati)
        value['lng'] = float(longi)
        marker.append(value)
        cnt = cnt + 1
    plan_desc = "Created from import file"
    saveToDB(planName, "", plan_desc, marker,"")
    

def get_kml_filecontent():
    data = {}
    connection = Connection()

    db = connection["rover"]
    collection = db["siteInfo"]
    
    filename = "siteInformation.kml"
    text_content = ""
    data = {}

    with open(filename, "r") as ins:
        for line in ins:
            text_content = text_content + line
    
    data['file'] = text_content
    return data

def remove_kml_filecontent():
    connection = Connection()

    db = connection["rover"]
    collection = db["siteInfo"]

    #WARNING : DELETING ALL RECORD
    collection.remove({})

def read_site_coords():
    data = {}
    connection = Connection()
    db = connection["rover"]
    collection = db["siteInfo"]
    cursor = collection.find({},{'_id' : 0})

    siteName = []
    coords = []
    for record in cursor:
        siteName.append(record['siteName'])
        coords.append(record['coords'])

    data['siteName'] = siteName
    data['coords'] = coords

    #print data
    return data

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
                plan_date = request.POST['executionDate']
                #print '**********'
                #print plan_date
                plan_name_update = request.POST['planNameUpdate']
                markers = json.loads(request.POST.get('markers'))
                saveToDB(plan_name, plan_name_update, plan_desc, markers,plan_date)
                data = get_plan_detail()                                    #update the let pane. getting plan names from 
            elif request.POST['operation'] == 'getMarkerInfo':
                plan_name = request.POST['planName']
                data = getMarker(plan_name)
            elif request.POST['operation'] == 'validatePlanName':
                plan_name = request.POST.get('planName')
                data = validatePlanName(plan_name)
            elif request.POST['operation'] == 'validateTemplateName':
                template_name = request.POST.get('template_name')
                #print "-----------------------"
                #print template_name
                data = validateTemplateName(template_name)
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
            elif request.POST['operation'] == 'downloadAsOS':
                plan_name = request.POST['planName']
                data = export_os(plan_name)
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
                MMRS1 = request.POST['MMRS1']
                MMRS2 = request.POST['MMRS2']
                MMRS3 = request.POST['MMRS3']
                science_image1 = request.POST['Science Image1']
                science_image2 = request.POST['Science Image2']
                image_panorama1 = request.POST['Image Panorama1']
                image_panorama2 = request.POST['Image Panorama2']
                image_panorama3 = request.POST['Image Panorama3']
                image_panorama4 = request.POST['Image Panorama4']
                spectra_panorama1 = request.POST['Spectra Panorama1']
                spectra_panorama2 = request.POST['Spectra Panorama2']
                spectra_panorama3 = request.POST['Spectra Panorama3']
                spectra_panorama4 = request.POST['Spectra Panorama4']
                spectra_panorama5 = request.POST['Spectra Panorama5']
                precise_Move = request.POST['Precise Move']
                smart_target = request.POST['Smart Target']
                marker_name = request.POST['Marker Name']
                drill_value = request.POST['Drill']
                nav_cam = request.POST['Nav Cam']
                operationConfigSave(BUF, MMRS1, MMRS2, MMRS3, science_image1, science_image2, image_panorama1, image_panorama2, image_panorama3, image_panorama4, spectra_panorama1, spectra_panorama2, spectra_panorama3, spectra_panorama4, spectra_panorama5, precise_Move, smart_target,marker_name,drill_value,nav_cam)
                data = get_operation_detail()
            elif request.POST['operation'] == "fetchTemplates":
                data = fetch_templates()
            elif request.POST['operation'] == "getTemplateDetails":
                template_name = request.POST['template_name'] 
                data = get_template_details(template_name)
            elif request.POST['operation'] == "loadSiteCoords":
                #print "edhooo"
                data = read_site_coords()
        else:
            print 'why you do this!!'
    
    return HttpResponse(json.dumps(data), content_type = "application/json")



def saveToDB(plan_name, plan_name_update, plan_desc, markers,plan_date):    
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    #print plan_name
    if plan_name == "":
        plan_name = plan_name_update
    if plan_date == "":
        plan_date = time

    #print "validate ", validatePlanName(plan_name)['count']

    if validatePlanName(plan_name_update)['count'] == 0:
        #print "inside save"
        plan = {"planName" : plan_name, "planDescription" : plan_desc, "timeStamp" : time, "markers" : markers, "planDate" : plan_date, "deleted" : 0}
        collection.save(plan)
    else:
        #print "update"
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
    #print "in update"
    db = connection[database_name]
    collection = db[collection_name]
    #print plan_name
    #print markers
    markersCursor = collection.update({'planName' : plan_name, 'deleted' : 0}, {'$set' : {'markers' : markers}})

#getting all the markers information from MongoDB
def getMarker(plan_name):    
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    markersCursor = collection.find_one({'planName' : plan_name, 'deleted' : 0}, {'_id':0, 'markers':1})
    #print markersCursor['markers']

    return markersCursor['markers']

def duplicatePlan(plan_name, new_plan_name, plan_desc):
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.find_one({'planName' : plan_name, 'deleted' : 0}, {'_id':0})
    markersCursor['planName'] = new_plan_name
    markersCursor['planDescription'] = plan_desc
    markersCursor['timeStamp'] = time
    collection.save(markersCursor)


def renamePlan(plan_name, new_plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name, 'deleted' : 0}, {'$set' : {'planName' : new_plan_name}})

def deletePlan(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name, 'deleted' : 0}, {'$set' : {'deleted' : 1}})
    #collection.remove({'planName' : plan_name});

def delete_plan_forever(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    collection.remove({'planName' : plan_name, 'deleted' : 1});    

def recover_plan(plan_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]
    markersCursor = collection.update({'planName' : plan_name, 'deleted' : 1}, {'$set' : {'deleted' : 0}})

def validatePlanName(plan_name):
    data = {}
    connection = Connection()
    flag = 0
    db = connection[database_name]
    collection = db[collection_name]

    active_plan = collection.find({"planName": plan_name, 'deleted' : 0}).count()
    trash_plan = collection.find({"planName": plan_name, "deleted" : 1}).count()

    data['count'] = collection.find({"planName": plan_name, 'deleted' : 0}).count()

    if trash_plan > 0 and active_plan > 0:
        data['count'] = 1        
        #print "hereeee"

    if trash_plan > 0 and active_plan == 0:
        data['count'] = 0
        #print "ingathaan"

    return data

def is_deleted_plan(plan_name):
    data = {}
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    data['count'] = collection.find({"planName": plan_name, "deleted" : 1}).count()

    return data

def validateTemplateName(template_name):
    data = {}
    connection = Connection()
    db = connection[database_name]
    collection = db[template_collection]
    data['count'] = collection.find({"template_name": template_name}).count()
    return data


def get_plan_info(plan_name):
    data = {}
    connection = Connection()

    db = connection[database_name]
    collection = db[collection_name]

    cursor = collection.find_one({"planName": plan_name, 'deleted' : 0},{"_id" : 0, "planDescription" : 1, "timeStamp" : 1, "planDate" : 1})

    return cursor

def createTemplate(template_name):    
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name_template]

    #print "heloooooooooooooooooooooooooo"
    #print template_name
    #plan = {"planName" : plan_name, "planDescription" : plan_desc, "timeStamp" : time, "markers" : markers}
    #collection.save(plan)

def operationConfigSave(BUF, MMRS1, MMRS2, MMRS3, science_image1, science_image2, image_panorama1, image_panorama2, image_panorama3, image_panorama4, spectra_panorama1, spectra_panorama2, spectra_panorama3, spectra_panorama4, spectra_panorama5, precise_Move, smart_target,marker_name,drill_value,nav_cam):
    connection = Connection()

    now = datetime.datetime.now()
    time = now.strftime("%Y-%m-%d %H:%M:%S")

    db = connection[database_name]
    collection = db[collection_name_operation]
    collection.remove({})

    operations = {"BUFConfig" : BUF, "MMRSConfig1" : MMRS1, "MMRSConfig2" : MMRS2, "MMRSConfig3" : MMRS3, "scienceImageConfig1" : science_image1, "scienceImageConfig2" : science_image2, "imagePanoramaConfig1" : image_panorama1, "imagePanoramaConfig2" : image_panorama2, "imagePanoramaConfig3" : image_panorama3, "imagePanoramaConfig4" : image_panorama4, "spectraPanoramaConfig1" : spectra_panorama1, "spectraPanoramaConfig2" : spectra_panorama2, "spectraPanoramaConfig3" : spectra_panorama3, "spectraPanoramaConfig4" : spectra_panorama4, "spectraPanoramaConfig5" : spectra_panorama5, "preciseMoveConfig" : precise_Move, "smartTargetConfig" : smart_target,"markerNameConfig":marker_name,"drillValueConfig":drill_value,"navcamConfig":nav_cam}
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
    # sort the list in desc order based on timestamp that embeded with object id - _id
    planListCursor = collection.find({'deleted' : {"$ne" : 1}},{'_id' : 0, 'planName' : 1}).sort('_id', -1)

    for record in planListCursor:
        planname_array.append(record['planName'])

        markersCursor = collection.find_one({'planName' : record['planName'], 'deleted' : 0}, {'_id':0, 'markers':1})
        tot_markers.append(len(markersCursor['markers']))

    data['planName'] = planname_array
    data['totalMarkers'] = tot_markers

    return data

def get_template_details(template_name):
    connection = Connection()

    db = connection[database_name]
    collection = db[template_collection]

    markersCursor = collection.find_one({'template_name' : template_name}, {'_id':0, 'markers':1})
    #print markersCursor['markers']

    return markersCursor['markers']

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

def fetch_templates():
    data = {}
    templateName_array = []

    connection = Connection()
    db = connection[database_name]
    collection = db[template_collection]
    templateListCursor = collection.find({},{'_id' : 0, 'template_name' : 1})
    #print templateListCursor
    for record in templateListCursor:
        templateName_array.append(record['template_name'])

    data['templateName'] = templateName_array
    #print data

    return data    


def get_operation_detail():
    data = {}
    operation_name_array = []
    operation_value_array = []

    connection = Connection()
    db = connection[database_name]
    collection = db[collection_name_operation]
    operationListCursor = collection.find({},{'_id' : 0})

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
        s_kml.newpoint(name=marker['markerName'], description=str(marker).strip('{}'),
                   coords=[(float(marker['lng']),float(marker['lat']),0)])
        #print marker['lng'],marker['lat']
    return s_kml.kml()

def export_os(plan_name):

    connection = Connection()
    db = connection['rover']
    collection = db['plans']

    cursor = collection.find_one({'planName' : plan_name}, {'_id' : 0})
    cursor = ast.literal_eval(json.dumps(cursor))   #removing unicode 'u' from the json
    #fld = KML.Folder()

    operationSetMaster = {}
    count = 0

    for marker in cursor['markers']:
        operationSet = {}
        operationSet['ll'] = "ll",marker['lat'],marker['lng'],marker['markerName']
        for key in marker.keys():
            if key == "spectraSmartTargetValue":
                operationSet['sotf'] = "sotf",marker['lat'],marker['lng'],marker['spectraSmartTargetValue'],marker['markerName']
            if key == "imageStartAzimuthValue":
                operationSet['panorama'] = "panorama", marker['imageStartAzimuthValue'], marker['imageEndAzimuthValue'],  marker['imageStartElevationValue'],  marker['imageEndElevationValue']
            if key == "spectraStartAzimuthValue":
                if marker.has_key("spectraAngularCamera"):
                    flag = 1
                else:
                    flag = 0
                operationSet['spanorama'] = "spanorama", marker['spectraStartAzimuthValue'], marker['spectraEndAzimuthValue'], marker['spectraStartElevationValue'], marker['spectraEndElevationValue'], marker['spectraAngularValue'], flag
            if key == "preciseMoveValue":
                operationSet['drive'] = "drive", marker['preciseMoveValue']
            if key == "navcamValue":
                operationSet['navcamsave'] = "navcamsave", marker['navcamValue']
            if key == "sciencePanValue":
                operationSet['scienceimage'] = "scienceimage", marker['sciencePanValue'], marker['scienceTiltValue']
            if re.search("drillValue.", key):
                drillNumber = key.split("drillValue")[1]
                nexusvalue= "0"
                nexussample= "0"
                nexusmmrs= "0"
                nexusbuf= "0"
                nexuspicture = "0"
                for drillkey in marker.keys():
                    if drillkey == "buf"+drillNumber:
                        nexusbuf = 1
                    if drillkey == "mmrs"+drillNumber:
                        nexusmmrs = 1
                    if drillkey == "drillSaveImage"+drillNumber:
                        nexuspicture = 1
                    if drillkey == "drillSave"+drillNumber:
                        nexussample = 1
                    if drillkey == "drillValue"+drillNumber:
                        nexusvalue = marker["drillValue"+drillNumber] 
                operationSet['drill'+drillNumber] = 'drill', marker['markerName'], nexusvalue, nexussample, nexusmmrs, nexusbuf, nexuspicture
        operationSetMaster[count] = operationSet
        count = count + 1
    return operationSetMaster
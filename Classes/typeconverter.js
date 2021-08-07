var startType = 'JSON'
var endType = 'CSV'

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

//Create CSV titles for an object, using recursion if it contains child objects
function recursiveTitle(header, obj) {
    let s = ''
    for(const i in obj) {
        if (typeof obj[i] == 'object') {
            //console.log('s')
            s += recursiveTitle(header + '.' + i, obj[i]) + ','
        }
        else {
            s += header + '.' + i + ','
        }
    }
    return s.substring(0, s.length-1)
}
function recursiveValue(header, obj) {
    let s = ''
    for(const i in obj) {
        if (typeof obj[i] == 'object') {
            s += recursiveValue(header + '.' + i, obj[i]) + ','
        }
        else {
            s += obj[i] + ','
        }
    }
    return s.substring(0, s.length-1)
}
//Create an object that only contains "value" within layers of simple objects defined by a list of "layers"
function empty(layers, value) {
    if (layers.length == 0) return value
    let topLayer = layers.shift() //Remove the top layer from the list
    let temp = {} //simple object to hold our layer
    temp[topLayer] = empty(layers, value)
    return temp
}
function recursiveObject(object, layers, value) {
    if (layers.length == 0) return value
    let topLayer = layers.shift() //Remove the top layer from the list
    if (object[topLayer] != undefined) {
        object[topLayer] = recursiveObject(object[topLayer], layers, value)
    }
    else {
        object[topLayer] = empty(layers, value)
    }
    return object
}
var usedText = ''
var outputFilename = 'generated'
// var output = document.getElementById('types-output')
function convertType(text, start, end) {
    var s = ''
    if (start == end) {
        s = 'Cannot start and end with the same type! (' + start + ' -> ' + end + ')'
    }
    else if (start == 'CSV' && end == 'JSON') {
        //CSV to JSON
        //The names of each variable is defined in the first line
        var lines = text.split('\n')
        var names = lines[0].split(',')
        var data = []
        for(var line in lines) {
            if (line == 0) continue
            var dataline = lines[line].split(',')
            var entry = {}
            for(var i in names) {
                if (names[i].includes('.')) {
                    //Nested objects, use recursion to fix it!
                    entry = recursiveObject(entry, names[i].split('.'), dataline[i])
                }
                else {
                    entry[names[i]] = dataline[i]
                }
            }
            data.push(entry)
        }
        s = JSON.stringify(data, null, 2)
        // lines.forEach((line, index) => {
        //     if (index != 1) {
        //         continue
        //     }
        //     console.log(i+": "+v)
        //     var entry = {}
        //     for(var i in names) {
        //         console.log(i)
        //     }
        // })
    }
    else if (start == 'JSON' && end == 'CSV') {
        //JSON to CSV
        var data = JSON.parse(text)
        if(Array.isArray(data)) {
            //Each table is given in each object
            const first = data[0]
            //Get the names of each in first
            for(const i in first) {
                // s += recursiveTitle(i, first[i]) + ','
                if (typeof first[i] == 'object') {
                    //Instead of having nested objects, make each variable from within its own entry (in the form parent.child.nextChild.keepGoing.more.maybeMore.name)
                    s += recursiveTitle(i, first[i]) + ','
                }
                else {
                    s += i + ','
                }
            }
            s = s.substring(0, s.length-1) + '\n'
            //Go through each data point now
            for(const x in data) {
                // console.log(x)
                var currentPoint = data[x]
                for(const i in currentPoint) {
                    if (typeof currentPoint[i] == 'object') {
                        s += recursiveValue(i, currentPoint[i]) + ','
                    }
                    else {
                        s += currentPoint[i] + ','
                    }
                }
                s = s.substring(0, s.length-1) + '\n'
            }
        }
        else {
            s = 'JSON was not an array!'
        }
    }
    else {
        s = 'Unkown types: ' + start + ' -> ' + end + '.'
    }
    usedText = s
    document.getElementById('types-output').innerHTML = s
}
document.getElementById('types-upload').onclick = function() {
    //Use uploaded file to create text for type conversion
    var files = document.getElementById('types-upload-file').files;
    if (files.length <= 0) {
        return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
        var name = files.item(0).name.split('.')[0] //instead of the boring 
        outputFilename = name
        var formattedText = e.target.result
        // var result = JSON.parse(e.target.result);
        // var formattedText = JSON.stringify(result, null, 2);
        convertType(formattedText, startType, endType)
    }
    fr.readAsText(files.item(0));
}

document.getElementById('types-paste').onclick = function() {
    //Prompt the user for text input (preferrably pasted but they can hand write it too)
    var inputText = prompt('Paste your ' + startType + ' text here','text...')
    if (inputText != null) {
        outputFilename = 'generated'
        convertType(inputText, startType, endType)
    }
}

document.getElementById('types-download').onclick = function(){
    var text = usedText
    var type = endType
    download(outputFilename+'.'+type.toLowerCase(), text)
}
Array.prototype.forEach.call(['JSON', 'CSV'], function(type) {
    
    //Update buttons for choosing this type as either a start or end
    document.getElementById('types-start-'+type).onclick = function() {
        document.getElementById('types-start-title').innerHTML = type+' <span class="caret"></span>'
        document.getElementById('types-paste').innerHTML = 'Paste '+type
        document.getElementById('types-upload').innerHTML = 'Use Uploaded '+type+' File'
        startType = type
    }
    document.getElementById('types-end-'+type).onclick = function() {
        document.getElementById('types-end-title').innerHTML = type+' <span class="caret"></span>'
        endType = type
    }
});

document.getElementById('types-posangle').onclick = function() {
    //Simplify uploaded csv file
    var files = document.getElementById('types-upload-file').files;
    if (files.length <= 0) {
        return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
        var name = files.item(0).name.split('.')[0] //instead of the boring 
        outputFilename = name + 'SIMPLIFIED'
        var formattedText = e.target.result
        var lines = formattedText.split('\n')
        var s = 'Time,PosX,PosY,Radians,Degrees\n'
        for(var i in lines) {
            if (i == 0) continue
            //"Pose2d(Translation2d(X: 0.00, Y: 0.00), Rotation2d(Rads: 0.07, Deg: 3.99))"
            var index = lines[i].indexOf('"Pose2d(')
            //0.00, Y: 0.00), Rotation2d(Rads: 0.07, Deg: 3.99
            if (index > -1) {
                //This line has pose data
                var littleText = lines[i].substring(index+25, lines[i].indexOf('"', index+1)-2)
                var pieces = littleText.split(',')
                // var xi = littleText.indexOf(',')
                // var x = littleText.substring(0, littleText.indexOf)
                //s += lines[i].substring(0, lines[i].indexOf(',')) + ',' + littleText +'\n'
                s += lines[i].substring(0, lines[i].indexOf(',')) + ',' + pieces[0] + ',' + pieces[1].substring(4, pieces[1].length-1) + ',' + pieces[2].substring(18) + ',' + pieces[3].substring(7) + '\n'
            }
            //var entries = lines[i].split(',')
            // for(var j in entries) {
            //     if (entries[j].includes('P'))
            // }
            //s += lines[i]
        }
        usedText = s
        document.getElementById('types-output').innerHTML = s
    }
    fr.readAsText(files.item(0));
}

// document.getElementById('aaddv').onclick = function() {
//     startType = "CSV"
//     endType = "JSON"
//     convertType('time,velocity,acceleration,pose.translation.x,pose.translation.y,pose.rotation.radians,curvature\n0,0,1.9999999999999998,0.8893467658412578,2.2995597401374637,0,0\n0.30920647033143933,0.6184129406628786,1.9999999999999998,0.9849554046210612,2.2995378103399893,-0.0006760115144184615,-0.013596420878257803', startType, endType)
// }
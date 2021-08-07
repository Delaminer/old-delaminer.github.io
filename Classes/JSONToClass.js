var myCar = {
    make: 'Ford',
    model: 'Mustang',
    year: 1969
};
var carsample = JSON.stringify(myCar)
var sample = `{
    "classes": {
        "title": "example glossary",
		"GlossDiv": {
            "title": "S",
			"GlossList": {
                "GlossEntry": {
                    "ID": "SGML",
					"SortAs": "SGML",
					"GlossTerm": "Standard Generalized Markup Language",
					"Acronym": "SGML",
					"Abbrev": "ISO 8879:1986",
					"GlossDef": {
                        "para": "A meta-markup language, used to create markup languages such as DocBook.",
						"GlossSeeAlso": ["GML", "XML"]
                    },
					"GlossSee": "markup"
                }
            }
        }
    }
}`
function ObjString(obj) {
    var s = "{"
    for(var i in obj) {
        s += "\"" + i + "\":\"" + obj[i] + "\","
    }
    return s.substring(0, s.length - 1) + "}"
}
function ReadableObject(obj, level) {
    var s = ""
    var t = "&nbsp;&nbsp;&nbsp;&nbsp;".repeat(level)
    for(var i in obj) {
        s += t
        if (typeof obj[i] != "object")
            s += i + ": " + obj[i] + "<br>"
        else
            s += i + ": <br>" + ReadableObject(obj[i], level + 1) + "<br."
    }
    return s
}
function StringToObject(str, des) {
    var strObj = JSON.parse(str) //Convert from string to object, so we can access variables

    //console.log(strObj)
    document.getElementById(des).innerHTML = ReadableObject(strObj, 0)
}
StringToObject(sample, "json-class-definition")


document.getElementById('json-class-usefile').onclick = function() {
    var files = document.getElementById('json-class-selectFiles').files;
    if (files.length <= 0) {
        return false;
    }
    var fr = new FileReader();
    fr.onload = function(e) {
        var result = JSON.parse(e.target.result);
        var formatted = JSON.stringify(result, null, 2);
        StringToObject(formatted, "json-class-definition")
    }
    fr.readAsText(files.item(0));
};
document.getElementById('json-class-usetext').onclick = function() {
    var text = document.getElementById("json-class-textinput").value
    StringToObject(text, "json-class-definition")
}
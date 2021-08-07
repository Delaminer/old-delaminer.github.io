const privacy = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    READABLE: 'readable',
    SETTABLE: 'settable',
    NONE: 'none'
}
Object.freeze(privacy) //To make it completely immutable
const output = {
    HTML: 'html',
    JAVA: 'java'
}
Object.freeze(output) //To make it completely immutable
const dataStructure = {
    CLASS: 'Class',
    INTERFACE: 'Interface',
    ABSTRACT_CLASS: 'Abstract Class'
}
Object.freeze(dataStructure) //To make it completely immutable

function formatType(type, outputType) {
    switch (type) {
        case "Integer": {
            switch(outputType) {
                case output.JAVA: {
                    return "int"
                }
            }
        }
        case "Double": {
            switch(outputType) {
                case output.JAVA: {
                    return "double"
                }
            }
        }
    }
    return type
}

var param = "wierd"
// function varType(classIndex, dataIndex, classes, sub) { //If there is an array, this will get messy
//     console.log("Asking for a varType, with inputs "+classIndex+", "+dataIndex+", "+classes+", "+sub)
//     if (true || classes[classIndex].get(dataIndex).list <= sub) {
//         return classes[classIndex].get(dataIndex).type
//     }
//     else {
//         let newSub = sub + 1
//         let id = "dropdownVariableType"+newSub+"x"+classIndex+"x"+dataIndex
//         let s = `<span>SubType`+newSub+`: <span class="dropdown">
//     <button class="btn btn-default dropdown-toggle" type="button" id="`+id+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
//       `+varType(classIndex, dataIndex, classes, newSub)+`
//     </button>
//     <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
//       <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'Integer')">Integer</a></li>
//       <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'Double')">Double</a></li>
//       <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'String')">String</a></li>
//       <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'ArrayList')">ArrayList</a></li>
//       <li role="separator" class="divider"></li>
//       <li class="dropdown-header">Custom Classes</li>`
//       classes.forEach(function(value) {
//         s += `<li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, '`+value.name+`')">`+value.name+`</a></li>`
//       })
//       s += `</ul>`
//       return s
//     }
// }
function getVariable(classIndex, dataIndex, classes) { //for editing
    var checked = (classes[classIndex].get(dataIndex).array>0)?`checked="true"`:""
    var none = (classes[classIndex].get(dataIndex).array>0)?"inline":"none"
    let s = `<span>Type: <span class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="dropdownVariableType0x`+classIndex+"x"+dataIndex+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      `+classes[classIndex].get(dataIndex).type+`
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a onClick="selectType(0, `+classIndex+", "+dataIndex+`, 'Integer')">Integer</a></li>
      <li><a onClick="selectType(0, `+classIndex+", "+dataIndex+`, 'Double')">Double</a></li>
      <li><a onClick="selectType(0, `+classIndex+", "+dataIndex+`, 'String')">String</a></li>
      <li><a onClick="selectType(0, `+classIndex+", "+dataIndex+`, 'ArrayList')">ArrayList</a></li>
      <li role="separator" class="divider"></li>
      <li class="dropdown-header">Custom Classes</li>`
      classes.forEach(function(value) {
        s += `<li><a onClick="selectType(0, `+classIndex+", "+dataIndex+`, '`+value.name+`')">`+value.name+`</a></li>`
      })
      s += `</ul>
      Array: <input id="checkbox`+classIndex+"x"+dataIndex+`" type="checkbox" class="form-check-input" onClick="checkArrayEDIT(`+classIndex+", "+dataIndex+`)"`+checked+`> 
      <span id="arraySize`+classIndex+"x"+dataIndex+`" style="display: `+none+`;">Size: <input id="arraySizeSAVE`+classIndex+"x"+dataIndex+`" type="number" min="1" max="9" value="`+Math.max(classes[classIndex].get(dataIndex).array,1)+`"></span>
    </span> Name: <textarea style="margin-bottom: -9px;" id="editableName`+classIndex+"x"+dataIndex+`" rows="1" cols="`+Math.max(20, classes[classIndex].get(dataIndex).name.length+8)+`">`+classes[classIndex].get(dataIndex).name+`</textarea>
    <button type="button" class="btn btn-warning btn-save" onClick="saveVariable(`+classIndex+", "+dataIndex+`)"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>
    <button type="button" class="btn btn-danger btn-save" onClick="deleteVariable(`+classIndex+", "+dataIndex+`)"><span class="glyphicon glyphicon-trash"></span> Delete</button></span>`
    return s
}
function getClass(index, classes) { //for editing
    let s = `<span>Name: <textarea style="margin-bottom: -9px;" id="editableCName`+index+`" rows="1" cols="`+Math.max(20, classes[index].name.length+8)+`">`+classes[index].name+`</textarea>
  <button type="button" class="btn btn-warning btn-save" onClick="saveClass(`+index+`)"><span class="glyphicon glyphicon-floppy-disk"></span> Save</button>
  <button type="button" class="btn btn-danger btn-save" onClick="deleteClass(`+index+`)"><span class="glyphicon glyphicon-trash"></span> Delete</button></span>`
  return s
}
function selectType(sub, classIndex, dataIndex, name) {
    if (name === "ArrayList") {
        // console.log("ARRAY FOR ("+name+") "+classIndex+"x"+dataIndex+" at "+sub)
        let newSub = sub + 1
        let id = "dropdownVariableType"+newSub+"x"+classIndex+"x"+dataIndex
        // console.log("ID="+id)
        let s = `<span>SubType`+newSub+`: <span class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="`+id+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
      `+param[classIndex].get(dataIndex).type+`
    </button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'Integer')">Integer</a></li>
      <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'Double')">Double</a></li>
      <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'String')">String</a></li>
      <li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, 'ArrayList')">ArrayList</a></li>
      <li role="separator" class="divider"></li>
      <li class="dropdown-header">Custom Classes</li>`
      param.forEach(function(value) {
        s += `<li><a onClick="selectType(`+newSub+", "+classIndex+", "+dataIndex+`, '`+value.name+`')">`+value.name+`</a></li>`
      })
      s += `</ul></span></span>`
        document.getElementById("dropdownVariableType"+sub+"x"+classIndex+"x"+dataIndex).innerHTML = s
    }
    else {
        // console.log("sorry not FOR ("+name+") "+classIndex+"x"+dataIndex+" at "+sub)
        document.getElementById("dropdownVariableType"+sub+"x"+classIndex+"x"+dataIndex).innerHTML = name
    }
}
class Variable {
    constructor(t, n, s, l) {
        this.type = t
        this.name = n
        this.array = s
        this.list = l
    }
    usableType(outputType) {
        switch (outputType) {
            case output.JAVA: {
                let s = "[]"
                if (this.list > 0) {
                    let l1 = "ArrayList&lt;"
                    let l2 = "&gt;"
                    return l1.repeat(this.list) + this.type + s.repeat(this.array) + l2.repeat(this.list)
                }
                else {
                    return formatType(this.type, outputType) + s.repeat(this.array)
                }
            }
        }
        return "Something went wrong generating the "+outputType+" usable type for "+simpleString()
    }
    print(outputType) {
        switch (outputType) {
            case output.HTML: {
                let arr = this.array > 0 ? ("[" + this.array + "]") : ""
                let lis = this.list > 0 ? ("ArrayList <" + this.list + "> ") : ""
                return lis + this.type + arr + " " + this.name
            }
            case output.JAVA: {
                // let s = "[]"
                // let l1 = "ArrayList&lt;"
                // let l2 = "&gt;"
                //WAS: return l1.repeat(this.list) + this.type + s.repeat(this.array) + l2.repeat(this.list) + " " + this.name + ";"
                return this.usableType(outputType) + " " + this.name + ";"
            }
        }
    }
    printConstructorAdd(outputType) {
        switch (outputType) {
            case output.JAVA: {
                return this.usableType(outputType) + " " + this.name
            }
        }
        return "Something went wrong generating the " + outputType + " constructor parameter for " + this.simpleString()
    }
    printConstructorBase(outputType) {
        switch (outputType) {
            case output.JAVA: {
                return "this." + this.name + " = " + this.name + ";"
            }
        }
        return "Something went wrong generating the " + outputType + " constructor base for " + this.simpleString()
    }
    printConstructorBlank(outputType) {
        switch (outputType) {
            case output.JAVA: {
                let useThis = ""
                let s = "[]"
                if (this.list > 0) {
                    return useThis + this.name + " = new " + this.usableType(outputType) + "();"
                }
                else if (this.array > 0) {
                    return useThis + this.name + " = new " + this.usableType(outputType) + ";"
                }
                else {
                    switch (this.type) {
                        case "Integer": {
                            return useThis + this.name + " = 0;"
                        }
                        case "Double": {
                            return useThis + this.name + " = 0.0;"
                        }
                        case "String": {
                            return useThis + this.name + " = \"\";"
                        }
                    }
                    return useThis + this.name + " = new " + formatType(this.type, outputType) + s.repeat(this.array) + ";"
                }
            }
        }
        return "Something went wrong generating the " + outputType + " constructor blank declaration for " + this.simpleString()
    }
    considerAddingMethods(outputType, accessability) { //Ads getter and setter methods
        //public int getAge() { return age; }
        let s = ""
        if (accessability === privacy.SETTABLE) {
            switch (outputType) {
                case output.JAVA: {
                    s += "\tpublic void set" + this.name[0].toUpperCase() + this.name.substring(1) + "("
                }
            }
        }
        switch (accessability) {
            case privacy.READABLE: {
                //TODO: add accessability!
            }
            case privacy.SETTABLE: {

            }
        }
        return s
    }
    simpleString() {
        return "(" + this.type + ", " + this.name + ", " + this.array + ", " + this.list + ""
    }
}
function selectNewType(sub, classIndex, name) {
    if (name === "ArrayList") {
        let newSub = sub + 1
        let id = "dropdownNEWVariableType"+newSub+"x"+classIndex
        let s = `<span>SubType`+newSub+`: <span class="dropdown">
    <button class="btn btn-default dropdown-toggle" type="button" id="`+id+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">Select Type</button>
    <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
      <li><a onClick="selectNewType(`+newSub+", "+classIndex+`, 'Integer')">Integer</a></li>
      <li><a onClick="selectNewType(`+newSub+", "+classIndex+`, 'Double')">Double</a></li>
      <li><a onClick="selectNewType(`+newSub+", "+classIndex+`, 'String')">String</a></li>
      <li><a onClick="selectNewType(`+newSub+", "+classIndex+`, 'ArrayList')">ArrayList</a></li>
      <li role="separator" class="divider"></li>
      <li class="dropdown-header">Custom Classes</li>`
      param.forEach(function(value) {
        s += `<li><a onClick="selectNewType(`+newSub+", "+classIndex+`, '`+value.name+`')">`+value.name+`</a></li>`
      })
      s += `</ul></span></span>`
      document.getElementById("dropdownNEWVariableType"+sub+"x"+classIndex).innerHTML = s
    }
    else {
        document.getElementById("dropdownNEWVariableType"+sub+"x"+classIndex).innerHTML = name
    }
}
class DataStructure {
    constructor(type, name, vars) {
        this.type = type
        this.name = name
        this.vars = vars
        this.accessability = privacy.PUBLIC
    }
    writeArrays(classIndex, classes) {
        this.vars.forEach(function(value, dataIndex, array) {
            var i;  
            for (i = 0; i < value.list; i++) {
                //Write the ith list
                selectType(i, classIndex, dataIndex, "ArrayList")
              }
        })
    }
    print(index, outputType, classes) {
        switch (outputType) {
            case output.HTML: {
                //was <p>Some <span onClick="closeClass(`+index+`)">text</span> in the Modal..</p>
                //was <p>Some <span onClick="closeVariable(`+index+", "+dataIndex+`)">text</span> in the Modal..</p>
                let s = `<button type="button" class="btn btn-success btn-circle glyphicon glyphicon-pencil" onClick="editClass(`+index+`)"></button>
                <div id="modalC`+index+`" class="modal-content">`+getClass(index, classes)+`</div>
                &nbsp;&nbsp;` + this.type + " " + this.name + "<br>"
                this.vars.forEach(function(value, dataIndex, array){
                    s += `<button type="button" class="btn btn-success btn-circle glyphicon glyphicon-pencil" onClick="editVariable(`+index+", "+dataIndex+`)"></button>
                    <div id="modal`+index+"x"+dataIndex+`" class="modal-content">`+getVariable(index, dataIndex, classes)+`</div>
                    &nbsp;&nbsp;⮡&nbsp;&nbsp;` + value.print(outputType) + "<br>"
                })
                s += `<button type="button" class="btn btn-info btn-var" onClick="newVariable(`+index+`)"><span class="glyphicon glyphicon-plus"></span> New Variable</button>
                <div id="varModal`+index+`" class="modal-content"><span>Type: <span class="dropdown">
                <button class="btn btn-default dropdown-toggle" type="button" id="dropdownNEWVariableType0x`+index+`" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">String
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenu1">
                  <li><a onClick="selectNewType(0, `+index+`, 'Integer')">Integer</a></li>
                  <li><a onClick="selectNewType(0, `+index+`, 'Double')">Double</a></li>
                  <li><a onClick="selectNewType(0, `+index+`, 'String')">String</a></li>
                  <li><a onClick="selectNewType(0, `+index+`, 'ArrayList')">ArrayList</a></li>
                  <li role="separator" class="divider"></li>
                  <li class="dropdown-header">Custom Classes</li>
                  `
                  classes.forEach(function(value) {
                    s += `<li><a onClick="selectNewType(0, `+index+", '"+value.name+`')">`+value.name+`</a></li>`
                  })
                  s += `
                </ul>
              </span>Array: <input id="checkbox`+index+`" type="checkbox" class="form-check-input" onClick="checkArrayNEW(`+index+`)"> <span id="arraySize`+index+`" style="display: none;">Size: <input id="arraySizeCREATE`+index+`" type="number" min="1" max="9" value="1"></span>
               Name: <textarea style="margin-bottom: -9px;" id="editableNewVarName`+index+`" rows="1" cols="20">var`+this.vars.length+`</textarea>
              <button type="button" class="btn btn-warning btn-save" onClick="createVariable(`+index+`)"><span class="glyphicon glyphicon-plus"></span> Create Variable</button></span></div>`
                return s
            }
            case output.JAVA: {
                let s = "public " + this.type.toLowerCase() + " " + this.name + " {\n"
                //Variable definitions:
                let pri = ""
                switch (this.accessability){
                    case privacy.PRIVATE: {
                        pri = "private "
                    }
                    case privacy.PUBLIC: {
                        pri = "public "
                    }
                }
                let constructorAdds = "("
                let insideConstructor = ""
                let blankConstructor = ""
                let edge = this.vars.length-1
                this.vars.forEach(function(value, index, array){
                    s += "\t" + pri + value.print(outputType) + "\n"
                    insideConstructor += "\t\t" + value.printConstructorBase(outputType) + "\n"
                    blankConstructor += "\t\t" + value.printConstructorBlank(outputType) + "\n"
                    if (index >= edge) {
                        constructorAdds += value.printConstructorAdd(outputType)
                    }
                    else { //public Snake(int[] fangs, ArrayList<Integer> names) {
                        constructorAdds += value.printConstructorAdd(outputType) + ", "
                    }
                })
                //Full Constructor:
                if (this.vars.length > 0) {
                    s += "\n\tpublic " + this.name + constructorAdds + ") {\n" + insideConstructor + "\t}\n\n"
                }
                
                //Blank Constructor
                s += "\tpublic " + this.name + "() {\n" + blankConstructor + "\t}\n"

                

                s += "}"
                return s
            }
        }
    }
    add(data) { this.vars.push(data) }
    set(index, data) { this.vars[index] = data }
    get(index) { return this.vars[index] }
    delete(index, amount) { this.vars.splice(index, amount) }
}
let classes = [new DataStructure(dataStructure.CLASS, "SampleClass", [new Variable("String", "var", 0, 0)])
//,new DataStructure(dataStructure.CLASS, "SampleClass", [new Variable("String", "var")]),new DataStructure(dataStructure.CLASS, "SampleClass", [new Variable("String", "var")]),new DataStructure(dataStructure.CLASS, "SampleClass", [new Variable("String", "var")]),new DataStructure(dataStructure.CLASS, "SampleClass", [new Variable("String", "var")])
]
let edited = false

param = classes

function printOutput() {
    let s = ""
    classes.forEach(function(value, index, array) {
        s += value.print(index, output.JAVA, classes) + "\n\n"
    })
    document.getElementById("output").innerHTML = s
}
function updateData() {
    let s = ""
    classes.forEach(function(value, index, array) {
        s += value.print(index, output.HTML, classes) + "<br><br>"
    })
    s += `<button type="button" class="btn btn-warning btn-class" onClick="newClass()"><span class="glyphicon glyphicon-plus"></span> New Class</button>
    <div id="classModal" class="modal-content"><span>Class Name: <textarea style="margin-bottom: -9px;" id="editableNEWCLASS" rows="1" cols="20">SampleClass`+classes.length+`</textarea>
    <button type="button" class="btn btn-warning btn-save" onClick="createClass()"><span class="glyphicon glyphicon-plus"></span> Create</button></span></div`
    // <button type="button" class="btn btn-warning btn-class" onClick="newDataStructure(dataStructure.ABSTRACT_CLASS)"><span class="glyphicon glyphicon-plus"></span> New Abstract Class</button>
    // <button type="button" class="btn btn-danger btn-class" onClick="newDataStructure(dataStructure.INTERFACE)"><span class="glyphicon glyphicon-plus"></span> New Interface</button>`
    document.getElementById("structure").innerHTML = s
    writeArrays()
    printOutput()
}
function writeArrays() {
    classes.forEach(function(value, index, array) {
        value.writeArrays(index, classes)
    })
}
updateData() //Do this when the script is referenced
var currentModal = null
function newClass() {
    if (currentModal != null) {
        currentModal.style.display = "none"
        if ("classModal" === currentModal.id) {
            currentModal = null
        }
        else {
            currentModal = document.getElementById("classModal")
            currentModal.style.display = "inline-block"
        }
    }
    else {
        currentModal = document.getElementById("classModal")
        currentModal.style.display = "inline-block"
    }
}
function closeNewClass() {
    currentModal = document.getElementById("classModal")
    currentModal.style.display = "none"
    currentModal = null
}
function createClass() {
    let className = document.getElementById("editableNEWCLASS").value
    className = className.trim()
    classes.push(new DataStructure(dataStructure.CLASS, className, []))//new Variable("String", "name", 0, 0)]))
    edited = true
    closeNewClass()
    updateData()
}
function newVariable(index) {
    let varName = "varModal" + index
    if (currentModal != null) {
        currentModal.style.display = "none"
        if (varName === currentModal.id) {
            currentModal = null
        }
        else {
            currentModal = document.getElementById(varName)
            currentModal.style.display = "inline-block"
        }
    }
    else {
        currentModal = document.getElementById(varName)
        currentModal.style.display = "inline-block"
    }
}
function closeNewVariable(index) {
    let varName = "varModal" + index
    currentModal = document.getElementById(varName)
    currentModal.style.display = "none"
    currentModal = null
}
function createVariable(index) {
    let type = document.getElementById("dropdownNEWVariableType0x"+index)
    let name = document.getElementById("editableNewVarName"+index).value
    let check = document.getElementById("checkbox"+index).checked
    let size = check?document.getElementById("arraySizeCREATE"+index).value:0

    // let typeT = type.innerHTML.trim()
    // console.log("My newNEW var type is  or "+type.innerText+" or "+type.textContent)
    // console.log(type)
    var use = type.innerText
    var output = 0
    var remove = `Integer
Double
String
ArrayList
Custom Classes
SampleClass`
// console.log("SudoStarting with "+use)
    if (use.includes("SubType")) {
        if (use.includes(remove)) {
            use = use.substring(0, use.indexOf(remove))
        }
        // console.log("Starting with: "+use)
        while (use.includes("SubType")) {
            use = use.substring(7)
            output = parseInt(use.substring(0,1))
            use = use.substring(3)
            //console.log("New val: ("+output+") "+use)
        }
    }

    // type = type.trim()
    name = name.trim()
    classes[index].add(new Variable(use, name, size, output))
    edited = true
    closeNewVariable(index)
    updateData()
}
function editVariable(classIndex, dataIndex) {
    name = "modal" + classIndex + "x" + dataIndex
    if (currentModal != null) {
        currentModal.style.display = "none"
        if (name === currentModal.id) {
            currentModal = null
        }
        else {
            currentModal = document.getElementById(name)
            currentModal.style.display = "inline-block"
        }
    }
    else {
        currentModal = document.getElementById(name)
        currentModal.style.display = "inline-block"
    }
}
function editClass(index) {
    name = "modalC" + index
    if (currentModal != null) {
        currentModal.style.display = "none"
        if (name === currentModal.id) {
            currentModal = null
        }
        else {
            currentModal = document.getElementById(name)
            currentModal.style.display = "inline-block"
        }
    }
    else {
        currentModal = document.getElementById(name)
        currentModal.style.display = "inline-block"
    }
}
function closeClass(name) {
    name = "modalC"+name
    currentModal = document.getElementById(name)
    currentModal.style.display = "none"
    currentModal = null
}
function closeVariable(classIndex, dataIndex) {
    let name = "modal" + classIndex + "x" + dataIndex
    currentModal = document.getElementById(name)
    currentModal.style.display = "none"
    currentModal = null
}
function saveVariable(classIndex, dataIndex) {
    let type = document.getElementById("dropdownVariableType0x"+classIndex+"x"+dataIndex)
    let name = document.getElementById("editableName"+classIndex+"x"+dataIndex).value
    let size = document.getElementById("checkbox"+classIndex+"x"+dataIndex).checked?document.getElementById("arraySizeSAVE"+classIndex+"x"+dataIndex).value:0
    let typeT = type.innerHTML.trim()
    // console.log("My new var type is ~"+typeT+"~ or "+type.innerText+" or "+type.textContent)
    var use = type.innerText
    var output = 0
    var remove = `Integer
Double
String
ArrayList
Custom Classes
SampleClass`
// console.log("SudoStarting with "+use)
    if (use.includes("SubType")) {
        if (use.includes(remove)) {
            use = use.substring(0, use.indexOf(remove))
        }
        // console.log("Starting with: "+use)
        while (use.includes("SubType")) {
            use = use.substring(7)
            output = parseInt(use.substring(0,1))
            use = use.substring(3)
            //console.log("New val: ("+output+") "+use)
        }
    }
    // if (typeT.includes("SubType")) {
    //     //Dang, we have some reading to do...
    //     console.log("Houston, we've got a problem...")
    // }
    name = name.trim()
    classes[classIndex].set(dataIndex, new Variable(use, name, size, output))
    edited = true
    updateData()
    closeVariable(classIndex, dataIndex)
}
function saveClass(index) {
    let Cname = document.getElementById("editableCName"+index).value
    Cname = Cname.trim()
    classes[index].name = Cname
    edited = true
    updateData()
    closeClass(index)
}
function checkArrayEDIT(classIndex, dataIndex) {
    let check = document.getElementById("checkbox"+classIndex+"x"+dataIndex)
    let size = document.getElementById("arraySize"+classIndex+"x"+dataIndex)
    if (check.checked) {
        //Enable array size
        size.style.display = "inline"
    }
    else {
        //Disable array size
        size.style.display = "none"
    }
}
function checkArrayNEW(index) {
    let check = document.getElementById("checkbox"+index)
    let size = document.getElementById("arraySize"+index)
    if (check.checked) {
        //Enable array size
        size.style.display = "inline"
    }
    else {
        //Disable array size
        size.style.display = "none"
    }
}
function deleteVariable(classIndex, dataIndex) {
    classes[classIndex].delete(dataIndex, 1)
    edited = true
    closeVariable(classIndex, dataIndex)
    updateData()
}
function deleteClass(index) {
    classes.splice(index, 1)
    edited = true
    closeClass(index)
    updateData()
}
window.onbeforeunload = function() {
    if (edited) {
        return "Are you sure you want to leave? Your data may not be saved.";
    }
    else {
        return;
    }
};

function copyText(sourceID, outputID, messageText) {
    var el = document.getElementById(sourceID)
    var range = document.createRange();
    range.selectNodeContents(el);
    var sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    document.execCommand("copy");
    sel.removeAllRanges();
    document.getElementById(outputID).innerHTML = messageText
}
function undoCopy(outputID, messageText) {
    document.getElementById(outputID).innerHTML = messageText
}
var Algebrite = require('./algebrite')


const OperatorType = {
    "Multiply":" * ",
    "Divide":" / ",
    "Add":" + ",
    "Subtract":" - ",
    "Exponent":" ^ ",
}
const Function = {
    //A whole lot of trigonometric functions
    "Sine":"sin",
    "Cosine":"cos",
    "Tangent":"tan",
    "Cosecant":"csc",
    "Cosecant":"sec",
    "Cotangent":"cot",
    "HyperbolicSine":"sinh",
    "HyperbolicCosine":"cosh",
    "HyperbolicTangent":"tanh",
    "HyperbolicCosecant":"csch",
    "HyperbolicSecant":"sech",
    "HyperbolicCotangent":"coth",
    "InverseSine":"arcsin",
    "InverseCosine":"arccos",
    "InverseTangent":"arctan",
    "InverseCosecant":"arccsc",
    "InverseSecant":"arcsec",
    "InverseCotangent":"arccot",
    "InverseHyperbolicSine":"arcsinh",
    "InverseHyperbolicCosine":"arccosh",
    "InverseHyperbolicTangent":"tanh",
    "InverseHyperbolicCosecant":"arccsch",
    "InverseHyperbolicSecant":"arcsech",
    "InverseHyperbolicCotangent":"arccoth",

    "NaturalLogarithm":"ln",
    "Sign":"sign",
}
function strType(str) {
    switch(str){
        case "*":
            return OperatorType.Multiply
        case "/":
            return OperatorType.Divide
        case "+":
            return OperatorType.Add
        case "-":
            return OperatorType.Subtract
        case "^":
            return OperatorType.Exponent
    }
    return str
}
function operatorOrder(op) {
    switch(op) {
        case OperatorType.Add:
            return 3
        case OperatorType.Subtract:
            return 3
        case OperatorType.Multiply:
            return 2
        case OperatorType.Divide:
            return 2
        case OperatorType.Exponent:
            return 1
    }
}
function operatorTex(op) { 
    switch(op) {
        case OperatorType.Add:
            return " + "
        case OperatorType.Subtract:
            return " - "
        case OperatorType.Multiply:
            return ""
        case OperatorType.Divide:
            return " \\over "
        case OperatorType.Exponent:
            return "^"
    }
}
Term = class {
    constructor(termA, operator, termB) {
        this.termA = termA
        this.operator = operator
        this.termB = termB
        this.type = 1
        this.value = -9
    }
    cleanup(){
        if (this.type == 0 || this.type == 2 || this.type == 3) return
        this.termA.cleanup()
        this.termB.cleanup()
        if (this.termA.type == 0 && this.termB.type == 0) {
            this.value = this.solve(-999)
            this.type = 0
        }
        else {
            switch(this.operator) {
                case OperatorType.Add:
                    if (this.termA.type == 0 && this.termA.value == 0) { //0 + something
                        this.termA = this.termB.termA
                        this.operator = this.termB.operator
                        this.termB = this.termB.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 0) { //something + 0
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                        this.termA = this.termA.termA
                    }
                    //was if
                    else if (this.termA.type == 0) { //swap orders so the constant is in the back
                        var temp = this.termB
                        this.termB = this.termA
                        this.termA = temp
                    }
                    break
                case OperatorType.Subtract:
                    if (this.termA.equals(this.termB)) {
                        this.value = 0
                        this.type = 0
                    }
                    else if (this.termA.type == 0 && this.termA.value == 0) {//0 - something
                        this.termA = Num(-1)
                        this.operator = OperatorType.Multiply
                        this.termB = this.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 0) { //something - 0
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                        this.termA = this.termA.termA
                    }
                    break
                case OperatorType.Multiply:
                    if ((this.termA.type == 0 && this.termA.value == 0) || (this.termB.type == 0 && this.termB.value == 0)) { // 0 * something
                        this.value = 0
                        this.type = 0
                    }
                    else if (this.termA.type == 0 && this.termA.value == 1) { //1 * something
                        this.value = this.termB.value
                        this.type = this.termB.type
                        this.termA = this.termB.termA
                        this.operator = this.termB.operator
                        this.termB = this.termB.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 1) { //something * 1
                        this.value = this.termA.value
                        this.type = this.termA.type
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                        this.termA = this.termA.termA
                    }
                    //was if
                    else if (this.termA.type == 0 && this.termB.type == 1) { //a * something
                        if (this.termB.termA.type == 0) { //a * a' * something
                            this.termA.value = this.termA.value * this.termB.termA.value
                            this.termA.type = 0
                            this.termB = this.termB.termB
                        }
                        else if (this.termB.termB.type == 0) { //a * something * b'
                            this.termA.value = this.termA.value * this.termB.termB.value
                            this.termA.type = 0
                            this.termB = this.termB.termA
                        }
                    }
                    else if (this.termB.type == 0 && this.termA.type == 1) { //something * b
                        if (this.termA.termA.type == 0) { //a' * something * b
                            this.termB.value = this.termB.value * this.termA.termA.value
                            this.termB.type = 0
                            this.termA = this.termA.termB
                        }
                        else if (this.termA.termB.type == 0) { //something * b' * b
                            this.termB.value = this.termB.value * this.termA.termB.value
                            this.termB.type = 0
                            this.termA = this.termA.termA
                        }
                    }
                    //was if
                    else if (this.termB.type == 0) { //swap orders so the constant is in front
                        var temp = this.termB
                        this.termB = this.termA
                        this.termA = temp
                    }
                    break
                case OperatorType.Divide:
                    if (this.termA.equals(this.termB)) {
                        this.value = 1
                        this.type = 0
                    }
                    else if (this.termA.type == 0 && this.termA.value == 0) {
                        this.value = 0
                        this.type = 0
                    }
                    break
            }
            // if (this.termA.type == 0 && this.termB.type == 0) {
            //     this.value = this.solve(-999)
            //     this.type = 0
            //     console.log("LOL! Cleanup happened a second time!")
            // }
        }
    }
    string() {
        if (this.type == 0 || this.type == 2) return this.value
        if (this.type == 3) return this.operator + "( " + + this.termA.string() + " )"
        if (this.termB == null) return "String(): Invalid term with data "+JSON.stringify(this)
        return "(" + this.termA.string() + this.operator + this.termB.string() + ")"
    }
    tex() {
        if (this.type == 0 || this.type == 2) return this.value
        if (this.type == 3) return this.operator + "(" + + this.termA.string() + ")"
        if (this.termB == null) return "Tex(): Invalid term with data "+JSON.stringify(this)
        return "{" + this.termA.tex() + operatorTex(this.operator) + this.termB.tex() + "}"
    }
    equals(other) {
        if (other == null) return false
        if (this.type != other.type) return false
        if (this.type == 0 || this.type == 2) return this.value === other.value
        if (this.type == 3) return this.operator == other.operator && this.termA.equals(other.termA)
        return this.operator == other.operator && this.termA.equals(other.termA) && this.termB.equals(other.termB)
    }
    solve(x) {
        if (this.type == 0) return this.value
        if (this.type == 2) return x
        if (this.type == 3) {
            switch(this.operator) {
                case Function.Sign:
                    return Math.sign(this.termA.solve(x))
                case Function.NaturalLogarithm:
                    return Math.log(this.termA.solve(x))

                case Function.Sine:
                    return Math.sin(this.termA.solve(x))
                case Function.Cosine:
                    return Math.cos(this.termA.solve(x))
                case Function.Tangent:
                    return Math.tan(this.termA.solve(x))
                case Function.Cosecant:
                    return 1.0 / Math.sin(this.termA.solve(x))
                case Function.Secant:
                    return 1.0 / Math.cos(this.termA.solve(x))
                case Function.Cotangent:
                    return 1.0 / Math.tan(this.termA.solve(x))
                case Function.HyperbolicSine:
                    return Math.sinh(this.termA.solve(x))
                case Function.HyperbolicCosine:
                    return Math.cosh(this.termA.solve(x))
                case Function.HyperbolicTangent:
                    return Math.tanh(this.termA.solve(x))
                case Function.HyperbolicCosecant:
                    return 1.0 / Math.sinh(this.termA.solve(x))
                case Function.HyperbolicSecant:
                    return 1.0 / Math.cosh(this.termA.solve(x))
                case Function.HyperbolicCotangent:
                    return 1.0 / Math.tanh(this.termA.solve(x))
                case Function.InverseSine:
                    return Math.asin(this.termA.solve(x))
                case Function.InverseCosine:
                    return Math.acos(this.termA.solve(x))
                case Function.InverseTangent:
                    return Math.atan(this.termA.solve(x))
                case Function.InverseCosecant:
                    return 1.0 / Math.asin(this.termA.solve(x))
                case Function.InverseSecant:
                    return 1.0 / Math.acos(this.termA.solve(x))
                case Function.InverseCotangent:
                    return 1.0 / Math.atan(this.termA.solve(x))
                case Function.InverseHyperbolicSine:
                    return Math.asinh(this.termA.solve(x))
                case Function.InverseHyperbolicCosine:
                    return Math.acosh(this.termA.solve(x))
                case Function.InverseHyperbolicTangent:
                    return Math.atanh(this.termA.solve(x))
                case Function.InverseHyperbolicCosecant:
                    return 1.0 / Math.asinh(this.termA.solve(x))
                case Function.InverseHyperbolicSecant:
                    return 1.0 / Math.acosh(this.termA.solve(x))
                case Function.InverseHyperbolicCotangent:
                    return 1.0 / Math.atanh(this.termA.solve(x))
            }
        }
        else {
            switch(this.operator) {
                case OperatorType.Add: //A + B
                    return this.termA.solve(x) + this.termB.solve(x)
                case OperatorType.Subtract: //A - B
                    return this.termA.solve(x) - this.termB.solve(x)
                case OperatorType.Multiply: //A * B
                    return this.termA.solve(x) * this.termB.solve(x)
                case OperatorType.Divide: //A / B
                    return this.termA.solve(x) / this.termB.solve(x)
                case OperatorType.Exponent: //Take A to the power of B (A^B)
                    return Math.pow(this.termA.solve(x), this.termB.solve(x))
            }
        }
    }
    derivative(id) {
        if (this.type == 0) return Num(0)
        if (this.type == 2) return (this.value === id) ? Num(1) : Num(0)
        var temp
        switch(this.operator) {
            case OperatorType.Add:
                temp = new Term(this.termA.derivative(id), OperatorType.Add, this.termB.derivative(id))
                break
            case OperatorType.Subtract:
                temp = new Term(this.termA.derivative(id), OperatorType.Subtract, this.termB.derivative(id))
                break
            case OperatorType.Multiply:
                temp =  new Term(
                    new Term(
                        this.termA.derivative(id),
                        OperatorType.Multiply,
                        this.termB
                    ),
                    OperatorType.Add,
                    new Term(
                        this.termA,
                        OperatorType.Multiply,
                        this.termB.derivative(id)
                    )
                )
                break
            case OperatorType.Divide:
                temp = new Term(
                    new Term(
                        new Term(this.termB, OperatorType.Multiply, this.termA.derivative(id)), 
                        OperatorType.Subtract, 
                        new Term(this.termA, OperatorType.Multiply, this.termB.derivative(id))
                    ),
                    OperatorType.Divide,
                    new Term(
                        this.termB,
                        OperatorType.Multiply,
                        this.termB
                    )
                )
                break
            case OperatorType.Exponent:
                //Okay, this can be three situations:
                //1: the base is a constant, turn this into an e^ax deal to get a*e^ax
                //2: the exponent is a constant, turn this into an f(x)^a deal to get a*f(x)^a-1 * f'(x)
                //3: neither terms are constant, making a whole ordeal out of this (use the really complex solution)
                if (this.termA.type == 0) { //1: exponent
                    //a^f(x) == e^f(x)lna, derivative = lna * f' * e^f(x)lna
                    temp = new Term(
                        new Term(
                            Ln(this.termA),
                            OperatorType.Multiply,
                            this.termB.derivative(id)
                        ),
                        OperatorType.Multiply,
                        new Term(
                            this.termA,
                            this.operator,
                            this.termB
                        )
                    )
                }
                else if (this.termB.type == 0) { //2: power function
                    temp = new Term(
                        new Term(
                            Num(this.termB.value),
                            OperatorType.Multiply,
                            this.termA.derivative(id),
                        ),
                        OperatorType.Multiply,
                        new Term(
                            this.termA,
                            OperatorType.Exponent,
                            Num(this.termB.value - 1)
                        )
                    )
                }
                else { //3: wierd answer
                    temp = new Term(
                        new Term(
                            this.termA,
                            this.operator,
                            this.termB
                        ),
                        OperatorType.Multiply,
                        new Term(
                            new Term(
                                this.termB.derivative(id),
                                OperatorType.Multiply,
                                Ln(this.termA)
                            ),
                            OperatorType.Add,
                            new Term(
                                new Term(
                                    this.termB,
                                    OperatorType.Multiply,
                                    this.termA.derivative(id)
                                ),
                                OperatorType.Divide,
                                this.termA
                            )
                        )
                    )
                }
                break
            case OperatorType.NaturalLogarithm:
                temp = new Term(
                    this.termA.derivative(id),
                    OperatorType.Divide,
                    this.termA
                )
                break
        }
        temp.cleanup()
        return temp
    }
}
function Num(value) {
    var temp = new Term()
    temp.value = value
    temp.type = 0
    return temp
}
function Var(name) {
    var temp = new Term()
    temp.value = name
    temp.type = 2
    return temp
}
function Func(term, func) {
    var temp = new Term()
    temp.termA = term
    temp.operator = func
    temp.type = 3
    return temp
}
function Ln(value) {
    // var temp = new Term(
    //     value,
    //     OperatorType.NaturalLogarithm,
    //     Num(Math.E)
    // )
    // return temp
    return Func(value, Function.NaturalLogarithm)
}
function Log(value, base) { //log of custom base is equal to ln(val) / ln(base), so we'll use that for an easier time
    var temp = new Term(
        Ln(value),
        OperatorType.Divide,
        Ln(base),
    )
    return temp
}
function isNumber(str) {
    return /[0-9]/i.test(str)
}
function isLetter(str) {
    return /[a-z]/i.test(str)
}
function isOperator(str) {
    return !isNumber(str) && !isLetter(str)
}
function sameType(a, b) {
    //console.log("using "+a+" and "+b+", "+isNumber(a))
    // return isNumber(a) == isNumber(b) && isLetter(a) == isLetter(b)

    //This version joins terms only if both are numbers. We dont want to join two letters because we instead want them to be seperate variables
    return isNumber(a) && isNumber(b) && !isLetter(a) && !isLetter(b)
}
function ReadString(str) { //Converts a string into either a number constant or a variable
    return isNumber(str) ? Num(parseInt(str)) : Var(str)
}
function MassMultiply(array){ //Converts an array of strings into a term where each string is a number/variable (using ReadString) multiplied by the others
    if (array.length == 0) {
        console.log("MassMultiply had an array with nothing in it")
        return null
    }
    if (array.length == 1) {
        return ReadString(array[0]) //the array is just one element, return it as its own term
    }
    else {
        return new Term(ReadString(array.shift()), OperatorType.Multiply, MassMultiply(array)) //Remove one element, and multiply it by the rest of the array using a recursive call
    }
}
//StringToMultiply is not used
function StringToMultiply(str) {
    var sections = []
    var start = 0
    var startType = str.charAt(start)
    var index = 1
    while(index < str.length) {
        if (!sameType(startType, str.charAt(index))) {
            //chop it off
            sections.push(str.substring(start, index))
            start = index
        }
    }
    if (sections.length == 0) return ReadString(str) //if its all one string
    return MassMultiply(sections)
}
//findSideTerms is not used
function findSideTerms(str, edge){
    var leftStart = str.charAt(edge-1)
    if (!isNumber(leftStart) && !isLetter(leftStart)) console.log("ERROR LEFT ISNT A LETTER OR NUMBER")
    var leftEdgeIndex = edge - 2
    var leftSections = []
    var miniEdge = edge
    while(leftEdgeIndex >= 0 && !isOperator(str.charAt(leftEdgeIndex))) {
        while(leftEdgeIndex >= 0 && sameType(leftStart, str.charAt(leftEdgeIndex))) {
            leftEdgeIndex-=1
        }
        leftSections.unshift(str.substring(leftEdgeIndex+1, miniEdge)) //'unshifts' adds to front
        miniEdge = leftEdgeIndex+1
        leftStart = str.charAt(miniEdge-1)
    }
    leftEdgeIndex++
    if (leftSections.length == 0) {
        //WE NEED TO ADD ONE, so lets just add one letter
        leftSections.unshift(str.substring(edge - 1, edge)) //'unshifts' adds to front
    }
    // var left = str.substring(leftEdgeIndex, edge)
    var left = MassMultiply(leftSections)

    var rightStart = str.charAt(edge+1)
    if (!isNumber(rightStart) && !isLetter(rightStart)) console.log("ERROR RIGHT ISNT A LETTER OR NUMBER")
    var rightEdgeIndex = edge + 2
    var rightSections = []
    miniEdge = edge
    while(rightEdgeIndex < str.length && !isOperator(str.charAt(rightEdgeIndex))) {
        while(rightEdgeIndex < str.length && sameType(rightStart, str.charAt(rightEdgeIndex))) {
            rightEdgeIndex++
        }
        rightSections.push(str.substring(miniEdge+1, rightEdgeIndex)) //'push' adds to end
        miniEdge = rightEdgeIndex-1
        rightStart = str.charAt(miniEdge+1)
    }
    rightEdgeIndex-=1
    if (rightSections.length == 0) {
        //WE NEED TO ADD ONE, so lets just add one letter
        rightSections.push(str.substring(edge + 1, edge + 2)) //'unshifts' adds to front
    }
    //var right = str.substring(edge+1, rightEdgeIndex+1)
    var right = MassMultiply(rightSections)
    return [leftEdgeIndex, rightEdgeIndex, left, right]
}
//findTerm is not used
function findTerm(sequenceData, startIndex, order) {
    // var start = sequenceData[startIndex]
    // if (start === "(") {
    //     return findTerm(sequenceData, startIndex+1, 0)
    // }
    var i = startIndex
    var p = 0
    var nextTerm
    var nextOperator
    while(i < sequenceData.length) {
        if (sequenceData[i] === "(") {
            p++
            var data = findTerm(sequenceData, i+1, 0)
            nextTerm = data[0]
            i = data[1]+1
        }
        else if (sequenceData[i] === ")") {
            if (order != 0) console.log("WHa why is this here")
            //End the parenthesis term
            return [nextTerm]
        }
        else {
            if (typeof sequenceData[i] == Term) {
                nextTerm = sequenceData[i]
            }
            else {
                if (order > operatorOrder(sequenceData[i])) {
                    //We have to keep going
                    var data = findTerm(sequenceData, i+1, operatorOrder(sequenceData[i]))
                    nextTerm = data[0]
                    i = data[1]+1
                }
                else {
                    //Ha! its the same type, or even lower!
                    return [nextTerm, nextOperator,]
                }
            }
        }
        i++
    }
}
//findOrderLength is TECHNICALLY not used (it's used by CombineTerms which is not used)
function findOrderLength(sequenceData, startIndex, comparingOrder) {
    var nextOrder = operatorOrder(sequenceData[startIndex + 1])
    return null
}
//CombineTerms is not used
function CombineTerms(sequenceData){
    if (sequenceData.length > 1) {
        //Okay, lets do some ORDER OF OPERATIONS.
        var term = sequenceData[0]
        var operator = sequenceData.shift()
        var myOrder = operatorOrder(operator)
        var nextTerm = findOrderLength(sequenceData, 2, myOrder)
        var nextOperator = sequenceData.shift()
        var theirOrder = operatorOrder(nextOperator)
        if (myOrder < theirOrder) {
            //Use mine first.
            return new Term(new Term(term, operator, nextTerm), nextOperator, CombineTerms(sequenceData))
        }
        else {
            //Use theirs first.
            return new Term(term, operator, new Term(nextTerm, nextOperator, CombineTerms(sequenceData)))
        }
        return new Term(term, operator, CombineTerms(sequenceData))
    }
    else {
        return sequenceData[0]
    }
}
function sub(array, start, end) {
    var temp = []
    var i = start
    for(i = start; i < end; i++) {
        temp.push(array[i])
    }
    return temp
}
function getParenthesisTerm(sequenceData, startIndex) {
    var temp = []
    var i
    var c = 1
    for(i = startIndex; i < sequenceData.length; i++) {
        if (sequenceData[i] === "(") c++
        else if(sequenceData[i] === ")") {
            c--
            if (c == 0)
                break //Ran out of delimeter, do not add this additional delimeter to sub array
        }
        temp.push(sequenceData[i]) //So we don't have to use the sub() command (so everything is done in 1 for loop, not 2)
    }
    return [temp, i+1] //Note: i+1 may go outside of bounds (if the for loop ended because it reached the end and NOT the parenthesis)
}
function JoinTerms(sequenceData) {
    if (sequenceData.length > 1) {
        var terms = []
        var operators = []
        var currentIndex = 0
        //Turn list of alternating terms and operators to a list of terms and a list of operators
        while(currentIndex < sequenceData.length) {
            //Add a term
            if (sequenceData[currentIndex] === "(") {
                var data = getParenthesisTerm(sequenceData, currentIndex + 1)
                currentIndex = data[1]
                terms.push(JoinTerms(data[0]))
            }
            else {
                terms.push(sequenceData[currentIndex])
                currentIndex++
            }
            
            if (currentIndex >= sequenceData.length)
                break
            
            //Add an operator
            if (sequenceData[currentIndex] === "(") {
                operators.push(OperatorType.Multiply)
            }
            else {
                operators.push(sequenceData[currentIndex])
                currentIndex++
            }
        }

        //If there is only 1 term, just return it (this runs when you surround the 1 term with parenthesis)
        if (operators.length < 1)
            return terms[0]

        //Now use the list of operators to form a list of indices, the order in which the operators are ran
        var indices = []
        //Using a stacked list of OperatorTypes is just an easy way of determining the order of operations
        //while allowing different types (* and /, + and -) to be the same importance
        var OrderOfOperations = 
            [[OperatorType.Exponent], [OperatorType.Multiply, OperatorType.Divide], [OperatorType.Add, OperatorType.Subtract]]
        OrderOfOperations.forEach(
            function(value) { //Go through each level of the OrderOfOperations at a time
                var i
                for(i = 0; i < operators.length; i++) { //Go through each operator from left to right (this is an important part of OoO)
                    //The current operator must be a high enough level and not already used
                    if (value.includes(operators[i]) && !indices.includes(i)) {
                        //Add it to the list of indices!
                        indices.push(i)
                    }
                }
            }
        )
        
        //Using the ordered list of indices, recursively create the term, saving new joined terms in the list 'references'
        references = []
        indices.forEach(() => {references.push(null)})

        indices.forEach((index, indexindex, arr) => {
            var left = terms[index]
            var operator = operators[index]
            var right = terms[index + 1]
            if (references[index] != null) {
                left = references[index]
            }
            if (references[index + 1] != null) {
                right = references[index + 1]
            }

            var resultingTerm = new Term(left, operator, right)
            var i
            for(i = 0; i < indexindex; i++) {
                if (index == indices[i]) {
                    continue
                }
                if (references[index] != null && references[index].equals(references[indices[i]])) {
                    references[indices[i]] = resultingTerm //So they will still be equal
                }
                if (references[index + 1] != null && references[index + 1].equals(references[indices[i] + 1])) {
                    references[indices[i] + 1] = resultingTerm //So they will still be equal
                }
            }
            references[index] = resultingTerm
            references[index + 1] = resultingTerm
        })
        
        return references[indices[indices.length - 1]]

        //Old method: only works with 1 set of terms (and 1 operator)
        // var left
        // var operatorStart = 1
        // if (sequenceData[0] === "(") { //Run this command recursively, reading whats inside the parenthesis
        //     // var c = 1
        //     // var i
        //     // for(i = 1; i < sequenceData.length; i++) {
        //     //     if (sequenceData[i] === "(") c++
        //     //     else if (sequenceData[i] === ")") {)
        //     //         c--
        //     //         if (c == 0) {
        //     //             break
        //     //         }
        //     //     }
        //     // }
        //     // operatorStart = i+1
        //     // left = JoinTerms(sub(sequenceData, 1, i-1))

        //     //This is a better way to read within a parenthesis
        //     var data = getParenthesisTerm(sequenceData, 1)
        //     operatorStart = data[1]
        //     left = JoinTerms(data[0])
        // }
        // else {
        //     left = sequenceData[0]
        // }
        // if (operatorStart >= sequenceData.length) //If the left parenthesis term takes up the whole sequenceData, then just return left
        //     return left
        // var operator = sequenceData[operatorStart]
        // var rightStart = operatorStart + 1
        // if (operator === "(") {
        //     operator = OperatorType.Multiply
        //     rightStart -= 1 //So we read '(' as a part of right
        // }
        // var right
        // var nextStart = rightStart + 1 //for the next operator I guess...
        // if (sequenceData[rightStart] === "(") { //Run this command recursively, reading whats inside the parenthesis
        //     //Same method as left, just starting at a later index
        //     var data = getParenthesisTerm(sequenceData, rightStart + 1)
        //     nextStart = data[1]
        //     right = JoinTerms(data[0])
        // }
        // else {
        //     right = sequenceData[rightStart]
        // }
        // if (nextStart < sequenceData.length)
        //     console.log("Yeah we didnt cover eveything, ns="+nextStart+" of "+sequenceData.length)
        // return new Term(left, operator, right)
    }
    else {
        return sequenceData[0]
    }
}
function sequenceString(sequenceData) {
    var s = ""
    var i
    for (i = 0; i < sequenceData.length; i++) {
        var t = typeof sequenceData[i]
        if (t !== 'string') {
            // console.log("yes "+t)
            s += JSON.stringify(sequenceData[i])
        }
        else {
            s += sequenceData[i]
            // console.log("no "+t)
        }
    }
    return s
}
function Expression(str) {
    var i
    var sequenceData = []
    var miniSequence = []
    var startIndex = 0
    while (isOperator(str.charAt(startIndex))) {
        sequenceData.push(strType(str.charAt(startIndex)))
        startIndex++
    }
    var s = str.charAt(startIndex)
    var type = str.charAt(startIndex)
    for(i = startIndex+1; i < str.length; i++) {
        var c = str.charAt(i)
        if (isOperator(c)) { //reached an operator, add current term to mini list, then add mini list and new operator to main list
            if (s.length > 0) //only add one if available
                miniSequence.push(s)
            if (miniSequence.length > 0) //only add one if available
                sequenceData.push(MassMultiply(miniSequence))
            sequenceData.push(strType(c))
            miniSequence = [] //clear the minisequence of old terms
            s = "" //clear the mini term (it may be used within this loop, but most cases do not so we do this here anyways)
            if (i != str.length - 1 && !isOperator(str.charAt(i+1))) {
                //Okay, the next item is a term, so lets declare it here, skipping its step
                type = str.charAt(i+1)
                s = type
                i++
            }
        }
        else if (sameType(type, c)) { //keep adding to current mini term
            s += c
        }
        else { //new mini term, add old one to list
            miniSequence.push(s)
            s = c
            type = c
        }
    }
    if (s !== "")
    miniSequence.push(s)
    if (miniSequence.length > 0)
    sequenceData.push(MassMultiply(miniSequence))
    if (typeof sequenceData[sequenceData.length - 1] === "string") {
        //This is invalid
        //sequenceData.push(new Var(`}\\) <span class="glyphicon glyphicon-remove-circle missing"></span> \\( {`))
        sequenceData.push(new Var(`}\\) <span class="missing">□</span> \\( {`))
    }

    return JoinTerms(sequenceData)
}
function typeText() {
    var input = document.getElementById("in-eq").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return
    var exp = Expression(input)
    document.getElementById("yousaid").innerHTML = "You said: \\("+exp.tex()+"\\)"
    MathJax.typeset()
}
var solve = function() {
    var input = document.getElementById("in-eq").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return
    var exp = Expression(input)
    // console.log(exp.string())
    // console.log("You typed: "+input)
    var expD = exp.derivative("x")
    // console.log(expD.string())
    document.getElementById("yousaid").innerHTML = "You said: \\("+exp.tex()+"\\)"
    document.getElementById("derivative").innerHTML = "The derivative is: \\("+expD.tex()+"\\)"
    MathJax.typeset()
}
var typeCAS = function() {
    var input = document.getElementById("in-cas").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return
    var exp = Expression(input)
    document.getElementById("yousaid-cas").innerHTML = "You said: \\("+exp.tex()+"\\)"
    MathJax.typeset()
}
var solveCAS = function() {
    var input = document.getElementById("in-cas").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return
    var out = Algebrite.run(input);
    // var exp = Expression(input)
    // // console.log(exp.string())
    // // console.log("You typed: "+input)
    // var expD = exp.derivative("x")
    // // console.log(expD.string())
    // document.getElementById("yousaid-cas").innerHTML = "You said: \\("+exp.tex()+"\\)"
    document.getElementById("derivative-cas").innerHTML = "The answer is: "+out
    // MathJax.typeset()
}
var casText = function() {
    var input = document.getElementById("in-cas").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return "error"
    return input
}
var casOutput = function(out) {
    // document.getElementById("answer-cas").innerHTML = "The answer is: "+out
    // document.getElementById("rewritten-answer-cas").innerHTML = "Or can be rewritten as (might not work properly): \\("+Expression(out).tex()+"\\)"
    
    document.getElementById("dual-answer-cas").innerHTML = out+" &nbsp; OR &nbsp; \\("+Expression(out).tex()+"\\)"
    MathJax.typeset()
}
var casSolve = function() {
    var input = casText()
    if (input == "error") return
    casOutput(Algebrite.run(input))
}
var casDerivative = function() {
    var input = casText()
    if (input == "error") return
    // casOutput(Algebrite.d(input))
    casOutput(Algebrite.run("d("+input+")"))
}
var casIntegral = function() {
    var input = casText()
    if (input == "error") return
    // casOutput(Algebrite.integral(input))
    casOutput(Algebrite.run("integral("+input+")"))
}
var casDefiniteIntegral = function() {
    var input = casText()
    console.log("ran"+input)
    if (input === "error") return
    var lower = document.getElementById("in-cas-defintegral-lower").value
    var upper = document.getElementById("in-cas-defintegral-upper").value
    casOutput(Algebrite.run("defint("+input+",x,"+lower+","+upper+")"))
}
// var t = new Term(Num(3), OperatorType.Add, Num(4))
// var x = Var("x")
// var f = new Term(Var("x"), OperatorType.Multiply, Var("x"))
// var g = new Term(Num(Math.E), OperatorType.Exponent, new Term(Num(2), OperatorType.Multiply, Var("x")))
// var h = Log(new Term(Num(2), OperatorType.Multiply, Var("x")), Num(Math.E))
// console.log(t.string())
// console.log(t.solve(0))
// console.log(t.derivative("x").string())
// console.log(x.derivative("x").string())
// console.log(f.derivative("x").string())
// console.log(f.derivative("x").solve(Math.E))
// console.log(g.derivative("x").string())
//console.log(g.derivative("x").solve(0))

document.getElementById("in-eq").addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        solve()
        //document.getElementById("in-eq-btn").onclick
    }
})
document.getElementById("in-eq").addEventListener("input", typeText)
document.getElementById("in-eq-btn").onclick = function(){solve()}
// document.getElementById("in-eq-btn").onclick = solve()
// document.getElementById("in-cas").addEventListener("keyup", function(event) {
//     if (event.keyCode == 13) {
//         event.preventDefault()
//         solveCAS()
//         //document.getElementById("in-cas-btn").onclick
//     }
// })
document.getElementById("in-cas").addEventListener("input", typeCAS)
document.getElementById("in-cas-solve").onclick = function(){casSolve()}
document.getElementById("in-cas-derive").onclick = function(){casDerivative()}
document.getElementById("in-cas-integral").onclick = function(){casIntegral()}
document.getElementById("in-cas-defintegral").onclick = function(){casDefiniteIntegral()}
document.getElementById("in-cas-defintegral-upper").addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        casDefiniteIntegral()
    }
})
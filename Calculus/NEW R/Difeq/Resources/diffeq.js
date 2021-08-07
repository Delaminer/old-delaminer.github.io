//const e = require("express")

console.log("Running diffeq.js")
document.getElementById("in-eq").addEventListener("keyup", function(event) {
    if (event.keyCode == 13) {
        event.preventDefault()
        solve()
    }
})
const OperatorType = {
    "Multiply":" * ",
    "Divide":" / ",
    "Add":" + ",
    "Subtract":" - ",
    "Exponent":" ^ ",
    "NaturalLogarithm":" ()ln "
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
Term = class {
    constructor(termA, operator, termB) {
        this.termA = termA
        this.operator = operator
        this.termB = termB
        this.type = 1
        this.value = -9
    }
    cleanup(){
        if (this.type == 0 || this.type == 2) return
        this.termA.cleanup()
        this.termB.cleanup()
        if (this.termA.type == 0 && this.termB.type == 0) {
            this.value = this.solve(-999)
            this.type = 0
        }
        else {
            switch(this.operator) {
                case OperatorType.Add:
                    if (this.termA.type == 0 && this.termA.value == 0) {
                        this.termA = this.termB.termA
                        this.operator = this.termB.operator
                        this.termB = this.termB.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 0) {
                        this.termA = this.termA.termA
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                    }
                    break
                case OperatorType.Subtract:
                    if (this.termA.type == 0 && this.termA.value == 0) {
                        this.termA = Num(-1)
                        this.operator = OperatorType.Multiply
                        this.termB = this.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 0) {
                        this.termA = this.termA.termA
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                    }
                    break
                case OperatorType.Multiply:
                    if ((this.termA.type == 0 && this.termA.value == 0) || (this.termB.type == 0 && this.termB.value == 0)) {
                        this.value = 0
                        this.type = 0
                    }
                    else if (this.termA.type == 0 && this.termA.value == 1) {
                        this.value = this.termB.value
                        this.type = this.termB.type
                        this.termA = this.termB.termA
                        this.operator = this.termB.operator
                        this.termB = this.termB.termB
                    }
                    else if (this.termB.type == 0 && this.termB.value == 1) {
                        
                        this.value = this.termA.value
                        this.type = this.termA.type
                        this.operator = this.termA.operator
                        this.termB = this.termA.termB
                        this.termA = this.termA.termA
                        
                    }
                    break
                // case OperatorType.Divide:
                //     break
            }
        }
    }
    string() {
        if (this.type == 0 || this.type == 2) return this.value
        if (this.termB == null) return "String(): Invalid term with data "+JSON.stringify(this)
        return "(" + this.termA.string() + this.operator + this.termB.string() + ")"
    }
    solve(x) {
        if (this.type == 0) return this.value
        if (this.type == 2) return x
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
            case OperatorType.NaturalLogarithm: //Take the log of A with base B
                return Math.log(this.termA.solve(x))
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
                        new Term(this.termA, OperatorType.Multiply, this.termB.derivative(id)), 
                        OperatorType.Subtract, 
                        new Term(this.termB, OperatorType.Multiply, this.termA,this.derivative(id))
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
function Ln(value) {
    var temp = new Term(
        value,
        OperatorType.NaturalLogarithm,
        Num(Math.E)
    )
    return temp
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
    return isNumber(a) == isNumber(b) && isLetter(a) == isLetter(b)
}
function ReadString(str) { //Converts a string into either a number constant or a variable
    return isNumber(str) ? Num(parseInt(str)) : Var(str)
}
function MassMultiply(array){ //Converts an array of strings into a term where each string is a number/variable (using ReadString) multiplied by the others
    if (array.length == 0) {
        console.log("wa")
        return null
    }
    if (array.length == 1) {
        return ReadString(array[0]) //the array is just one element, return it as its own term
    }
    else {
        return new Term(ReadString(array.shift()), OperatorType.Multiply, MassMultiply(array)) //Remove one element, and multiply it by the rest of the array using a recursive call
    }
}
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
function insideParenthesis(sequenceData, startIndex) {

}
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
}//1+2^3*4
function findOrderLength(sequenceData, startIndex, comparingOrder) {
    var nextOrder = operatorOrder(sequenceData[startIndex + 1])
    return null
}
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
        


        return null

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
        // console.log("returning a term of "+sequenceData[0].string())
        console.log(sequenceData.length+" returning a term of "+JSON.stringify(sequenceData[0]))
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
    console.log("Sequence Data: "+sequenceString(sequenceData))
    var endTerm = JoinTerms(sequenceData)
    console.log("Resulting Term: "+endTerm.string())

    // var t = new Term()
    return endTerm
}
var solve = function() {
    var input = document.getElementById("in-eq").value
    input = input.replace(/ /g,'')
    if (input.length < 1) return
    // if (input.charAt(0) == "(")
    // input = input.substring(1, input.length - 1)
    console.log("You typed: "+input)
    //Turn input into recursive terms through order of operations
    // if (input.indexOf("(") > 0) {

    // }
    var exp = Expression(input)
    //console.log(exp.string())
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

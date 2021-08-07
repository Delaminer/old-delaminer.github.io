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
        if (this.termB == null) return "what"
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
var solve = function() {
    var input = document.getElementById("in-eq").value
    console.log(input)
}
var t = new Term(Num(3), OperatorType.Add, Num(4))
var x = Var("x")
var f = new Term(Var("x"), OperatorType.Multiply, Var("x"))
var g = new Term(Num(Math.E), OperatorType.Exponent, new Term(Num(2), OperatorType.Multiply, Var("x")))
var h = Log(new Term(Num(2), OperatorType.Multiply, Var("x")), Num(Math.E))
// console.log(t.string())
// console.log(t.solve(0))
// console.log(t.derivative("x").string())
// console.log(x.derivative("x").string())
// console.log(f.derivative("x").string())
// console.log(f.derivative("x").solve(Math.E))
// console.log(g.derivative("x").string())
//console.log(g.derivative("x").solve(0))
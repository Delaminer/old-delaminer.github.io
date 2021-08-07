var savedUser = ''
var savedPass = ''

var req = new XMLHttpRequest()
req.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        document.getElementById('output').innerHTML = this.responseText
    }
}
req.open("GET","https://nodeserveruno.delaminer.repl.co/",true)
req.send()

var choices = ['Rock','Paper','Scissors']
choices.forEach((v)=>{
    document.getElementById('choose-'+v.toLowerCase()).onclick = function(){
        var req = new XMLHttpRequest()
        req.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                document.getElementById('output').innerHTML = this.responseText
            }
        }
        req.open("GET","https://nodeserveruno.delaminer.repl.co/play?choice="+v.toLowerCase(),true)
        req.send()
    }
})

document.getElementById('signup').onclick = function(){
    //Sign up
    var user = document.getElementById('input-user').value
    var pass = document.getElementById('input-pass').value
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('output').innerHTML = this.responseText
        }
    }
    req.open("GET","https://nodeserveruno.delaminer.repl.co/signup?user="+user+"&pass="+pass,true)
    req.send()
}
document.getElementById('login').onclick = function(){
    //Log in
    var user = document.getElementById('input-user').value
    var pass = document.getElementById('input-pass').value
    var req = new XMLHttpRequest()
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById('output').innerHTML = this.responseText
        }
    }
    req.open("GET","https://nodeserveruno.delaminer.repl.co/login?user="+user+"&pass="+pass,true)
    req.send()
}
document.getElementById("teams").innerHTML = "hi"
var totalTeams = 40
var totalMatches = 80
var teams = []
var matches = []
var i
var j
for(i = 0; i < totalTeams; i++) {
    let t = 0
    do {
        t = parseInt(Math.random() * 9999)
    } while(teams.includes(t))
    
    teams.push(t)
}
console.log(teams)
for(i = 0; i < totalMatches; i++) {
    let m = []
    for(j = 0; j < 6; j++) {
        let t = 0
        do {
            t = parseInt(Math.random() * totalTeams)
        } while(m.includes(t))
        m.push(teams[t])
    }
    matches.push(m)
}
console.log(matches)
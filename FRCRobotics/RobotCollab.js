// const e = require("express");
class Mat {
  constructor(ta, tb, y, d, n) {
      this.teamA = ta
      this.teamB = tb
      this.year = y
      this.data = d
      this.eventName = n
  }
}
var ceventDB = {};
var cgetEventData = function(eventKey) {
  return ceventDB[eventKey]
}
var csetEventData = function(eventKey, eventData) {
  ceventDB[eventKey] = eventData
}
function collabError(err) {
  document.getElementById("error").innerHTML = err
}
function load(enable) {
  document.getElementById("loading").style.display = enable?"inline":"none"
}
collabError("")
load(false)
document.getElementById("team2").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("setTeams").click();
  }
});
// let debugC = false
// function print(x) {
//     if (debugC) {
//       console.log(x)
//     }
// }
var settings = {
    "url": "https://www.thebluealliance.com/api/v3/team/frc67/event/2019mimil/matches",
    "method": "GET",
    "errorAction": function() { console.log("There was an error in RobotCollab.") },
    "error": function(jqXHR, textStatus, errorThrown) { 
      if(jqXHR.status == 404 || errorThrown == 'Not Found') 
      {
        this.errorAction()
      }
  },
    "timeout": 0,
    "headers": {
      "X-TBA-Auth-Key": "3UaMBx72hIhbqcytpMTpBPVgcabzmitWR0Owv9HRogxJBVF9iJfq86jtVWWJkC6I"
    },
};
matches = "?"
teamA = ""
teamB = ""
matchIndex = 0
index = 0
function nextIndex() { index++; document.getElementById("collabVid").src = "https://www.youtube.com/embed/"+matches[matchIndex].videos[index%matches[matchIndex].videos.length].key; }
function previousCollab() { 
  matchIndex++; 
  if (matchIndex >= matches.length) {
    matchIndex = 0;
  }
  document.getElementById("collabVid").src = "https://www.youtube.com/embed/"+matches[matchIndex].videos[index%matches[matchIndex].videos.length].key; 
}
function nextCollab() { matchIndex--; 
  if (matchIndex < 0) {
    matchIndex = matches.length - 1;
  }
  document.getElementById("collabVid").src = "https://www.youtube.com/embed/"+matches[matchIndex].videos[index%matches[matchIndex].videos.length].key; }
ra = 0
rb = 0
re = false
good = true
function c(aa,bb){
  return Math.abs(parseInt(aa.localeCompare(bb))) + 2;
}
function goodMatch(match) {
  print("Reading match for ")
  print(match)
  if (re) {
    let as=0
    let bs=0
    match.alliances.red.team_keys.forEach(function(team, index, array){ //for each team
      team = team.trim()
      if (c(team,teamA) < 2.2) {
        as=1
      }
      if (c(team,teamB) < 2.2) {
        bs=1
      }
    })
    match.alliances.blue.team_keys.forEach(function(team, index, array){ //for each team
      team = team.trim()
      if (c(team,teamA) < 2.2) {
        as=2
        // console.log("worked for "+team+" and "+teamA)
      }
      if (c(team,teamB) < 2.2) {
        bs=2
      }
    })
    // console.log(as+", "+bs)
    // if (as == 0 && bs == 0) {
    //   console.log("0, 0: Try against :"+teamA+": or :"+teamB+":")
    //   match.alliances.red.team_keys.forEach(function(team, index, array){ //for each team
    //     console.log(team+": "+c(team,teamA)+" or "+c(team,teamB))
    //     if (c(team,teamA) < 2.2) {
    //       as=2
    //       // console.log("worked for "+team+" and "+teamA)
    //     }
    //     else {
    //       console.log("not good for "+c(team,teamA))
    //     }
    //   })
    //   match.alliances.blue.team_keys.forEach(function(team, index, array){ //for each team
    //     // console.log(team)
    //     console.log(team+": "+c(team,teamA)+" or "+c(team,teamB))
    //     if (c(team,teamA) < 2.2) {
    //       as=2
    //       // console.log("worked for "+team+" and "+teamA)
    //     }
    //     else {
    //       console.log("not good for "+c(team,teamA))
    //     }
    //   })
    // }
    return as!=0 && bs!=0 && as!=bs
  }
  else {
    let goodA = false;
    let goodB = false;
    match.alliances.red.team_keys.forEach(function(team, index, array){ //for each team
      if (team === teamA) {
        goodA = true;
      }
      if (team === teamB) {
        goodB = true;
      }
    })
    if (goodA && goodB) {
      return true
    }
    else {
      goodA = false;
      goodB = false;
    }
    match.alliances.blue.team_keys.forEach(function(team, index, array){ //for each team
      if (team === teamA) {
        goodA = true;
      }
      if (team === teamB) {
        goodB = true;
      }
    })
    return goodA && goodB
  }
}
function playMatch(indexToPlay) {
  matchIndex = indexToPlay
  // console.log("Playing match "+indexToPlay+", which has videos "+matches[matchIndex].videos.length)
  document.getElementById("collabVid").src = "https://www.youtube.com/embed/"+matches[matchIndex].videos[index%matches[matchIndex].videos.length].key
}
function randomCollab() {
  if (matches.length <= 0 || matches == "?") {
    if (good) {
      good = false
      // collabError("No matches found. Trying again...")
      setup(ra, rb, re)
      return;
    }
    else {
      print("These 2 teams never played together!")
      load(false)
      if (re)
      collabError("These teams have never played against each other!")
      else 
      collabError("These teams have never played together!")
      return;
    }
  }
  else {
    good = true
    collabError("")
  }
  load(false)
  var tryIndex = Math.floor(Math.random() * matches.length)
  var match = matches[tryIndex];
  while(match.videos.length <= 0) {
    print("Oops! This match didnt have a video:")
    print(match)
    tryIndex = Math.floor(Math.random() * matches.length)
    print("random="+tryIndex)
    match = matches[tryIndex];
  }
  // getStats()
  playMatch(tryIndex)
}
let collabEvents = 0;
let currentCollabEvents = 0;
function gotAllYears(){ //Call after "getAllYears is successful"
  randomCollab();
  getStats();
}
var addData = function(newData) {
  newData.forEach(function(value, index, array){
    if (goodMatch(value, team1, team2)) {
      if (matches == "?") {
        matches = [value]
        print("Setting up 1 val")
      }
      else {
        matches = matches.concat(value)
        // console.log("Sorting")
        // matches.sort((a, b) => a.key - b.key)
        print("Adding up 1 val")
      }
    }
    else {
      print("Not adding this match")
    }
  })
  currentCollabEvents++;
  if (currentCollabEvents >= collabEvents) {
    document.getElementById("collabPlayer").style.display = "inline";
    document.getElementById("collabLoader").style.display = "none";
    gotAllYears();
  }
  else {
    var collabEventPercent = Math.floor((1.0 * currentCollabEvents / collabEvents * 1.0) * 100.0);
    document.getElementById("collabLoader").innerHTML = "<i>Finding matches "+collabEventPercent+"%</i>"
  }
}
function getMatchesForTeam(team, year) {
  settings.url = "https://www.thebluealliance.com/api/v3/team/"+team+"/events/"+year
  
  collabEvents = 0;
  currentCollabEvents = 0;
  $.ajax(settings).done(function(response){ //get a list of all events
    collabEvents += response.length
    response.forEach(function(value, index, array){ //for each event
      settings.url = "https://www.thebluealliance.com/api/v3/team/"+team+"/event/"+value.key+"/matches"
      csetEventData(value.key, value)
      $.ajax(settings).done(addData); //get the matches at this event
    })
  })
}
let numberOfRookieYears = 0;
let rookieA = 0;
let rookieB = 0;
function getAllYears(one, two, enemies) {
  teamA = "frc"+one
  teamB = "frc"+two
  ra=one
  rb=two
  re=enemies
  rookieA = 0
  rookieB = 0
  settings.url = "https://www.thebluealliance.com/api/v3/team/frc"+one
  settings.errorAction = function() {
    load(false)
    collabError("Unable to find teams "+one+" and "+two+".")
  }
  document.getElementById("collabLoader").innerHTML = "<i>Finding data for teams "+one+" and "+two+"...</i>"
  $.ajax(settings).done(function(response){
    rookieA = response.rookie_year
    if (rookieB > 10) {
      var minimum = Math.max(rookieA, rookieB)
      collabError("")
      var i;
      for (i = minimum; i <= 2020; i++) {
        getMatchesForTeam(teamA, i)
      }
    }
  })
  settings.url = "https://www.thebluealliance.com/api/v3/team/frc"+two
  $.ajax(settings).done(function(response){
    rookieB = response.rookie_year
    if (rookieA > 10) {
      var minimum = Math.max(rookieA, rookieB)
      collabError("")
      var i;
      for (i = minimum; i <= 2020; i++) {
        getMatchesForTeam(teamA, i)
      }
    }
  })
  // OLD TIMEY WAIT COMMANDS
  // setTimeout(() => {
  //   if (rookieA < 10 || rookieB < 10) {
  //     if (good) {
  //       good = false;
  //       // collabError("Unable to find teams "+one+" and "+two+", trying again...")
  //       setup(ra, rb, re)
  //       return
  //     }
  //     else {
  //       print("Teams not found")
  //       load(false)
  //       collabError("Unable to find teams "+one+" and "+two+".")
  //       return
  //     }
  //   }
  //   else {
  //     //good = true
  //   }
  //   var minimum = Math.max(rookieA, rookieB)
  //   print("Finally! They are ("+one+", "+rookieA+") and ("+two +", "+rookieB+"), making it start in "+minimum);
  //   collabError("")
  //   var i;
  //   for (i = minimum; i <= 2020; i++) {
  //     getMatchesForTeam(teamA, i)
  //   }
  // }, 1000);
}
let currentCollabYear = -2;
let allowCollabClose = true;
function openCollabYear(year) {
  if (allowCollabClose) {
    allowCollabClose = false;
    document.getElementById("collabTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-up"></span> &nbsp; <b>`+year+`: </b>`
    document.getElementById("collabTable"+year).style.display = "inline-block"
    document.getElementById("collabTitle"+year).onclick = function() { closeCollabYear(year, false) };
    if (currentCollabYear != year) {
      closeCollabYear(currentCollabYear, true)
    }
    currentCollabYear = year;
    setTimeout(() => {
      allowCollabClose = true;
    }, 100);
  }
  // setTimeout(() => { 
  //   randomVideo();
  //   getTeamStats();
  // }, 9000);
}
function closeCollabYear(year, auto) {
  if (auto) {
    if (year > 0) {
      document.getElementById("collabTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+year+`: </b>`
      document.getElementById("collabTable"+year).style.display = "none"
      document.getElementById("collabTitle"+year).onclick = function() { openCollabYear(year) };
      currentCollabYear = -1;
    }
  }
  else {
    if (allowCollabClose) {
      if (year > 0) {
        allowCollabClose = false;
        document.getElementById("collabTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+year+`: </b>`
        document.getElementById("collabTable"+year).style.display = "none"
        document.getElementById("collabTitle"+year).onclick = function() { openCollabYear(year) };
        currentCollabYear = -1;
        setTimeout(() => {
          allowCollabClose = true;
        }, 100);
      }
    }
  }
}
function ckey2year(key){
  return key.substring(0, 4)
}
function ckey2event(key){
  return key.substring(4,key.indexOf('_'))
}
function ckey2type(key){
  var s = "";
  var i;
  for (i = key.indexOf('_')+1; i <= key.length; i++) {
    var ch = key.charAt(i);
    if (ch == '0' || ch == '1' || ch == '2' || ch == '3' || 
        ch == '4' || ch == '5' || ch == '6' || ch == '7' ||
        ch == '8' || ch == '9') {
    		//console.log(key.charAt(i));
      return s;
    }
    else {
      s += ch;
    }
  }
  console.log("cError! Unable to read match number!")
  return "end of line";
}
function ctype2level(type, key) {
  switch (type) {
    case "qm": { return 0; }
    case "ef": { return 1; }
    case "qf": { return 2; }
    case "sf": { return 3; }
    case "f": { return 4; }
  }
  console.log("cUnkown type "+type+"/"+key);
  return -1;
}
function ckey2match(key) {
  var s = "";
  var i;
  for (i = key.length - 1; i > key.indexOf('_'); i--) {
    var ch = key.charAt(i);
    if (ch == '0' || ch == '1' || ch == '2' || ch == '3' || 
        ch == '4' || ch == '5' || ch == '6' || ch == '7' ||
        ch == '8' || ch == '9') {
    		//console.log(key.charAt(i));
        s = ch + s;
    }
    else {
      return parseInt(s);
    }
  }
  console.log("cError! Unable to read match number!")
  return "end of line";
}
// var collabSorter = function(a, b) {
//   var yearVal = ckey2year(b.key).localeCompare(ckey2year(a.key))
//   if (yearVal == 0) {
//     //Same year, compare event
//     var eventVal = ckey2event(b.key).localeCompare(ckey2event(a.key))
//     if (eventVal == 0) {
//       //Same event, compare type of match
//       var bType = ckey2type(b.key)
//       var aType = ckey2type(a.key)
//       if (ctype2level(bType) == ctype2level(aType)) {
//         //Same type of match, compare number
//         var bMatch = key2match(b.key)
//         var aMatch = key2match(a.key)
//         return bMatch - aMatch
//       }
//       else {
//         return ctype2level(bType) - ctype2level(aType);
//       }
//     }
//     else {
//       return eventVal;
//     }
//   }
//   else {
//     return yearVal;
//   }
// }
var collabSorter = function(a, b) {
  var eventVal = cgetEventData(b.event_key).start_date.localeCompare(cgetEventData(a.event_key).start_date)
  if (eventVal == 0) {
    if (ctype2level(b.comp_level, b.key) == type2level(a.comp_level, a.key)) {
      return parseInt(b.match_number) - parseInt(a.match_number)
    }
    else {
      return ctype2level(b.comp_level, b.key) - type2level(a.comp_level, a.key)
    }
  }
  else {
    return eventVal;
  }
}
// m.sort(function(a, b){
//   //Compare event
//   // var eventVal = b.event_key.localeCompare(a.event_key)
//   var eventVal = getEventData(b.event_key).start_date.localeCompare(getEventData(a.event_key).start_date)
//   if (eventVal == 0) {
//     //Same event, compare type of match
//     if (type2level(b.comp_level,b.key) == type2level(a.comp_level,a.key)) {
//       //Same type of match, compare number
//       return parseInt(b.match_number) - parseInt(a.match_number)
//     }
//     else {
//       return type2level(b.comp_level) - type2level(a.comp_level);
//     }
//   }
//   else {
//     return eventVal;
//   }
// })
function getStats() {
  if (matches.length <= 0 || matches == "?") {
    // console.log("These teams have never played!")
    return;
  }
  if (re) {
    //Enemies
    matches.sort(function(a, b){
      return collabSorter(a, b);
    })
    var teamA = "frc"+ra
    var desc = ""
    var data = 2
    var teamAWins = 0
    var teamBWins = 0
    var ties = 0
    document.getElementById("stats-title").innerHTML = ra + " vs " + rb
    matches.forEach(function(match, index, array) {
      var redIsA = false
      match.alliances.red.team_keys.forEach(function(team, i, a){
        if (team === teamA) {
          redIsA = true;
        }
      })
      var aScore = 0
      var bScore = 0
      if (redIsA) {
        aScore = match.alliances.red.score
        bScore = match.alliances.blue.score
      }
      else {
        aScore = match.alliances.blue.score
        bScore = match.alliances.red.score
      }
      // var s = ra+": "+aScore+" - "+rb+": "+bScore
      // if (aScore == bScore) {
      //   ties++
      //   s += "&nbsp;&nbsp;&nbsp;&nbsp; TIE"
      // }
      // else if (aScore > bScore) {
      //   teamAWins++
      //   s += "&nbsp;&nbsp;&nbsp;&nbsp; WINNER "+ra
      // }
      // else {
      //   teamBWins++
      //   s += "&nbsp;&nbsp;&nbsp;&nbsp; WINNER "+rb
      // }
      // s+="<br>"
      var s = "</td><td>"
      if (aScore == bScore) {
        ties++
        s += "TIE"
      }
      else if (aScore > bScore) {
        teamAWins++
        s += ra+" WINS"
      }
      else {
        teamBWins++
        s += rb+" WINS"
      }
      s += "</td><td>"+match.comp_level.toUpperCase()+match.match_number+"</td><td>"+aScore+"</td><td>"+bScore+`</td><td><a href="https://www.thebluealliance.com/match/`+match.key+`" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a></td></tr>`
      var add = new Mat(ra, rb, parseInt(match.event_key.substring(0,4)), s, cgetEventData(match.event_key).name)
      if (data == 2) {
        data = [add]
        // data = [s]
      }
      else {
        data.push(add)
        // data.push(s)
      }
      // desc += s
    })
    // data.sort((a, b) => a.year - b.year)
    var currentYear = 0
    var currentEvent = "not an event"
    var i = 0
    data.forEach(function(v){ //Foreach Mat in a list of Mats
      if (currentYear != v.year) {
        if (currentYear != 0) {
          desc += "</tbody></table>"
        }
        desc += `<br><div onClick="openCollabYear(`+v.year+`)" id="collabTitle`+v.year+`" class="year unselect"><span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+v.year+`: </b></div><table id="collabTable`+v.year+`" class="table table-bordered" style="display: none;">`
        
        if (true || currentYear == 0) {
          desc += `<thead><tr><th><span class="glyphicon glyphicon-play-circle"></span></th><th>Winner</th><th>Match #</th><th>`+v.teamA+`'s Score</th>
            <th>`+v.teamB+`'s Score</th><th><span class="glyphicon glyphicon-new-window"></span></th></tr>`
        }
        desc += "<tbody>"
        currentYear = v.year
        desc += `<tr><td colspan="6"><b>`+v.eventName+`</b></td></tr>`
        currentEvent = v.eventName
      }
      else {
        if (currentEvent != v.eventName) {
          desc += `<tr><td colspan="6"><b>`+v.eventName+`</b></td></tr>`
          currentEvent = v.eventName
        }
      }
      desc += "<tr><td>"
      if (matches[i].videos.length > 0) {
        desc += `<a href="#" onClick="playMatch(`+i+`)"><span class="glyphicon glyphicon-play-circle"></span></a>`
      }
      desc += v.data;
      i++
    })
    document.getElementById("stats-desc").innerHTML = ra+" wins: "+ teamAWins + "<br>"+rb+" wins: " + teamBWins + "<br>Ties: " + ties + desc
  }
  else {
    //Collab
    matches.sort(function(a, b){
      return collabSorter(a, b);
    })
    document.getElementById("stats-title").innerHTML = ra + " + " + rb + " vs Everyone Else"
    var teamA = "frc"+ra
    var desc = ""
    var data = 2
    var collabWins = 0
    var enemyWins = 0
    var ties = 0
    matches.forEach(function(match, index, array) {
      var isRed = false
      match.alliances.red.team_keys.forEach(function(team, i, a){
        if (team === teamA) {
          isRed = true;
        }
      })
      var collabScore = 0
      var enemyScore = 0
      if (isRed) {
        collabScore = match.alliances.red.score
        enemyScore = match.alliances.blue.score
      }
      else {
        collabScore = match.alliances.blue.score
        enemyScore = match.alliances.red.score
      }
      var s = "</td><td>"
      if (collabScore == enemyScore) {
        ties++
        s += "T"
      }
      else if (collabScore > enemyScore) {
        collabWins++
        s += "W"
      }
      else {
        enemyWins++
        s += "L"
      }
      s += "</td><td>"+match.comp_level.toUpperCase()+match.match_number+"</td><td>"+collabScore+"</td><td>"+enemyScore+`</td><td><a href="https://www.thebluealliance.com/match/`+match.key+`" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a></td></tr>`
      var add = new Mat(ra, rb, parseInt(match.event_key.substring(0,4)), s, cgetEventData(match.event_key).name)
      if (data == 2) {
        data = [add]
        // data = [s]
      }
      else {
        data.push(add)
        // data.push(s)
      }
    })
    // data.sort((a, b) => a.year - b.year)
    var currentYear = 0
    var currentEvent = "not an event"
    var i = 0
    data.forEach(function(v){
      if (currentYear != v.year) {
        if (currentYear != 0) {
          desc += "</tbody></table>"
        }
        desc += `<br><div onClick="openCollabYear(`+v.year+`)" id="collabTitle`+v.year+`" class="year unselect"><span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+v.year+`: </b></div><table id="collabTable`+v.year+`" class="table table-bordered" style="display: none;">`
        if (true || currentYear == 0) {
          desc += `<thead><tr><th><span class="glyphicon glyphicon-play-circle"></span></th><th>W/L/T</th><th>Match #</th><th>`+v.teamA+" + "+v.teamB+`'s Score</th>
            <th>Enemy Score</th><th><span class="glyphicon glyphicon-new-window"></span></th></tr>`
        }
        desc += "<tbody>"
        currentYear = v.year
        desc += `<tr><td colspan="6"><b>`+v.eventName+`</b></td></tr>`
        currentEvent = v.eventName
      }
      else {
        if (currentEvent != v.eventName) {
          desc += `<tr><td colspan="6"><b>`+v.eventName+`</b></td></tr>`
          currentEvent = v.eventName
        }
      }
      desc += "<tr><td>"
      if (matches[i].videos.length > 0) {
        desc += `<a href="#" onClick="playMatch(`+i+`)"><span class="glyphicon glyphicon-play-circle"></span></a>`
      }
      desc += v.data;
      i++
    })
    // console.log(matches)
    document.getElementById("stats-desc").innerHTML = `Overall W/L/T Record: &nbsp;&nbsp; ` + collabWins + " - " + enemyWins + " - " + ties + desc
  }
}
function setup(teamOne, teamTwo, enemies) {
  load(true)
  currentCollabYear = -2;
  document.getElementById("collabPlayer").style.display = "none";
  document.getElementById("collabLoader").style.display = "inline";
  document.getElementById("stats-title").innerHTML = "";
  document.getElementById("stats-desc").innerHTML = "";

  matches = "?"
  getAllYears(teamOne, teamTwo, enemies)
  // OLD TIMEY SLOW CODE
  // setTimeout(() => { 
  //   randomCollab();
  //   getStats();
  // }, 9000);
}
function useTeams() {
  var a = document.getElementById("team1").value.replace(/[^0-9.]/g,"");
  var b = document.getElementById("team2").value.replace(/[^0-9.]/g,"");
  setup(a, b, false)
}
function useEnemies() {
  var a = document.getElementById("team1").value.replace(/[^0-9.]/g,"");
  var b = document.getElementById("team2").value.replace(/[^0-9.]/g,"");
  setup(a, b, true)
}

function creportWindowSize() {
  var h = window.innerHeight;
  var w = window.innerWidth;
  // console.log("New, "+w+"/"+h)
  if (w < 510) {
    var newWidth = w - 60;
    document.getElementById("collabVid").width = newWidth
    var newHeight = Math.floor(315.0 * newWidth / 560.0)
    document.getElementById("collabVid").height = newHeight
  }
}
window.addEventListener('resize', creportWindowSize);
creportWindowSize()

//setup(1114, 2056, false)

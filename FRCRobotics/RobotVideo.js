var g = true;
class Vat {
  constructor(t, y, d, n) {
      this.team = t
      this.year = y
      this.data = d
      this.eventName = n
  }
}
var eventDB = {};
var getEventData = function(eventKey) {
  return eventDB[eventKey]
}
var setEventData = function(eventKey, eventData) {
  eventDB[eventKey] = eventData
}
function videoError(err) {
  document.getElementById("roboError").innerHTML = err
}
function videoLoad(enable) {
    document.getElementById("load").style.display = enable?"inline":"none"
}
videoError("")
videoLoad(false)
document.getElementById("team").addEventListener("keyup", function(event) {
  if (event.keyCode === 13) {
   event.preventDefault();
   document.getElementById("setTeam").click();
  }
});
let debugA = false
function print(x) {
    if (debugA) {
      console.log(x)
    }
}
var currentTask = 0;
var vidsettings = {
    "url": "https://www.thebluealliance.com/api/v3/team/frc67/event/2019mimil/matches",
    "method": "GET",
    "errorAction": function() { console.log("There was an error in RobotVideo.") },
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
  //   function (xhr, ajaxOptions, thrownError){
  //     // if(xhr.status==404) {
  //     //     alert(thrownError);
  //     // }
  //     console.log("!@reror")
  // }
};
m = "?"
rt = 33
theTeam = ""
var vidMatchIndex = 0
var vidIndex = 0
function nextOneIndex() { vidIndex++; document.getElementById("robotVideo").src = "https://www.youtube.com/embed/"+m[vidMatchIndex].videos[vidIndex%m[vidMatchIndex].videos.length].key; }
function previousVideo() { 
  vidMatchIndex++; 
  if (vidMatchIndex >= m.length) {
    vidMatchIndex = 0;
  }
  document.getElementById("robotVideo").src = "https://www.youtube.com/embed/"+m[vidMatchIndex].videos[vidIndex%m[vidMatchIndex].videos.length].key; 
}
function nextVideo() { vidMatchIndex--; 
  if (vidMatchIndex < 0) {
    vidMatchIndex = m.length - 1;
  }
  document.getElementById("robotVideo").src = "https://www.youtube.com/embed/"+m[vidMatchIndex].videos[vidIndex%m[vidMatchIndex].videos.length].key; }
function playVideoMatch(indexToPlay) {
  vidMatchIndex = indexToPlay
  document.getElementById("robotVideo").src = "https://www.youtube.com/embed/"+m[vidMatchIndex].videos[vidIndex%m[vidMatchIndex].videos.length].key
}
function randomVideo() {
  if (m.length <= 0 || m == "?") {
    if (g) {
      g = false
      useTeam(rt)
      return
    }
    else {
      videoLoad(false)
      videoError("No matches were found! Try again?")
      return
    }
  }
  else {
    g = true
    videoError("")
  }
  videoLoad(false)
  var tryIndex = Math.floor(Math.random() * m.length)
  var match = m[tryIndex];
  while(match.videos.length <= 0) {
    tryIndex = Math.floor(Math.random() * m.length)
    match = m[tryIndex];
  }
  playVideoMatch(tryIndex)
}
let currentVideoYear = -2;
let allowOpenClose = true;
function openVideoYear(year) {
  if (allowOpenClose) {
    allowOpenClose = false;
    document.getElementById("videoTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-up"></span> &nbsp; <b>`+year+`: </b>`
    document.getElementById("videoTable"+year).style.display = "inline-block"
    document.getElementById("videoTitle"+year).onclick = function() { closeVideoYear(year, false) };
    closeVideoYear(currentVideoYear, true)
    currentVideoYear = year;
    setTimeout(() => {
      allowOpenClose = true;
    }, 100);
  }
  // setTimeout(() => { 
  //   randomVideo();
  //   getTeamStats();
  // }, 9000);
}
function closeVideoYear(year, auto) {
  if (auto) {
    if (year > 0) {
      document.getElementById("videoTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+year+`: </b>`
      document.getElementById("videoTable"+year).style.display = "none"
      document.getElementById("videoTitle"+year).onclick = function() { openVideoYear(year) };
      currentVideoYear = -1;
    }
  }
  else {
    if (allowOpenClose) {
      if (year > 0) {
        allowOpenClose = false;
        document.getElementById("videoTitle"+year).innerHTML = `<span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+year+`: </b>`
        document.getElementById("videoTable"+year).style.display = "none"
        document.getElementById("videoTitle"+year).onclick = function() { openVideoYear(year) };
        currentVideoYear = -1;
        setTimeout(() => {
          allowOpenClose = true;
        }, 100);
      }
    }
  }
}
function key2year(key){
  return key.substring(0, 4)
}
function key2event(key){
  return key.substring(4,key.indexOf('_'))
}
function key2type(key){
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
  console.log("Error! Unable to read match type!")
  return "end of line";
}
function type2level(type,key) {
  switch (type) {
    case "qm": { return 0; }
    case "ef": { return 1; }
    case "qf": { return 2; }
    case "sf": { return 3; }
    case "f": { return 4; }
  }
  console.log("Unkown type "+type+"/"+key);
  return -1;
}
function key2match(key) {
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
  console.log("Error! Unable to read match number!")
  return "end of line";
}
function getTeamStats() {
  if (m.length <= 0 || m == "?") {
    videoError("No matches were found! Try again?")
    return
  }
  // m.sort(function(a, b){
  //   var yearVal = key2year(b.key).localeCompare(key2year(a.key))
  //   if (yearVal == 0) {
  //     //Same year, compare event
  //     var eventVal = key2event(b.key).localeCompare(key2event(a.key))
  //     if (eventVal == 0) {
  //       //Same event, compare type of match
  //       var bType = key2type(b.key)
  //       var aType = key2type(a.key)
  //       if (type2level(bType,b.key) == type2level(aType,a.key)) {
  //         //Same type of match, compare number
  //         var bMatch = key2match(b.key)
  //         var aMatch = key2match(a.key)
  //         return bMatch - aMatch
  //       }
  //       else {
  //         return type2level(bType) - type2level(aType);
  //       }
  //     }
  //     else {
  //       return eventVal;
  //     }
  //   }
  //   else {
  //     return yearVal;
  //   }
  // })
  m.sort(function(a, b){
    //Compare event
    // var eventVal = b.event_key.localeCompare(a.event_key)
    var eventVal = getEventData(b.event_key).start_date.localeCompare(getEventData(a.event_key).start_date)
    if (eventVal == 0) {
      //Same event, compare type of match
      if (type2level(b.comp_level,b.key) == type2level(a.comp_level,a.key)) {
        //Same type of match, compare number
        return parseInt(b.match_number) - parseInt(a.match_number)
      }
      else {
        return type2level(b.comp_level) - type2level(a.comp_level);
      }
    }
    else {
      return eventVal;
    }
  })
  var team = "frc"+rt
  var desc = ""
  var data = 2
  var wins = 0
  var loses = 0
  var ties = 0
  //start paste
  document.getElementById("team-title").innerHTML = "Team " + rt + " Stats"
  m.forEach(function(match, index, array) {
    var isRed = false
    match.alliances.red.team_keys.forEach(function(t, i, a){
      if (team === t) {
        isRed = true;
      }
    })
    var myScore = 0
    var theirScore = 0
    if (isRed) {
      myScore = match.alliances.red.score
      theirScore = match.alliances.blue.score
    }
    else {
      myScore = match.alliances.blue.score
      theirScore = match.alliances.red.score
    }
    var s = "</td><td>"
    if (myScore == theirScore) {
      ties++
      s += "T"
    }
    else if (myScore > theirScore) {
      wins++
      s += "W"
    }
    else {
      loses++
      s += "L"
    }
    // s += "</td><td>"+rt+": </td><td>"+myScore+"</td><td>Enemy:</td><td>"+theirScore+`</td><td><a href="https://www.thebluealliance.com/match/`+match.key+`" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a></td></tr>`
    s += "</td><td>"+match.comp_level.toUpperCase()+match.match_number+"</td><td>"+myScore+"</td><td>"+theirScore+`</td><td><a href="https://www.thebluealliance.com/match/`+match.key+`" target="_blank"><span class="glyphicon glyphicon-new-window"></span></a></td></tr>`
    var add = new Vat(rt, parseInt(match.event_key.substring(0,4)), s, getEventData(match.event_key).name)
    if (data == 2) {
      data = [add]
    }
    else {
      data.push(add)
    }
  })
  var currentYear = 0
  var currentEvent = "not an event"
  var i = 0
  data.forEach(function(v){ //Foreach Vat v in a list of Vats
    if (currentYear != v.year) {
      if (currentYear != 0) {
        // desc += "</tbody></table>"
        desc += "</table>"
      }
      desc += `<br><div onClick="openVideoYear(`+v.year+`)" id="videoTitle`+v.year+`" class="year unselect"><span class="glyphicon glyphicon-chevron-down"></span> &nbsp; <b>`+v.year+`: </b></div><table id="videoTable`+v.year+`" class="table table-bordered" style="display: none;">`
      
      if (true || currentYear == 0) {
        // desc += `<thead><tr><th><span class="glyphicon glyphicon-play-circle"></span></th><th>W/L/T</th><th>Team</th><th>Team's Score</th>
        //   <th>Enemy</th><th>Enemy Score</th><th><span class="glyphicon glyphicon-new-window"></span></th></tr>`
          // desc += `<thead><tr><th><span class="glyphicon glyphicon-play-circle"></span></th><th>W/L/T</th><th>Match #</th><th>`+v.team+`'s Score</th>
          //   <th>Enemy Score</th><th><span class="glyphicon glyphicon-new-window"></span></th></tr>`
            desc += `<tr><th><span class="glyphicon glyphicon-play-circle"></span></th><th>W/L/T</th><th>Match #</th><th>`+v.team+`'s Score</th>
              <th>Enemy Score</th><th><span class="glyphicon glyphicon-new-window"></span></th></tr>`
      }
      //desc += "<tbody>"
      currentYear = v.year
    }
    if (currentEvent != v.eventName) {
      desc += `<tr><td colspan="6"><b>`+v.eventName+`</b></td></tr>`
      currentEvent = v.eventName
    }
    desc += "<tr><td>"
    if (m[i].videos.length > 0) {
      desc += `<a href="#" onClick="playVideoMatch(`+i+`)"><span class="glyphicon glyphicon-play-circle"></span></a>`
    }
    desc += v.data;
    i++
  })
  document.getElementById("team-desc").innerHTML = wins + " - " + loses + " - " + ties + desc
  //end paste
}
let totalEvents = 0;
let currentEvent = 0;
function gotAllMatches(){
  randomVideo();
  getTeamStats();
}
var ad = function(newData) { //Collect the matches from one event.
  
  if (m == "?") {
    m = newData
  }
  else {
    m = m.concat(newData)
  }
  currentEvent++;
  if (currentEvent >= totalEvents) {
    document.getElementById("videoPlayer").style.display = "inline";
    document.getElementById("videoLoader").style.display = "none";
    gotAllMatches();
  }
  else {
    var eventPercent = Math.floor((1.0 * currentEvent / totalEvents * 1.0) * 100.0);
    document.getElementById("videoLoader").innerHTML = "<i>Finding matches "+eventPercent+"%</i>"
  }
}
function getTeamMatches(team, year) { //Get all matches from a team's year by going through each event in that year.
  vidsettings.url = "https://www.thebluealliance.com/api/v3/team/frc"+team+"/events/"+year
  
  currentEvent = 0
  totalEvents = 0
  $.ajax(vidsettings).done(function(response){ //Get a list of events
    totalEvents += response.length;
    response.forEach(function(value, index, array){ //Foreach event in eventList
      vidsettings.url = "https://www.thebluealliance.com/api/v3/team/frc"+team+"/event/"+value.key+"/matches"
      setEventData(value.key, value)
      $.ajax(vidsettings).done(ad);
    })
  })
}
function foundRookieYear(rt, rookieYear, team) {
  if (rookieYear < 10) {
    if (g) {
      g = false;
      useTeam(rt)
      return
    }
    else {
      load(false)
      videoError("Unable to find team "+team)
      return
    }
  }
  else {
    //good = true
  }
  videoError("")
  var i;
  for (i = rookieYear; i <= 2020; i++) {
    getTeamMatches(team, i)
  }
}
function getAllMatches(team) {
  theTeam = "frc"+team
  rt = team
  var rookieYear = 0
  vidsettings.url = "https://www.thebluealliance.com/api/v3/team/frc"+team
  vidsettings.errorAction = function() {
    videoError("Unable to find team "+team)
    videoLoad(false)
    //document.getElementById("loading").style.display = enable?"inline":"none"
  }
  document.getElementById("videoLoader").innerHTML = "<i>Finding data for team "+team+"...</i>"
  $.ajax(vidsettings).done(function(response){
    rookieYear = response.rookie_year
    foundRookieYear(rt, rookieYear, team)
  })
  // setTimeout(() => {
  //   if (rookieYear < 10) {
  //     if (g) {
  //       g = false;
  //       useTeam(rt)
  //       return
  //     }
  //     else {
  //       load(false)
  //       videoError("Unable to find team "+team)
  //       return
  //     }
  //   }
  //   else {
  //     //good = true
  //   }
  //   videoError("")
  //   var i;
  //   for (i = rookieYear; i <= 2020; i++) {
  //     getTeamMatches(team, i)
  //   }
  // }, 1000);
}
function useTeam(team) {
  videoLoad(true)
  document.getElementById("videoPlayer").style.display = "none";
  document.getElementById("videoLoader").style.display = "inline";
  document.getElementById("team-title").innerHTML = "";
  document.getElementById("team-desc").innerHTML = "";
  m = "?"
  currentVideoYear = -3
  getAllMatches(team)
  // setTimeout(() => { 
  //   randomVideo();
  //   getTeamStats();
  // }, 9000);
}
function setTeam() {
  var a = document.getElementById("team").value.replace(/[^0-9.]/g,"");
  useTeam(a)
}
function reportWindowSize() {
  var h = window.innerHeight;
  var w = window.innerWidth;
  // console.log("New, "+w+"/"+h)
  if (w < 510) {
    var newWidth = w - 60;
    document.getElementById("robotVideo").width = newWidth
    var newHeight = Math.floor(315.0 * newWidth / 560.0)
    document.getElementById("robotVideo").height = newHeight
  }
}
window.addEventListener('resize', reportWindowSize);
reportWindowSize()

//useTeam(67)
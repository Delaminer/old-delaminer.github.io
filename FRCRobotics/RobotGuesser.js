function isEquivalent(a, b) {
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}
var houston = {"2020": "Houston"};
class Filter {
    constructor(at, bt, c, s, ar, br, d, h) {
        this.min_team = at;
        this.max_team = bt;
        this.countries = c;
        this.states = s;
        this.min_rookie = ar;
        this.max_rookie = br;
        this.detroit = d;
        this.houston = h;
    }
    qualify(team) {
        if (!(this.countries.toString() === "")) {
            let country = false;
            this.countries.forEach(function(c){
                if (c === team.country) {
                    country = true;
                }
            })
            if (!country){
                return false;
            } 
        }
        if (!(this.states.toString() === "")) {
            let state = false;
            this.states.forEach(function(s){
                if (s === team.state_prov)
                    state = true;
            })
            if (!state) return false;
        }
        let teamNumber = parseInt(team.team_number);
        if (teamNumber < this.min_team || teamNumber > this.max_team) return false;
        let rookieYear = parseInt(team.rookie_year);
        if (rookieYear < this.min_rookie || rookieYear > this.max_rookie) return false;
        if (this.detroit) {
            return this.houston || !isEquivalent(team.home_championship, houston);
        }
        else {
            return this.houston && isEquivalent(team.home_championship, houston);
        }
    }
    str() {
        return "Filter: (Teams "+this.min_team+" - "+this.max_team+", Countries: "+this.countries.toString()+", States: "+this.states.toString()+
        " Rookie Years: "+this.min_rookie+" - "+this.max_rookie+", D: "+this.detroit+", H: "+this.houston;
    }
}
document.getElementById("guesserNumber").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
    event.preventDefault();
    document.getElementById("guessNumber").click();
    }
});
var teams = "?"
var nameHint = document.getElementById("p1");
var givenName = false;
var numberHint = document.getElementById("p2");
var givenNumber = false;
// var guess = document.getElementById("guesser")
var number_selected = 0
var name_selected = 0
var numCorrect = 0
var numWrong = 0
var guessNumber = function() {
    // var g = guess.value
    var g = document.getElementById("guesserNumber").value.replace(/[^0-9.]/g,"");
    if (g == teams[number_selected].team_number) {
        numCorrect++;
    }
    else {
        numWrong++;
    }
    givenName = false;
    givenNumber = false;
    updateNameGame();
    updateNumberGame();
}
var guessName = function(index) {
    // var g = guess.value
    var g = document.getElementById("nameCard"+index).innerHTML;
    // console.log(teams[name_selected].team_number+": "+g + " vs " + teams[name_selected].nickname)
    if (g === teams[name_selected].nickname) {
        numCorrect++;
    }
    else {
        numWrong++;
    }
    givenName = false;
    givenNumber = false;
    updateNameGame();
    updateNumberGame();
}
var settings = {
    "url": "https://www.thebluealliance.com/api/v3/teams/2020/0",
    "method": "GET",
    "timeout": 0,
    "headers": {
      "X-TBA-Auth-Key": "3UaMBx72hIhbqcytpMTpBPVgcabzmitWR0Owv9HRogxJBVF9iJfq86jtVWWJkC6I"
    },
};
var current = 0
function updateNumberGame() {
    if (!givenNumber) {
        givenNumber = true;
        number_selected = Math.floor(Math.random() * teams.length);
        numberHint.innerHTML = "What team is \'"+teams[number_selected].nickname+"\'?";// ("+teams[number_selected].team_number+")";
        document.getElementById("guesserNumber").value = "";
        let total = numCorrect + numWrong;
        let grade = 0;
        if (total > 0) {
            grade = Math.floor(100.0 * numCorrect / total);
        }
        document.getElementById("score").innerHTML = "Score: "+numCorrect+"/"+total+" ("+grade+"%)";
    }
}
var filterType = 0;
var filterData = "No Filter";
let triesLeft = 999999;
function getFilteredTeamIndex() {
    let t;
    let good;
    do {
        triesLeft--;
        t = Math.floor(Math.random() * teams.length);
        switch (filterType) {
            case 0: {
                good = true;
            }
            break;
            case 1: {
                good = teams[t].state_prov === filterData;
            }
            break;
            case 2: {
                good = teams[t].country === filterData;
            }
            break;
            case 3: {
                good = parseInt(teams[t].team_number) < parseInt(filterData);
            }
            break;
            case 4: {
                good = parseInt(teams[t].rookie_year) == parseInt(filterData);
            }
            break;
            case 5: {
                good = isEquivalent(teams[t].home_championship, houston) ^ (filterData === "Detroit");
            }
            break;
            case 6: {
                good = filterData.qualify(teams[t]);
            }
            break;
        }
      } while (!good && triesLeft > 0);
      if (triesLeft < 0) {
        return -1;
      }
    return t;
}
function getRandomTeam(realTeams) {
    let t;
    let taken = true;
    do {
        t = getFilteredTeamIndex();
        if (t < 0) return t;
        taken = false;
        realTeams.forEach(function(value) {
            if (t == value) {
                taken = true
            }
        })
      } while (taken);
    return t;
}
var cards = 6;
var teamChoices = []
function updateNameGame() {
    if (!givenName) {
        givenName = true;
        triesLeft = 999999 * cards;
        var takenTeams = []
        name_selected = getFilteredTeamIndex(takenTeams);
        if (name_selected < 0) {

            nameHint.innerHTML = "I'm sorry, not enough teams could be found within those parameters. Try again, or try using a different filter.";
            document.getElementById("flashcards").innerHTML = `<button class="flashcard">Error :(</button><br>`;
            return;
        }
        takenTeams.push(name_selected)
        var correctChoice = Math.floor(Math.random() * cards);
        var s = "";
        var i;
        for (i = 0; i < cards; i++) {
            var team_index = -1;
            if (i == correctChoice) {
                team_index = name_selected;
            }
            else {
                team_index = getRandomTeam(takenTeams);
                if (team_index < 0) {
                    nameHint.innerHTML = "I'm sorry, not enough teams could be found within those parameters. Try again, or try using a different filter.";
                    document.getElementById("flashcards").innerHTML = `<button class="flashcard">Error :(</button><br>`;
                    return;
                }
                takenTeams.push(team_index)
            }
            var team_name = teams[team_index].nickname;
            var team_num = teams[team_index].team_number;
            s += `<button class="flashcard" onclick="guessName(`+i+`)" id="nameCard`+i+`">`+team_name+`</button>`;
            if (i % 2 == 1) {
                s += "<br>";
            }
        }
        nameHint.innerHTML = "Who is team "+teams[name_selected].team_number+"?"
        document.getElementById("flashcards").innerHTML = s;
    }
}
var listLength = 23;
var sum = 0;
function addTeams(data) {
    if (teams == "?") {
        teams = data;
    }
    else {
        teams = teams.concat(data);
    }
    sum++;
    if (sum >= listLength) {
        teams.sort((a, b) => a.team_number - b.team_number);
        document.getElementById("guess-main").style.display = "inline";
        document.getElementById("guess-loading").style.display = "none";
        updateNumberGame();
        updateNameGame();
    }
    else {
        var progressPercent = Math.floor((1.0 * sum / listLength * 1.0) * 100.0);
        document.getElementById("loading-progress").innerHTML = progressPercent+"%";
    }
}
let bootedUp = false;
function bootUp() {
    if (!bootedUp) {
        bootedUp = true;
        var i;
        for (i = 0; i < listLength; i++) {
            settings.url = "https://www.thebluealliance.com/api/v3/teams/2020/"+i
            $.ajax(settings).done(addTeams);
        }
    }
}
function stopLoadingTeams() {
    teams.sort((a, b) => a.team_number - b.team_number);
    document.getElementById("guess-main").style.display = "inline";
    document.getElementById("guess-loading").style.display = "none";
    updateNumberGame();
    updateNameGame();
}
// let mode = document.getElementById("toggleGuessModeCheckbox");
// function toggleGuessMode() {
//     console.log("CHECK: "+mode.checked);
// }
function guessNames() {
    document.getElementById("guess_enableNames").classList.add("btn-success");
    document.getElementById("guess_enableNames").classList.remove("btn-default");
    document.getElementById("guess_enableNumbers").classList.remove("btn-success");
    document.getElementById("guess_enableNumbers").classList.add("btn-default");

    document.getElementById("guess-names").style.display = "inline";
    document.getElementById("guess-numbers").style.display = "none";
    updateNameGame();
}
function guessNumbers() {
    document.getElementById("guess_enableNames").classList.remove("btn-success");
    document.getElementById("guess_enableNames").classList.add("btn-default");
    document.getElementById("guess_enableNumbers").classList.add("btn-success");
    document.getElementById("guess_enableNumbers").classList.remove("btn-default");

    document.getElementById("guess-names").style.display = "none";
    document.getElementById("guess-numbers").style.display = "inline";
    updateNumberGame();
}
function selectFilter(newFilterType, newFilterData, newName) {
    filterType = newFilterType;
    filterData = newFilterData;
    document.getElementById("dropdownMenu1").innerHTML = newName + ` <span class="caret"></span>`;
    givenName = false;
    givenNumber = false;
    updateNameGame();
    updateNumberGame();
}
function customFilter() {
    document.getElementById("filter-editor").style.display = "inline-block";
}
function closeCustomFilter() {
    document.getElementById("filter-editor").style.display = "none";
}
function useCustomFilter() {
    filterType = 6;
    let aTeam = parseInt(document.getElementById("customFilter-minTeam").value);
    let bTeam = parseInt(document.getElementById("customFilter-maxTeam").value);
    let countries = document.getElementById("customFilter-countries").value.split(',');
    let states = document.getElementById("customFilter-states").value.split(',');
    //console.log("Using C: "+countries.toString()+" and S: "+states.toString())
    let aRookie = parseInt(document.getElementById("customFilter-minRookie").value);
    let bRookie = parseInt(document.getElementById("customFilter-maxRookie").value);
    let detorit = document.getElementById("customFilter-detroit").checked == true;
    let houston = document.getElementById("customFilter-houston").checked == true;

    filterData = new Filter(aTeam, bTeam, countries, states, aRookie, bRookie, detorit, houston);
    //console.log("Creating filter "+filterData.str());
    document.getElementById("dropdownMenu1").innerHTML = `Custom Filter <span class="caret"></span>`;
    closeCustomFilter();
    givenName = false;
    givenNumber = false;
    updateNameGame();
    updateNumberGame();
}

function skipGuess() {
    givenName = false;
    givenNumber = false;
    updateNameGame();
    updateNumberGame();
}
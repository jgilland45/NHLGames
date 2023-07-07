eachYearofGames = [];

async function testFetch() {
    result = await fetch("https://statsapi.web.nhl.com/api/v1/seasons");
    result.json().then(json => {
        for (var i=0; i<json.seasons.length; i++) {
            var seasonString = json.seasons[i].seasonId;
            getSeason(seasonString);
        }
    });
}

async function getSeason(seasonID) {
    var input = document.getElementById("yearInput");
    //var seasonID = input.value;
    console.log("INPUT TEXT: " + seasonID);
    season = await fetch("https://statsapi.web.nhl.com/api/v1/schedule?season=" + seasonID);
    season.json().then(json => {
        var newYear = new YearofGames();
        for (var i=0; i<json.dates.length; i++) {
            for (var j=0; j<json.dates[i].games.length; j++) {
                var gameString = json.dates[i].games[j].link;
                // i cant just do this because it calls the API too many times too fast
                // need to find a way to not overload the system
                setTimeout(() => { 
                    getGame(gameString, newYear);
                }, 5000);
            }
            //break;
        }
        eachYearofGames.push(newYear);
    });
}

async function getGame(gameLink, gameYear) {
    game = await fetch("https://statsapi.web.nhl.com" + gameLink);
    game.json().then(json => {
        gameYear.addGame(json);
        //console.log(json);
    });
    
}
// continue trying this from https://stackoverflow.com/questions/33289726/combination-of-async-function-await-settimeout
function timeout(ms) {

}

function printAllYears() {
    for (var i in eachYearofGames) {
        console.log(i);
    }
}

class YearofGames {
	constructor() {
		this.games = [];
	}
    getGames() {
        return this.games;
    }
    addGame(newGame) {
        this.games.push(newGame);
    }
}

class Game {
    constructor(game) {
        this.game = game;
    }
}

testFetch();
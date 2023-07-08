eachYearofGames = [];


function testFetch() {
    axios.get('https://statsapi.web.nhl.com/api/v1/seasons')
		.then((response) => {
            //console.log(response.data);
            /*
        for (var i=0; i<response.data.seasons.length; i++) {
            var seasonString = response.data.seasons[i].seasonId;
            getSeason(seasonString);
        }
        */
        getSeason('20222023');
        printAllYears();
    });
}

function getSeason(seasonID) {
    var input = document.getElementById("yearInput");
    //var seasonID = input.value;
    console.log("INPUT TEXT: " + seasonID);
    axios.get("https://statsapi.web.nhl.com/api/v1/schedule?season=" + seasonID)
        .then(async (response) => {
        var newYear = new YearofGames();
        for (var i=1; i<response.data.dates.length; i++) {
            for (var j=0; j<response.data.dates[i].games.length; j++) {
                
                //fetchGameData("https://statsapi.web.nhl.com" + json.dates[i].games[j].link);
                
                var gameString = response.data.dates[i].games[j].link;
                // i cant just do this because it calls the API too many times too fast
                // need to find a way to not overload the system
                await sleep(100);
                getGame(gameString, newYear);
            }
            //if (i>2) break;
        }
        eachYearofGames.push(newYear);
    });
}

function getGame(gameLink, gameYear) {
    axios.get("https://statsapi.web.nhl.com" + gameLink)
        .then((response) => {
        gameYear.addGame(response.data);
        console.log(response.data);
    });
}

//Sleep please
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function printAllYears() {
    for (var i in eachYearofGames) {
        console.log(eachYearofGames[i].getGames());
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
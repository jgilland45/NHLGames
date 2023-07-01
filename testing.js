
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
    season = await fetch("https://statsapi.web.nhl.com/api/v1/schedule?season=" + seasonID);
    season.json().then(json => {
        for (var i=0; i<json.dates.length; i++) {
            for (var j=0; j<json.dates[i].games.length; j++) {
                var gameString = json.dates[i].games[j].link;
                // i cant just do this because it calls the API too many times too fast
                // need to find a way to not overload the system
                getGame(gameString);
            }
            break;
        }
    });
}

async function getGame(gameLink) {
    game = await fetch("https://statsapi.web.nhl.com" + gameLink);
    season.json().then(json => {
        console.log(json);
    });
}

testFetch();
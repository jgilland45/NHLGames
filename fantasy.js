var allPlayers = [];
var allTeams = [];
var numPlayers = 0;

class Team {
	constructor(name, id, year) {
		this.name = name;
		this.id = id;
		this.year = year;
		this.games = [];
	}

	setGamesInWeek(games) {
		this.games = games;
	}

	getGamesInWeek() {
		return this.games;
	}

	getID() {
		return this.id;
	}

	getName() {
		return this.name;
	}
}

class Player {
	constructor(name, id, position, team) {
		this.name = name;
		this.id = id;
		this.position = position;
		this.fantasyPoints = 0;
		this.projected = 0;
		this.team = team;
		if (position == "G") {
			this.ga = 0;
			this.saves = 0;
			this.wins = 0;
			this.shutouts = 0;
			this.gamesPlayed = 0;
		}
		else {
			this.goals = 0;
			this.assists = 0;
			this.points = this.goals + this.assists;
			this.gamesPlayed = 0;
			this.pim = 0;
			this.shots = 0;
			this.blocks = 0;
			this.hits = 0;
			this.faceoffPct = 0;
			this.shifts = 0;
			this.ppp = 0;
			this.shp = 0;
			this.plusMinus = 0;
		}
	}

	setGStats(ga, saves, gamesPlayed, wins, shutouts) {
		this.ga = ga;
		this.saves = saves;
		this.wins = wins;
		this.shutouts = shutouts;
		this.gamesPlayed = gamesPlayed;
	}

	setStats(goals, assists, gamesPlayed, pim, shots, blocks, hits, faceoffPct, shifts, ppp, shp, plusMinus, faceoffWon) {
		this.goals = goals;
		this.assists = assists;
		this.points = goals + assists;
		this.gamesPlayed = gamesPlayed;
		this.pim = pim;
		this.shots = shots;
		this.blocks = blocks;
		this.hits = hits;
		this.faceoffPct = faceoffPct;
		this.shifts = shifts;
		this.ppp = ppp;
		this.shp = shp;
		this.plusMinus = plusMinus;
		this.faceoffWon = faceoffWon;
	}

	setFantasyPoints(fantasyPoints) {
		this.fantasyPoints = fantasyPoints;
	}

	setProjected(projected) {
		this.projected = projected;
	}

	getProjected() {
		return this.projected;
	}

	getFantasyPoints() {
		return this.fantasyPoints;
	}

	getStats(playerPosition) {
		if (playerPosition == "G") {
			return [this.ga, this.saves, this.gamesPlayed, this.wins, this.shutouts];
		}
		else {
			return [this.goals, this.assists, this.points, this.gamesPlayed, this.pim, this.shots, this.blocks, this.hits, this.faceoffPct, this.shifts, this.ppp, this.shp, this.plusMinus, this.faceoffWon];
		}
	}

	getGamesPlayed() {
		return this.gamesPlayed;
	}

	getID() {
		if(this.id!=undefined){
			return(this.id);
		}
		else {
			return("NO ID");
		}
	}

	getPosition() {
		if(this.position!=undefined){
			return(this.position);
		}
		else {
			return("NO position");
		}
	}

	getName() {
		if(this.name!=undefined){
			return(this.name);
		}
		else {
			return("NO name");
		}
	}
}

//from https://dev.to/vaishnavme/displaying-loading-animation-on-fetch-api-calls-1e5m
// selecting loading div
var loader = document.getElementById("loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time
    setTimeout(() => {
        loader.classList.remove("display");
    }, 100000);
}

// hiding loading 
function hideLoading() {
    //loader.classList.remove("display");
		loader.style.display = 'none';
}

//resets all of the arrays
function reset() {
allPlayers = [];
allTeams = [];
numPlayers = 0;
}


function fantasy() {
	reset();
    getAllTeamIds();
}

function getAllTeamIds() {
    displayLoading();
    axios.get('https://statsapi.web.nhl.com/' + 'api/v1/teams')
		.then((response) => {
            for(i=0;i<response.data.teams.length;i++) {
				allTeams[i] = new Team(response.data.teams[i].name,response.data.teams[i].id);
				if(i==response.data.teams.length-1) {
					for(k=0;k<allTeams.length;k++) {
						getWeeklySchedule(k);
					}
				}
			}
            console.log(allTeams);
        })
}

function getWeeklySchedule(k) {
	// date works like YEAR-MONTH-DAY
	currentDate = new Date();
	var endOfWeekDate = {};
	if ((((currentDate.getMonth()+1) < 7) && ((currentDate.getMonth()+1) % 2 == 1)) || (((currentDate.getMonth()+1) > 6) && ((currentDate.getMonth()+1) % 2 == 0))) {
		console.log("THIS IS A MONTH WITH 31 DAYS");
		if ((currentDate.getDate() + (7-currentDate.getDay()) <= 31)) {
			var month = currentDate.getMonth()+1;
			var day = currentDate.getDate() + (7-currentDate.getDay());
			var year = currentDate.getFullYear();
		}
		else {
			if ((currentDate.getMonth()+1) == 12) {
				console.log("THIS IS DECEMBER");
				var month = 1;
				var year = currentDate.getFullYear()+1;
			}
			else {
				var month = currentDate.getMonth()+2;
				var year = currentDate.getFullYear();
			}
			var day = 7-(31-currentDate.getDate())-currentDate.getDay();
		}
		endOfWeekDate.month = month;
		endOfWeekDate.day = day;
		endOfWeekDate.year = year;
		/*console.log("END OF WEEK MONTH " + endOfWeekDate.month);
		console.log("END OF WEEK DAY " + endOfWeekDate.day);
		console.log("END OF WEEK YEAR " + endOfWeekDate.year);*/
	}
	else if ((currentDate.getMonth()+1) == 2) {
		if(currentDate.getFullYear() % 4 == 0) {
			console.log('THIS IS A LEAP YEAR');
			if ((currentDate.getDate() + (7-currentDate.getDay()) <= 29)) {
				var month = currentDate.getMonth()+1;
				var day = currentDate.getDate() + (7-currentDate.getDay());
				var year = currentDate.getFullYear();
			}
			else {
				if (currentDate.getMonth() == 12) {
					var month = 1;
					var year = currentDate.getFullYear()+1;
				}
				else {
					var month = currentDate.getMonth()+2;
					var year = currentDate.getFullYear();
				}
				var day = 7-(29-currentDate.getDate())-currentDate.getDay();
			}
		}
		else {
			console.log("THIS IS NOT A LEAP YEAR");
			if ((currentDate.getDate() + (7-currentDate.getDay()) <= 28)) {
				var month = currentDate.getMonth()+1;
				var day = currentDate.getDate() + (7-currentDate.getDay());
				var year = currentDate.getFullYear();
			}
			else {
				if (currentDate.getMonth() == 12) {
					var month = 1;
					var year = currentDate.getFullYear()+1;
				}
				else {
					var month = currentDate.getMonth()+2;
					var year = currentDate.getFullYear();
				}
				var day = 7-(28-currentDate.getDate())-currentDate.getDay();
			}
		}
		endOfWeekDate.month = month;
		endOfWeekDate.day = day;
		endOfWeekDate.year = year;
		/*console.log("END OF WEEK MONTH " + endOfWeekDate.month);
		console.log("END OF WEEK DAY " + endOfWeekDate.day);
		console.log("END OF WEEK YEAR " + endOfWeekDate.year);*/
		console.log("THIS IS FEBRUARY");
	}
	else {
		console.log("THIS IS A MONTH WITH 30 DAYS");
		if ((currentDate.getDate() + (7-currentDate.getDay()) <= 30)) {
			var month = currentDate.getMonth()+1;
			var day = currentDate.getDate() + (7-currentDate.getDay());
			var year = currentDate.getFullYear();
		}
		else {
			if (currentDate.getMonth() == 12) {
				var month = 1;
				var year = currentDate.getFullYear()+1;
			}
			else {
				var month = currentDate.getMonth()+2;
				var year = currentDate.getFullYear();
			}
			var day = 7-(30-currentDate.getDate())-currentDate.getDay();
		}
		endOfWeekDate.month = month;
		endOfWeekDate.day = day;
		endOfWeekDate.year = year;
		/*console.log("END OF WEEK MONTH " + endOfWeekDate.month);
		console.log("END OF WEEK DAY " + endOfWeekDate.day);
		console.log("END OF WEEK YEAR " + endOfWeekDate.year);*/
	}

	//console.log(currentDate);
	//console.log(endOfWeekDate);
	
	axios.get('https://statsapi.web.nhl.com/api/v1/schedule' + '?teamId=' + allTeams[k].getID() + '&startDate=' + currentDate.getFullYear() + '-' + (currentDate.getMonth()+1).toString() + '-' + currentDate.getDate() + '&endDate=' + endOfWeekDate.year + '-' + endOfWeekDate.month + '-' + endOfWeekDate.day)
		.then((response) => {
			var numGames = response.data.dates.length;
			//console.log("NUMGAMES: " + numGames);
			var games = [];
			for (i=0;i<numGames;i++) {
				if (response.data.dates[0].games[0].teams.away.team.name == allTeams[k].getName()) {
					games.push({'opponent': response.data.dates[i].games[0].teams.home.team.name});
				}
				else {
					games.push({'opponent': response.data.dates[i].games[0].teams.away.team.name});
				}
			}
			allTeams[k].setGamesInWeek(games);
			if(k==allTeams.length-1) {
				console.log(allTeams);
				getAllPlayerLinks();
			}
		})
}

function getAllPlayerLinks() {
    axios.get('https://statsapi.web.nhl.com/' + 'api/v1/teams/' + '?teamId=' + "&expand=team.roster")
		.then((response) => {
            for(i=0;i<allTeams.length;i++) {
                for(j=0;j<response.data.teams[i].roster.roster.length;j++) {
                    allPlayers[numPlayers+j] = new Player(response.data.teams[i].roster.roster[j].person.fullName,response.data.teams[i].roster.roster[j].person.id,response.data.teams[i].roster.roster[j].position.code,allTeams[i]);
                }
				numPlayers+=response.data.teams[i].roster.roster.length;
            }
            console.log(allPlayers);
			getPlayerStats();
        })
}

function getPlayerStats() {
	for(i=0;i<allPlayers.length;i++) {
		getIndividualPlayerStats(i);
	}
	console.log(allPlayers)
}

function getIndividualPlayerStats(i) {
	axios.get('https://statsapi.web.nhl.com/' + 'api/v1/people/' + allPlayers[i].getID() + '/stats?stats=statsSingleSeason&season=20222023')
			.then((response) => {
				if (response.data.stats[0].splits[0] != undefined){
					if (allPlayers[i].getPosition() == "G") {
						var gamesPlayed = response.data.stats[0].splits[0].stat.games;
						var ga = response.data.stats[0].splits[0].stat.goalsAgainst;
						var saves = response.data.stats[0].splits[0].stat.saves;
						var wins = response.data.stats[0].splits[0].stat.wins;
						var shutouts = response.data.stats[0].splits[0].stat.shutouts;
						allPlayers[i].setGStats(ga, saves, gamesPlayed, wins, shutouts);
					}
					else {
						var gamesPlayed = response.data.stats[0].splits[0].stat.games;
						var goals = response.data.stats[0].splits[0].stat.goals;
						var assists = response.data.stats[0].splits[0].stat.assists;
						var plusMinus = response.data.stats[0].splits[0].stat.plusMinus;
						var pim = response.data.stats[0].splits[0].stat.pim;
						var ppp = response.data.stats[0].splits[0].stat.powerPlayPoints;
						var shp = response.data.stats[0].splits[0].stat.shortHandedPoints;
						var shots = response.data.stats[0].splits[0].stat.shots;
						var faceoffPct = response.data.stats[0].splits[0].stat.faceOffPct;
						var shifts = response.data.stats[0].splits[0].stat.shifts;
						if (allPlayers[i].getPosition() == 'C') {
							var faceoffWon = faceoffPct*shifts;
						}
						else {
							var faceoffWon = 0;
						}
						var hits = response.data.stats[0].splits[0].stat.hits;
						var blocks = response.data.stats[0].splits[0].stat.blocked;

						allPlayers[i].setStats(goals, assists, gamesPlayed, pim, shots, blocks, hits, faceoffPct, shifts, ppp, shp, plusMinus, faceoffWon);
					}
				}
				else {
					console.log("PLAYER " + i + " NAME = " + allPlayers[i].name);
				}
				
				if(i==allPlayers.length-1) {
					printTop10Fantasy();
					projections();
				}
			})
		
}

function printTop10Fantasy() {
	for(i=0; i<allPlayers.length;i++) {
		if (allPlayers[i].getGamesPlayed() != 0) {
			if(allPlayers[i].getPosition() == "G") {
				var statsArray = allPlayers[i].getStats('G');
				var fantasyPoints = (statsArray[0]*-3)+(statsArray[1]*0.6)+(statsArray[3]*5)+(statsArray[4]*5);
				allPlayers[i].setFantasyPoints(fantasyPoints);
			}
			else {
				var statsArray = allPlayers[i].getStats('NG');
				var fantasyPoints = (statsArray[0]*5)+(statsArray[1]*3)+(statsArray[12])+(statsArray[4]*0.5)+(statsArray[10]*2)+(statsArray[11]*4)+(statsArray[5]*0.9)+(statsArray[7])+(statsArray[6])+(statsArray[13]*0.01*0.45);
				allPlayers[i].setFantasyPoints(fantasyPoints);
			}
		}
		else {
			allPlayers[i].setFantasyPoints(0);
		}
	}
	var top10Array = [{"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}, {"Name": "", "FantasyPoints": 0}]
	for(k=0; k<10; k++) {
		if (top10Array[k].FantasyPoints == undefined) {
			top10Array[k].FantasyPoints = 0;
			top10Array[k].Name = "";
		}
	}
	for(j=0; j<allPlayers.length; j++) {
		for(k=0; k<top10Array.length; k++) {
			if (top10Array[k].FantasyPoints < allPlayers[j].getFantasyPoints()) {
				top10Array.splice(k,0,{"Name": allPlayers[j].getName(), "FantasyPoints": allPlayers[j].getFantasyPoints()});
				break
			}
		}
	}
	console.log(top10Array);
	//document.getElementById('showFantasy').innerHTML = toString(top10Array.FantasyPoints) + top10Array.Name;
}

function projections() {
	const p = document.getElementById('showTopPlayers');
	p.insertAdjacentHTML('beforeend', 'Player Name --- Projected Fantasy Points for Rest of Week<br>');
	var top10Array = [{"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}, {"Name": "", "Player": new Player(), "FantasyPoints": 0}]
	
	for(j=0; j<allPlayers.length; j++) {
		for(k=0; k<top10Array.length; k++) {
			allPlayers[j].setProjected((allPlayers[j].getFantasyPoints() / allPlayers[j].getGamesPlayed()) * allPlayers[j].team.getGamesInWeek().length)
			if (top10Array[k].FantasyPoints < allPlayers[j].getProjected()) {
				top10Array.splice(k,0,{"Name": allPlayers[j].getName(),"Player": allPlayers[j], "FantasyPoints": (allPlayers[j].getProjected())});
				break
			}
		}
	}
	for(j=0; j<100; j++) {
		console.log(top10Array[j]);
		p.insertAdjacentHTML('beforeend', top10Array[j].Name + ' --- ' + top10Array[j].FantasyPoints + '<br>');
	}
	hideLoading();
}

/*
if (funStat=='fantasy')
{
    allRostersFantasy(response.data.teams[i].link);
}


function allRostersFantasy(teamLink) {
	axios.get('https://statsapi.web.nhl.com/' + teamLink + "/roster")
		.then((response) => {
			//same as above
			for (var i=0;i<response.data.roster.length;i++)
			{
				if (response.data.roster[i].position.code=="C") {
					var isCenter = true;
				}
				else {
					var isCenter = false;
				}
				var names = response.data.roster[i].person.fullName;
				getFantasy(response.data.roster[i].person.link,names,isCenter);
			}
		})
}


function getFantasy(playerLink,playerName,isCenter) {
	axios.get('https://statsapi.web.nhl.com/' + playerLink + '/stats?stats=statsSingleSeason&season=20222023')
		.then((response) => {
			//the same as above
			//playerNameArray.push(playerName);
			//playerPointsArray.push(response.data.stats[0].splits[0].stat.points);
			if (response.data.stats[0].splits[0].stat.points!=undefined)
			{
				var gamesPlayed = response.data.stats[0].splits[0].stat.games;
				var goals = response.data.stats[0].splits[0].stat.goals;
				var assists = response.data.stats[0].splits[0].stat.assists;
				var plusMinus = response.data.stats[0].splits[0].stat.plusMinus;
				var pim = response.data.stats[0].splits[0].stat.pim;
				var ppp = response.data.stats[0].splits[0].stat.powerPlayPoints;
				var shp = response.data.stats[0].splits[0].stat.shortHandedPoints;
				var shots = response.data.stats[0].splits[0].stat.shots;
				var faceoffPerc = response.data.stats[0].splits[0].stat.faceOffPct;
				var shifts = response.data.stats[0].splits[0].stat.shifts;
				if (isCenter) {
					var faceoffWon = faceoffPerc*shifts;
				}
				else {
					var faceoffWon = 0;
				}
				var hits = response.data.stats[0].splits[0].stat.hits;
				var blocked = response.data.stats[0].splits[0].stat.blocked;
				if (gamesPlayed>1)
				{
					fantasyArray.push([playerName,(goals*5)+(assists*3)+(plusMinus)+(pim*0.5)+(ppp*2)+(shp*4)+(shots*0.9)+(hits)+(blocked)+(faceoffWon*0.01*0.42)]);
				}
				fantasyArray.sort(numberSort);
			}
				top10 = fantasyArray.filter(filterTop10);
				top10Names = getCol(top10, 0);
				top10Fantasy = getCol(top10, 1);
				top500 = fantasyArray.filter(filterTop500);
				top500Names = getCol(top500, 0);
				top500Fantasy = getCol(top500, 1);
			  //document.getElementById("showFunStats").innerHTML = top10;
			  	fantasyTable = true;
				defensiveTable = false;
				clutchTable = false;
				specialTable = false;
				offensiveTable = false;
				gentleTable = false;
				google.charts.load('current', {'packages':['corechart']});
				google.charts.setOnLoadCallback(drawChartFantasy);
		})
}
*/
var eachYearofGames = [];
var bunchOfGames = [];
var listOfPlayers = [];
var loaded = false;


function testFetch() {
    displayLoading();
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
        getSeason('20212022');
        getSeason('20202021');
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
            // Only includes regular season and playoff games
        if (response.data.gameData.game.type == "R" || response.data.gameData.game.type == "P") {
            gameYear.addGame(response.data);
            var newGame = new Game(response.data);
            bunchOfGames.push(newGame);
            var awayTeammates = [];
            var homeTeammates = [];
            for (var i in response.data.liveData.boxscore.teams.away.players) {
                if (!(response.data.liveData.boxscore.teams.away.scratches.includes(response.data.liveData.boxscore.teams.away.players[i].person.id))) {
                    var person = response.data.liveData.boxscore.teams.away.players[i];
                    var newPlayer = new Player(person.person.fullName, person.person.id, person.position.code, response.data.liveData.boxscore.teams.away.team.name);
                    var playerIndex = getPlayerIndex(newPlayer, listOfPlayers);
                    if (!containsPlayer(newPlayer, listOfPlayers)) {
                        listOfPlayers.push(newPlayer);
                    }
                    else if (listOfPlayers[playerIndex].position == "N/A") {
                        listOfPlayers[playerIndex] = newPlayer;
                    }
                    else if (listOfPlayers[playerIndex].team != newPlayer.team) {
                        listOfPlayers[playerIndex].addTeam(newPlayer.team);
                    }
                    awayTeammates.push(newPlayer);
                }
            }
            for (var i in response.data.liveData.boxscore.teams.home.players) {
                if (!(response.data.liveData.boxscore.teams.home.scratches.includes(response.data.liveData.boxscore.teams.home.players[i].person.id))) {
                    var person = response.data.liveData.boxscore.teams.home.players[i];
                    var newPlayer = new Player(person.person.fullName, person.person.id, person.position.code, response.data.liveData.boxscore.teams.home.team.name);
                    var playerIndex = getPlayerIndex(newPlayer, listOfPlayers);
                    if (!containsPlayer(newPlayer, listOfPlayers)) {
                        listOfPlayers.push(newPlayer);
                    }
                    else if (listOfPlayers[playerIndex].position == "N/A") {
                        listOfPlayers[playerIndex] = newPlayer;
                    }
                    homeTeammates.push(newPlayer);
                }
            }
            for (var i in awayTeammates) {
                listOfPlayers[getPlayerIndex(awayTeammates[i], listOfPlayers)].addTeamates(awayTeammates);
            }
            for (var i in homeTeammates) {
                listOfPlayers[getPlayerIndex(homeTeammates[i], listOfPlayers)].addTeamates(homeTeammates);
            }
        }
		if (listOfPlayers.length == 1388 && loaded == false) {
			console.log("RUNNING GOOD CODE");
			var playerIndex = Math.floor(Math.random() * 1062);
			var playerIndex2 = Math.floor(Math.random() * 1062);
			while (playerIndex2 == playerIndex) {
				playerIndex2 = Math.floor(Math.random() * 1062);
			}
			console.log("Starting player: " + listOfPlayers[playerIndex].name);
			console.log("Ending player: " + listOfPlayers[playerIndex2].name);
			choosePath(playerIndex, playerIndex2);
			loaded = true;
			hideLoading();
		}
    });
}

//Sleep please
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getPlayerByID(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj) {
            return i;
        }
    }

    return -1;
}

function containsPlayer(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return true;
        }
    }

    return false;
}

function getPlayerIndex(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (list[i].id === obj.id) {
            return i;
        }
    }

    return -1;
}


function printAllYears() {
    console.log("GOT HERE");
    console.log(eachYearofGames);
    for (var i in eachYearofGames) {
        console.log(eachYearofGames[i].getGames());
    }
}

function printAllGames() {
    for (var i in bunchOfGames) {
        console.log("Game " + i + ": ");
        console.log(bunchOfGames[i]);
    }
}

function printAllPlayers() {
    for (var i in listOfPlayers) {
        console.log("Player " + i + ": ");
        console.log(listOfPlayers[i]);
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
        //console.log(newGame);
        this.games.push(newGame);
    }
}

class Game {
    constructor(game) {
        this.game = game;
    }
}

class Player {
	constructor(name, id, position, team) {
		this.name = name;
		this.id = id;
		this.position = position;
		this.fantasyPoints = 0;
		this.projected = 0;
		this.teams = [];
        this.teammates = [];
        this.teams.push(team);
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

    addTeamates(newTeammates) {
        for (var i in newTeammates) {
            if (!(containsPlayer(newTeammates[i], this.teammates))) {
                this.teammates.push(newTeammates[i]);
            }
        }
    }

    addTeam(newTeam) {
        this.teams.push(newTeam);
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

//whether the page has just loaded (or is in a similar state)
var firstLoaded = true;

//from https://dev.to/vaishnavme/displaying-loading-animation-on-fetch-api-calls-1e5m
// selecting loading div
var loader = document.getElementById("loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time (10000 seconds)
    setTimeout(() => {
        loader.classList.remove("display");
    }, 10000000);
}

// hiding loading 
function hideLoading() {
    //loader.classList.remove("display");
		loader.style.display = 'none'
}

function runCode(playerIndex1, playerIndex2) {
	//create the list of players
	createLi(playerIndex1, playerIndex2);
	//hides the full list from the user
	// hide();
}

function reloadGame() {
	document.getElementById("showPath").replaceChildren();
	document.getElementById('showPlayerSearchStats').innerHTML = "";
	var playerIndex = Math.floor(Math.random() * 1062);
	var playerIndex2 = Math.floor(Math.random() * 1062);
	while (playerIndex2 == playerIndex) {
		playerIndex2 = Math.floor(Math.random() * 1062);
	}
	console.log("Starting player: " + listOfPlayers[playerIndex].name);
	console.log("Ending player: " + listOfPlayers[playerIndex2].name);
	choosePath(playerIndex, playerIndex2);
}

function choosePath(startingPlayerIndex, endingPlayerIndex) {
	var startEndDiv = document.getElementById("showStartandEndPlayers");
	for (var i = 0; i < 2; i++) {
		var playerStoreDiv = document.getElementById("showPath");
		var newPlayerDiv = document.createElement("div");
		newPlayerDiv.style.width = "200px";
		newPlayerDiv.style.height = "100px";
		newPlayerDiv.style.display = "inline-block";
		newPlayerDiv.style.color = "white";
		newPlayerDiv.style.padding = "10px";
		playerStoreDiv.appendChild(newPlayerDiv);
		var playerImg = document.createElement("IMG");
		if (i==0) playerIndex = startingPlayerIndex;
		else playerIndex = endingPlayerIndex;
		playerImg.setAttribute("src","https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" + listOfPlayers[playerIndex].id + ".jpg");
		playerImg.setAttribute("width", "50px");
		playerImg.setAttribute("height", "50px");
		newPlayerDiv.appendChild(playerImg);
		newPlayerDiv.innerHTML += listOfPlayers[playerIndex].name;
		if (i==0) {
			var arrowImg = document.createElement("IMG");
			playerImg.setAttribute("src","https://upload.wikimedia.org/wikipedia/commons/thumb/7/71/Arrow_east.svg/1920px-Arrow_east.svg.png?20220723011022");
			playerImg.setAttribute("width", "50px");
			playerImg.setAttribute("height", "50px");
			playerStoreDiv.appendChild(playerImg);
		}
	}
	runCode(startingPlayerIndex, endingPlayerIndex);
}

//from w3schools
//this function hides the players that don't match the user's search input
function hide() {
	console.log("HIDE HIDE HIDE HIDE");
	console.log("FIRSTLOADED = " + firstLoaded);
  // Declare variables
  var input, filter, ul, li, a, i, txtValue;
  input = document.getElementById('searchInput');
	//if the search bar is empty
	if (input.value==undefined || input.value=='')
	{
		//consider the site state as 'just loaded', for simplicity's sake
		firstLoaded = true;
	}
	//change the input value to uppercase, as to make the searching not case-sensitive
  filter = input.value.toUpperCase();
	//gets the ul and li elements
  ul = document.getElementById("searchUl");
  li = ul.getElementsByTagName('li');

  // Loop through all list items, and hide those who don't match the search query
	//if the search bar has been used once already
	if (firstLoaded!=true)
	{
  	for (i = 0; i < li.length; i++) {
    	a = li[i].getElementsByTagName("a")[0];
    	txtValue = a.textContent || a.innerText;
			//if the user's search value matches a player's name
    	if (txtValue.toUpperCase().indexOf(filter) > -1) {
				//keep the name showing
     	 li[i].style.display = "";
   	 }//if the user's search value does not match a player's name
			else {
				//hide that name
      	li[i].style.display = "none";
    	}
		}
	}
	//if the page has just loaded (or is in a similar state)
	else {
		console.log("GETTING RID OF TABS");
		//hide all of the tabs from the user
		for (i = 0; i < li.length; i++) {
			li[i].style.display = "none";
		}
		//the site has no longer just been loaded
		firstLoaded = false;
  }
}

//creates the list of all NHL players' names
function createLi(playerIndex1, playerIndex2) {
	var currentPlayer = listOfPlayers[playerIndex1];
	//for every player
	for (var i in currentPlayer.teammates)
	{
		//a.innerHTML = allTeams();
		//declare HTML elements
		var li = document.createElement("li");
		var a = document.createElement("a");
		//each link element has the same class name
		a.className = 'a1';
		//add the link element to every list element 
		li.appendChild(a);
		//a.setAttribute("href","");
		//if the name is not undefined (it sometimes did, so this gets rid of that problem)
		if (currentPlayer.teammates[i].name!=undefined)
		{
			//show the player's name on the list
			a.innerHTML = currentPlayer.teammates[i].name;
			a.id = currentPlayer.teammates[i].id;
			//li.setAttribute("onclick","getSearchedStats(" + a.innerHTML + ")");
		}
		//add the list to the desired element
		document.getElementById("searchUl").appendChild(li);
	}
	//gets a list of all link elements
	var aList = document.getElementsByTagName("a");
	for (var j=0; j<aList.length; j++)
	{
		//console.log("playerNames: " + listOfPlayers[j].name);
		//if the link is part of the list (not a part of the header)
		if (aList[j].className == 'a1')
		{
			//add an event listener for clicks
			aList[j].addEventListener("click",function() {
				console.log("I HAVE BEEN CLICKED");
				//show that player's stats!
				whichPlayerWasInputted(this.id, playerIndex2);
			});
		}
	}
}

function whichPlayerWasInputted(playerClickedID, playerIndex2) {
	//declare HTML elements
	var ul = document.getElementById("searchUl");
	var li = ul.getElementsByTagName("li");
	var search = document.getElementById("showPlayerSearchStats");
	//show the player's stats (for when they are loaded)
	search.style.display = '';
	//hide the list of player's names from the user
	for (var i=0; i<li.length; i++)
		{
			li[i].style.display = 'none';
		}
		//get those stats!
	displayPlayersTeammates(playerClickedID, playerIndex2);
}

function displayPlayersTeammates(playerClickedID, playerIndex2) {
    var playerIndex = getPlayerByID(Number(playerClickedID), listOfPlayers);
    console.log("Player 1: " + listOfPlayers[playerIndex].name);
    console.log("Player 2: " + listOfPlayers[playerIndex2].name);
    console.log("Player 1 id: " + listOfPlayers[playerIndex].id);
    console.log("Player 2 id: " + listOfPlayers[playerIndex2].id);
    document.getElementById('showPlayerSearchStats').innerHTML = "";
	var playerStoreDiv = document.getElementById("showPath");
	var newPlayerDiv = document.createElement("div");
	newPlayerDiv.style.width = "200px";
	newPlayerDiv.style.height = "100px";
	newPlayerDiv.style.display = "inline-block";
	newPlayerDiv.style.color = "white";
	newPlayerDiv.style.padding = "10px";
	playerStoreDiv.appendChild(newPlayerDiv);
	var playerImg = document.createElement("IMG");
	playerImg.setAttribute("src","https://cms.nhl.bamgrid.com/images/headshots/current/168x168/" + listOfPlayers[playerIndex].id + ".jpg");
	playerImg.setAttribute("width", "50px");
	playerImg.setAttribute("height", "50px");
	newPlayerDiv.appendChild(playerImg);
	newPlayerDiv.innerHTML += listOfPlayers[playerIndex].name;

	document.getElementById("searchUl").replaceChildren();
	
	if (listOfPlayers[playerIndex].id === listOfPlayers[playerIndex2].id) {
		console.log("YOU WON PLEASE WIN DAMMIT");
		document.getElementById('showPlayerSearchStats').innerHTML = "You won!";
		return;
	}
	createLi(playerIndex, playerIndex2);
}


//from w3schools
/* Toggle between adding and removing the "responsive" class to topnav when the user clicks on the icon */
function responsiveNav() {
  var nav = document.getElementById("myTopnav");
  if (nav.className === "topnav") {
    nav.className += " responsive";
  } else {
    nav.className = "topnav";
  }
}

testFetch();
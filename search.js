//an array of all NHL player's names
var playerNamesArray = [];
//how many times the certain API endpoint is reached (how many player there are currently in the nhl)
var numIterationsPlayers = 0;
//how many times a certain API endpoint is reached, after we know how many players there are
var numIterations = 0;
//whether the page has just loaded (or is in a similar state)
var firstLoaded = true;
//how many players are currently in the NHL
var totalPlayers = 0;

//from https://dev.to/vaishnavme/displaying-loading-animation-on-fetch-api-calls-1e5m
// selecting loading div
var loader = document.getElementById("loading");

// showing loading
function displayLoading() {
    loader.classList.add("display");
    // to stop loading after some time (100 seconds)
    setTimeout(() => {
        loader.classList.remove("display");
    }, 100000);
}

// hiding loading 
function hideLoading() {
    //loader.classList.remove("display");
		loader.style.display = 'none'
}


//runs first on its own to get the number of players
//the number of current NHL players is a constantly changing number
//this way, I don't have to manually re-enter the total number of players every 2 hours
allTeamsNumPlayers();
//then it runs again to load the player database and load the players into a list, and their stats into their respective lists
//i included a setTimeout for 7.5 seconds, as to avoid the API calls happening simultaneously
//if they happen at the same time, it ends the API calls prematurely, messing with the data shown on screen, which is not good
setTimeout(allTeams, 7500);


//if a function has NumPlayers at the end, it means it is used to find the total number of current NHL players
function allTeamsNumPlayers() {
	//show the loading icon for the user
	displayLoading();
	axios.get('https://statsapi.web.nhl.com/api/v1/teams')
  .then((response) => {
		console.log("ALLTEAMS BEGIN");
		//for each team
		for (var i=0;i<response.data.teams.length;i++)
		{
			//get each player
			allRostersNumPlayers(response.data.teams[i].link);
		}
		console.log("ALLTEAMS END");
	})
}
function allRostersNumPlayers(teamLink) {
	axios.get('https://statsapi.web.nhl.com/' + teamLink + "/roster")
		.then((response) => {
		console.log("ALLROSTERS BEGIN");
			//for each player
			for (var i=0;i<response.data.roster.length;i++)
			{
				//getStatsNumPlayers(response.data.roster[i].person.link);
				//add to the total player amount
				numIterationsPlayers++;
				totalPlayers = numIterationsPlayers;
				console.log("Total Players: " + totalPlayers);
			}
		console.log("ALLROSTERS END");
		})
}



//this is the API call that loads the players into a list for the search bar
function allTeams() {
	axios.get('https://statsapi.web.nhl.com/api/v1/teams')
  .then((response) => {
		console.log("ALLTEAMS BEGIN");
		//for each team
		for (var i=0;i<response.data.teams.length;i++)
		{
			//get their roster
			allRosters(response.data.teams[i].link);
		}
		console.log("ALLTEAMS END");
	})
}
function allRosters(teamLink) {
	axios.get('https://statsapi.web.nhl.com/' + teamLink + "/roster")
		.then((response) => {
		console.log("ALLROSTERS BEGIN");
			//for each player
			for (var i=0;i<response.data.roster.length;i++)
			{
				//log their name
				var names = response.data.roster[i].person.fullName;
				//we are getting a player's name into an array
				numIterations++;
				playerNamesArray.push(names);
				//if this is the last player
				if (numIterations==totalPlayers)
				{
					//hide the loading icon
					hideLoading();
					//create the list of players
					createLi();
					//hides the full list from the user
					hide();
				}
				//getStats(response.data.roster[i].person.link,names);
			}
		console.log("ALLROSTERS END");
		})
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
function createLi() {
	//for every player
	for (var i=0; i<playerNamesArray.length; i++)
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
		if (playerNamesArray[i]!=undefined)
		{
			//show the player's name on the list
			a.innerHTML = playerNamesArray[i];
			//li.setAttribute("onclick","getSearchedStats(" + a.innerHTML + ")");
		}
		//add the list to the desired element
		document.getElementById("searchUl").appendChild(li);
	}
	//gets a list of all link elements
	var aList = document.getElementsByTagName("a");
	for (var j=0; j<aList.length; j++)
	{
		//console.log("playerNames: " + playerNamesArray[j]);
		//if the link is part of the list (not a part of the header)
		if (aList[j].className == 'a1')
		{
			//add an event listener for clicks
			aList[j].addEventListener("click",function() {
				console.log("I HAVE BEEN CLICKED");
				//show that player's stats!
				whichPlayerWasInputted(this.innerHTML);
			});
		}
	}
}

function whichPlayerWasInputted(playerInputName) {
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
	allTeamsSearch(playerInputName);
}

function allTeamsSearch(playerInputName) {
	axios.get('https://statsapi.web.nhl.com/api/v1/teams')
  .then((response) => {
    //console.log(response.data.teams[20].link);
		//for each team
		for (var i=0;i<response.data.teams.length;i++)
		{
			//get the team's roster
			allRostersSearch(response.data.teams[i].link,playerInputName);
		}
  });
}
function allRostersSearch(teamLink,playerInputName) {
	axios.get('https://statsapi.web.nhl.com/' + teamLink + "/roster")
		.then((response) => {
			//for every player
			for (var i=0;i<response.data.roster.length;i++)
			{
				//log their name
				var names = response.data.roster[i].person.fullName;
				//if their name matches the user-specified name
				if (names==playerInputName)
				{
					//get that player's stats
					getPlayerSearchStats(response.data.roster[i].person.link,names);
				}
			}
		})
}
function getPlayerSearchStats(playerLink, playerName) {
	axios.get('https://statsapi.web.nhl.com/' + playerLink + '/stats?stats=statsSingleSeason&season=20222023')
		.then((response) => {
			//playerNameArray.push(playerName);
			//playerPointsArray.push(response.data.stats[0].splits[0].stat.points);
			//if the player is a skater/has played a game in the NHL
			if (response.data.stats[0].splits[0].stat.points!=undefined)
			{
				//show the stats
				document.getElementById('showPlayerSearchStats').innerHTML = playerName + "<br>Games Played: " + (response.data.stats[0].splits[0].stat.games) + "<br>Goals: " + (response.data.stats[0].splits[0].stat.goals) + "<br>Assists: " + (response.data.stats[0].splits[0].stat.assists) + "<br>Points: " + (response.data.stats[0].splits[0].stat.points) + "<br>Plus-Minus: " + (response.data.stats[0].splits[0].stat.plusMinus) + "<br>Penalty Minutes: " + (response.data.stats[0].splits[0].stat.pim);
			}
			//if the player is a goalie
			else 
			{
				//show the stats
				document.getElementById('showPlayerSearchStats').innerHTML = playerName + "<br>Save Percentage: " + (response.data.stats[0].splits[0].stat.savePercentage) + "<br>Goals Against Average: " + (response.data.stats[0].splits[0].stat.goalAgainstAverage);
			}
		})
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
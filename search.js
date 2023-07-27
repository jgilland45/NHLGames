//whether the page has just loaded (or is in a similar state)
var firstLoaded = true;

function runCode() {
	//create the list of players
	createLi();
	//hides the full list from the user
	hide();
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
	for (var i in listOfPlayers)
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
		if (listOfPlayers[i].name!=undefined)
		{
			//show the player's name on the list
			a.innerHTML = listOfPlayers[i].name;
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
	displayPlayersTeammates(playerInputName);
}

function displayPlayersTeammates(playerName) {
	document.getElementById('showPlayerSearchStats').innerHTML = playerName;
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
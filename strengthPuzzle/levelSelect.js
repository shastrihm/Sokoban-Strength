// -------------
// -------------
// -------------
// Level Objects
// -------------
// -------------
// -------------

const LEVELS = [];

function Level(config,number)
{
    this.config = config;
    this.number = number;
    this.buttonID = "level " + String(this.number);
    LEVELS.push(this);

    this.createLevelButton = function()
    {
        //creates a button 
        let btn = document.createElement("BUTTON");
        btn.id = this.buttonID;
        btn.innerHTML = "Placeholder";
        btn.className = "btn btn-level";

        let that = this;
        btn.onclick = function()
        {
            sessionStorage.setItem(key="level",value=that.config);
            window.open("game/playRestricted.html");
        }
        document.getElementById("levels").appendChild(btn);  
    }
}

function updateLevelSelectScreen(LEVELS)
{
    for(let i=1;i<=CONFIGS.length;i++)
    {
        new Level(CONFIGS[i-1],i);
    }
    
    LEVELS.forEach(level=>level.createLevelButton());
}



updateLevelSelectScreen(LEVELS);    
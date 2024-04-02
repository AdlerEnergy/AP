let output = document.getElementById("output");
let input = document.getElementById("input")
let commands = ["go to", "examine", "use", "start", "clear", "look"]; 
let currentRoom = "start";
let exits = [];
let room1 = null;
let started = 0;



function gameloop()
{
    
}


document.getElementById('input-form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    processCommand(input.value);
    input.value = '';
});


function processCommand(userInput) {
    updateOutput(">" + userInput);
    userInput = userInput.toLowerCase();
    var userInputArray = userInput.split(' ');
    let command = null;
    command = returnCommand(userInputArray);
    if(command == "clear")
    {
        clearScreen();
    }
    let target = returnTarget(userInputArray, command);
    if(target != null)
    {
        doCommand(command, target);
    }
}

function updateOutput(string)
{
    output.innerHTML += '<br>' + string; // Append the message to the existing content
    output.scrollTop = output.scrollHeight;
}



function returnCommand(userInput) {
    userInput = userInput.join(' '); // Join array elements into a single string
    for(let i = 0; i < commands.length; i++) {
        if (userInput.startsWith(commands[i])) {
            return commands[i];
        }
    }
    updateOutput("Invalid command: " + userInput);
    return null;
}

function returnTarget(array, command)
{
    if(command == null)
    {
        return null;
    }
    
    if(command == "go to")
    {
        let target = array.slice(2).join(' ');
        return target;
    }
    else if(array.length > 1)
    {
        if(command == "examine" || command == "use")
        {
            let target = array.slice(1).join(' ');
            return target;
        }

    }
    else
    {
        if(command == "look" || command == "clear" || command == "start" || command == "continue")
        {
            return command;
        }
    }
}

function clearScreen()
{
    output.textContent = " ";
}

function doCommand(command, target)
{
    if(command == "go to")
    {
        hello = target;
    }
    else if(command == "look")
    {
        look();
    }
    else if(command == "clear")
    {
        clearScreen();
    }
    else if(command == "start")
    {
        console.log("Game started.");
        uploadRooms();
        clearScreen();
        gameContext();
        commands.splice(3, 1);
        commands.splice(3, 0, "continue");
        console.log(commands);
    }
    else if(command == "continue")
    {
        clearScreen();
        changeRoomTo(room1);
        commands.splice(3, 1);
    }
    else if(command == "examine")
    {

    }
    else if(command == "use")
    {

    }
}

function changeRoomTo(room)
{
    exits = room.exits;
    currentRoom = room;
    updateOutput(room.description);
    for (let i = 0; i < exits.length; i ++)
    {
        updateOutput("You see on the ground around you")
    }


}

class Room {
    constructor(description, exits, items) {
        this.description = description;
        this.exits = exits;
        this.items = items;
    }
}

class Item {
    constructor(roomDescription, name) {
        this.roomDescription = roomDescription;
        this.name = name;
    }
}


function uploadRooms()
{
    let sword = new Item(
        "You see a sword laying in the hands of a skeleton in the corner of the room.", "sword"
    )
    let torch = new Item(
        "Torch Description", "torch"
    )
    let secondRoom = new Room(
        "You enter a spacious hall. Moonlight streams in through a broken window.",
        ["south", "west"],
        [sword]
    );
    room1 = new Room(
        "Behind you is a giant large door sealed shut blocking your path out. You can see a light up ahead forward into the NEXT ROOM.",
        ["NEXT ROOM"],
        [torch]
    );
    nextRoom = new Room(
        
    )
}


function look()
{
    updateOutput(currentRoom.description);
    updateOutput(currentRoom.exits);
    let output = null;

    for(let i = 0; i < currentRoom.items.length; i++)
    {
        itemName = currentRoom.items[i].name;
        output += " " + itemName.description;

    }
    updateOutput(output);
}

function gameContext()
{
    updateOutput("Deep in the heart of the enchanted forest lies a forgotten dungeon, rumored to be filled with untold riches and ancient artifacts. An ancient King from long ago is rumored to be buried there with all his treasure.");
    updateOutput("You, a fearless explorer seeking fame and fortune, have decided to go to the Crypt and explore it for yourself. You gather your courage and set out on a journey to uncover its secrets.");
    updateOutput("");
    updateOutput("After many days of travel you arrive at the enterance of the dungeon. Carefully you walk in, but in doing so you step on a pressure plate and the entrance slams shut. Guess you will have to find another way to get out.")
    updateOutput("");
    updateOutput("Please type \"continue\" to continue.");
}
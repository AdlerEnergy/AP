let output = document.getElementById("output");
let input = document.getElementById("input")
let commands = ["go to", "examine", "interact", "start", "clear", "look"]; 
let currentRoom = "start";
let exits = [];
let entrance = null;
let nextRoom = null;
let started = 0;
let torch = null;

const exitsArray = [];
for (let i = 0; i < 7; i++) { //for loop written by ChatGPT
    exitsArray[i] = []; // Initialize inner array
    for (let j = 0; j < 7; j++) {
        exitsArray[i][j] = 0; // Initialize each element 
    }
}

function updateExits(x, y)
{
    exitsArray[x][y] = 1;
    exitsArray[y][x] = 1;
}

updateExits(0, 1);


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
    output.innerHTML += "<br>" + string; // Append the message to the existing content
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
        if(command == "examine" || command == "interact")
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
        console.log("Entered go to command. Target: " + target)
        target = fixSyntax(target);
        currentRoom = fixSyntax(currentRoom);
        console.log("CurrentRoom = " + currentRoom + " \nTarget = " + target)
        if(exitsArray[currentRoom][target] == 1)
        {
            target = fixSyntax(target);
            currentRoom = fixSyntax(currentRoom);
            changeRoomTo(target);
        }
        else{
            updateOutput(fixSyntax(target) + " does not exist or is not nearby.")
        }

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
        changeRoomTo(entrance);
        commands.splice(3, 1);
    }
    else if(command == "examine")
    {
        console.log(target);
        console.log(checkIfItemIsInRoom(target));
        if(checkIfItemIsInRoom(target) == true)
        {
            let newTarget = fixSyntax(target);
            console.log(newTarget)
            console.log(torch)
            updateOutput(newTarget.getExamineItem())
        }
        else
        {
            updateOutput("There is not an item in the room called, \"" + target + "\"")
        }
    }
    else if(command == "interact")
    {

    }
    else{
        updateOutput("No function has been made for that command yet.")
    }
}

function changeRoomTo(room)
{
    
    currentRoom = room;
    updateOutput("<br>" + room.description);
    if (room.items.length > 0) { //if statement written by chat GPT
        for (let item of room.items) {
            updateOutput(item.roomDescription);
        }
    }


}

class Room {
    constructor(description, items, num) {
        this.description = description;
        this.num = num;
        this.items = items;
    }
}

class Item {
    constructor(roomDescription, name, examineItem) {
        this.roomDescription = roomDescription;
        this.name = name;
        this.examineItem = examineItem;
    }

    getExamineItem()
    {
        return this.examineItem;
    }
}


function uploadRooms()
{
    let sword = new Item(
        "You see a sword laying in the hands of a skeleton in the corner of the room.", "sword", ""
    )
    torch = new Item(
        "You see a lit TORCH on the wall beside you, it's whats providing the light for the room.", "torch", "Examining the torch you notice that the torch is attached to the wall weirdly, like it's connected to a mechanism."
    )
    let secondRoom = new Room(
        "You enter a spacious hall. Moonlight streams in through a broken window.",
        ["south", "west"],
        [sword]
    );
    entrance = new Room(
        "Behind you is a giant large door sealed shut blocking your path out. You can see a light up ahead forward into the NEXT ROOM.",
        [], 0
    );
    nextRoom = new Room(
        "The room is pretty much empty. Behind you is a path leading back to the ENTRANCE.", [torch], 1
    );
    nextRoom = new Room(
        "The room is pretty much empty. Behind you is a path leading back to the ENTRANCE.", 
        [torch], 1
    );

    console.log(entrance);
    console.log(nextRoom);
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
    updateOutput("After many days of travel you arrive at the entrance of the dungeon. Carefully you walk in, but in doing so you step on a pressure plate and the entrance slams shut. Guess you will have to find another way to get out.")
    updateOutput("");
    updateOutput("Please type \"continue\" to continue.");
}

function fixSyntax(target)
{
    if (typeof target === 'number')
    {
        if(target == 0)
        {
            return entrance;
        }
        if(target == 1)
        {
            return nextRoom;
        }
    }
    else
    {
        if(target == "next room" || target == "nextroom" || target == nextRoom)
        {
            return 1;
        }
        if(target == "entrance" || target == entrance)
        {
            return 0;
        }
        if(target == "torch")
        {
            return torch;
        }
    }
    return target;
}


function checkIfItemIsInRoom(target)
{
    for(let i = 0; i < currentRoom.items.length; i++)
        {
            if(currentRoom.items[i].name == target)
            {
                return true;
            }
        }
    return false;
}
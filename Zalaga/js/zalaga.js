//***************** star screen *********************

$("body").fadeIn(2000);

$(document).keydown(function(e){

    if(e.keyCode == 13)
    {
        $('#startScreen').hide('slow');
        $('#bullet').css('display','block');

        //run game
        loop()
    }
});
//***************************************************

//***************************************************

//init varibles
let bullet = createCharacters('bullet', 600, 700, 200, 200);
let zombies = [];

let timeBefore = 0;
let points =0;

//*************** get game sounds *****************

function play(){
    let audio = new Audio("./shot.mp3")
    audio.play()
}
function zombieHit(){
    let audio = new Audio("./zombiehit.mp3")
    audio.play()
}

//************* determine out of bounds *************

function bounds(character, ignoreY) {
    if (character.x < 100)
    {
        character.x = 100;
    }
    if (!ignoreY && character.y < 100)
    {
        character.y = 100;
    }
    if (character.x + character.w > 1400)
    {
        character.x = 1400 - character.w;
    }
    if (!ignoreY && character.y + character.h > 1400)
    {
        character.y = 1400 - character.h;
    }
}

//**************** player movement ******************

$(document).keydown(function(e){
    if(e.keyCode == 37)
    {
        bullet.x -= 30
    }
    else if(e.keyCode == 39)
    {
        bullet.x += 30
    }
    else if (e.keyCode == 13)
    {
        play()

        let loop = setInterval(function(){

            //run by 7s
            bullet.y -= 70

            if(bullet.y == 0)
            {
                //must equal to multiple of 7
                bullet.y = 700

                clearInterval(loop)
            }
        }, 50);
    }
    bounds(bullet, true)
});


//*************** create characters ****************

function createCharacters(id, x, y, w, h){
    let output = {};

    output.element = id;
    output.x = x;
    output.y = y;
    output.w = w;
    output.h = h;

    return output;
}

//*********** position of player *******************

function position(character){

    let x = document.getElementById(character.element);

    x.style.left = character.x + 'px';
    x.style.top = character.y + 'px';
}

//***** place player invoking its position *********

function embedCharacters(){
    position(bullet);

    zombies.forEach(function(x){
        position(x);
    });
}

//******** create, get, & output zombies **********

function addZombies(){
    if(random(10) == 0)
    {

        let idName = 'enemy' + random(5000000);
        let randomZombies = createCharacters(idName, random(1000),
                                             -150, 77, 77);

        let img = document.createElement('img');

        img.id = randomZombies.element;
        img.className = 'enemy';
        img.src = "img/zombie.gif"
        img.height = 120

        document.children[0].appendChild(img);

        zombies[zombies.length] = randomZombies;
    }
}

//************ make zombies move *******************

function moveZombies(speed){

    zombies.forEach(function(x){

        //increase zombie speed
        x.y += speed;

        //set the bounds for zombies
        bounds(x, true);

    });
}

//**************** collision helper ****************

function intersects(a, b){

    return  a.x < b.x +
            b.w && a.x +
            a.w > b.x && a.y < b.y +
            b.h && a.y + a.h > b.y;
}

//************ apply collision function ************

function collision(){

    for (let i = 0; i < zombies.length; i++){

        if (intersects(bullet, zombies[i]))
        {
            //increment points & output to screen
            points++;
            $('#points').text(`${points}`)

            //test for level checkpoints
            if(points == 100 || points == 200
            || points == 300 || points == 400
            || points == 500 || points == 600
            || points == 700)
            {
                alert("next Level!!!")

            }

            //if points == 1000 game won!
            if(points == 1000)
            {
                alert("you win for today take a break!!!")
                location.reload()
            }

            //get zombie
            let zombiei = document.getElementById(zombies[i].element);

            //trigger zombie hurt sound
            zombieHit()

            //remove from screen
            zombiei.remove()

            //remove from array
            zombies.splice(i, 1);
            i--;

            //set bullet back to 700
            bullet.y = 700;

        }
        else if (zombies[i].y + zombies[i].h >= 800)
        {
            //zombie reached behind you,- you lose!
            location.reload()
            alert("you lost!!!")
        }
    }
}

//*********** random helper function  *************

function random(size){
    return parseInt(Math.random() * size);
}

//************** main game loop *******************

function loop(){
    if(new Date().getTime() - timeBefore > 40) {

        embedCharacters();
        addZombies();

        //if reached checkpoint, increase zombie speed
        if(points > 100)
        {
            moveZombies(4)
        }
        else if(points > 200)
        {
            moveZombies(5);
        }
        else if(points > 300)
        {
            moveZombies(6);
        }
        else if(points > 400)
        {
            moveZombies(7);
        }
        else if(points > 500)
        {
            moveZombies(8);
        }
        else if(points > 600)
        {
            moveZombies(9);
        }
        else if(points > 700)
        {
            moveZombies(10);
        }
        else
        {
            moveZombies(3);
        }

        collision();

        timeBefore = new Date().getTime();
    }
    setTimeout('loop();', 2);
}

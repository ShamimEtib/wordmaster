const elements = document.getElementsByClassName("first-o"); //getting all same id as an array
const box = document.querySelector('.loader'); //loading feature
let i = 0; //for accesing ids
let con = 5; // stop taking input after 5 letter inputed
let strings = ""; //for word checking
let test; // fetched word will be here



//get api url
const DOG_URL = "https://words.dev-apis.com/word-of-the-day";

//get word from urls

async function giveWord() {
    box.style.setProperty('visibility', 'visible');

    const promise = await fetch(DOG_URL);
    const processedResponse = await promise.json();
    test = processedResponse.word;
    test = test.toUpperCase(); // so that we can match with iput kaydown

    box.style.setProperty('visibility', 'hidden');

    document.addEventListener('keydown', logkey);

    // for handling input. what to do with input
    function logkey(e) {
        const str = String.fromCharCode(e.keyCode);

        if (isLetter(str)) {
            if ((i+1)!=con){ //condition to stay in same row
                strings += str;
                elements[i].innerText = str;
                i += 1;
            }else if (strings.length<con){ // for last column value 
                strings += str;
                elements[i].innerText = str;
            } else { // if continuous typing changes last column only
                strings = strings.slice(0,-1);
                strings += str;
                elements[i].innerText = str;
            }
        } else if (e.keyCode==8) { // for back sapce
            elements[i].innerText = "";
            strings = strings.slice(0,-1);
            i = Math.max(con-5,i-1);
        } else if (e.keyCode==13 && strings.length==5) {
            box.style.setProperty('visibility', 'visible'); //loading feature

            postWord().then(function (val){ // checking if valid word
                if (val === true){
                    if (wordMatching(strings)==5){ // for word fully matches
                        box.style.setProperty('visibility', 'hidden');
                        alert("You Win");
                    }
                    // setting value for next row and new word
                    con += 5;
                    strings = "";
                    i += 1;
                    if (con===35) { // if word doesnt matches after 6 guess, flashing all red
                        alert("You lose");
                        window.location.reload();
                    }
                }else {
                     // if not a valid re signal
                    for (var k = con-5; k < con; k++) {
                        elements[k].style.animation = "flash 3s";
                    }
                }
                box.style.setProperty('visibility', 'hidden'); //loading featur
            });
        }
    }
}

giveWord();


async function postWord() {
    try {
        const response = await fetch('https://words.dev-apis.com/validate-word', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        // posting strings to api post request
        word: strings
        })
        });
        const data = await response.json();

        return data.validWord;// return if valid btw it will return promise not value
    } catch(error) {
     // when there is an error 

        alert("Error posting....");
    } 
}




// function if pressed key was a letter

function isLetter(letter) {
    return /^[a-zA-Z]$/.test(letter);
}

//comaparing fetched word with user word

function wordMatching(string) {
    let k = 0; // how many word matches
    let c; // accessing different column of same row
    //console.log(test);
    for (var j = 0, len = test.length; j < len; j++) {
        c = con - 5 + j; 
        if (test[j]==string[j]) { 
            elements[c].style.background = "green"; // if matches
            k += 1;
        }
        else if (test.includes(string[j])) {
            elements[c].style.background = "yellow"; // matched but different column
        }else {
            elements[c].style.background = "#ccc";
        }
    }
    return k; // returning how many matched
}



//This code creates simple game in a browser using the alert and prompt functions, 
//where it gives you the line, then 4 multiple choice options. 
//The multi-choice option are in the for "[author]'s [date] [title]". 
//There is one correct answer, and three detractors, which are taken from other lines of the data, but *not* the same author.
//The user must be able to type in only A, B, C, or D. 
//After the user has made their selection, the correct answer is shown, along with the author's image.


let novelLinesData = [];

//This function loads the csv file First_Lines.csv 

function loadCSV() {

    return fetch('First_Lines.csv')
    .then(response => response.text())
    .then(csv => {

        const rows = csv.split('\n').slice(1);

        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            const columns = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
            novelLinesData.push({
                author: columns[0],
                title: columns[1],
                date: columns[2],
                firstLine: columns[3],
                authorImage: columns[4]
            });
        }
    })
};

//This function generates the correct answer. 

function generateRandomFirstLine() {

    var firstLinesIndex, CorrectAnswer;

    return loadCSV().then(() => {

    let firstLinesIndex = Math.floor(Math.random() * (novelLinesData.length)) + 1;
        let CorrectAnswer = novelLinesData[firstLinesIndex].title + " by " + novelLinesData[firstLinesIndex].author + ", " + novelLinesData[firstLinesIndex].date;
        return { firstLinesIndex, CorrectAnswer };
    });
};


//This function generates the detractors.

function getDetractors(firstLinesIndex) {
    let detractors = [];
    while (detractors.length < 3) {
        let randomIndex = Math.floor(Math.random() * novelLinesData.length);
        let potentialDetractor = novelLinesData[randomIndex];
        if (!detractors.includes(potentialDetractor) && potentialDetractor.author !== novelLinesData[firstLinesIndex].author) {
            detractors.push(potentialDetractor);
        }
    }
    let firstDetractor = detractors[0].title + " by " + detractors[0].author + ", " + detractors[0].date;
    let secondDetractor = detractors[1].title + " by " + detractors[1].author + ", " + detractors[1].date;
    let thirdDetractor = detractors[2].title + " by " + detractors[2].author + ", " + detractors[2].date;
    
    return [firstDetractor, secondDetractor, thirdDetractor];
}


//This function displays the question the the user;

let skipCount = 0; // Track the number of skips
let score = 0; // Track the score

async function displayQuestion() {
    // Fetch the data
    const response = await fetch('First_Lines.json');
    const novelLinesData = await response.json();

    // Randomly select a first line
    const firstLinesIndex = Math.floor(Math.random() * novelLinesData.length);
    const CorrectAnswer = novelLinesData[firstLinesIndex].author;

    // Display the first line
    const questionElement = document.getElementById('question');
    questionElement.innerText = novelLinesData[firstLinesIndex].line;

    // Display the options
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = '';
    for (let i = 0; i < novelLinesData[firstLinesIndex].options.length; i++) {
        const button = document.createElement('button');
        button.innerText = novelLinesData[firstLinesIndex].options[i];
        optionsElement.appendChild(button);
    }

    // Add event listeners to the options buttons
    const buttons = optionsElement.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            // Create a div to wrap the text and the image
            const div = document.createElement('div');
            div.style.width = 'fit-content';
            div.style.margin = '0 auto';
            div.style.textAlign = 'center';

            if (this.innerText === CorrectAnswer) {
                score++; // Increment the score

                // Add the text to the div
                const text = document.createElement('p');
                text.innerText = ('Correct! \n \n The answer is ' + CorrectAnswer).replace(/"/g, '');
                div.appendChild(text);

                // Display the author's image
                const img = document.createElement('img');
                img.src = novelLinesData[firstLinesIndex].authorImage;
                img.style.width = '60%';
                img.style.display = 'block';
                img.style.margin = '0 auto';
                div.appendChild(img);

                // Change the button text
                const buttonElement = document.getElementById('skip');
                buttonElement.innerText = 'Next Question';
            } else {
                // Add the text to the div
                const text = document.createElement('p');
                text.innerText = ('Incorrect. \n \n The correct answer is ' + CorrectAnswer + '\n \n Score: ' + score).replace(/"/g, '');
                div.appendChild(text);

                // Add a button to restart the game
                const button = document.createElement('button');
                button.innerText = 'Start Again';
                button.addEventListener('click', function() {
                    location.reload(); // Reload the page
                });
                div.appendChild(button);
            }

            optionsElement.innerHTML = '';
            questionElement.innerHTML = '';
            questionElement.appendChild(div);
        });
    }

    // Change the button text and limit the use of the skip button
    const buttonElement = document.getElementById('skip');
    buttonElement.innerText = 'Skip';
    buttonElement.addEventListener('click', function() {
        if (skipCount < 3) {
            skipCount++;
            displayQuestion();
        }
    });
}
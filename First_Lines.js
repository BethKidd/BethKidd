
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

async function displayQuestion() {
    let { firstLinesIndex, CorrectAnswer } = await generateRandomFirstLine();
    let [firstDetractor, secondDetractor, thirdDetractor] = getDetractors(firstLinesIndex);

    // Put the MCQ_options in an array
    let options = [CorrectAnswer, firstDetractor, secondDetractor, thirdDetractor];

    // Shuffle the options
    for (let i = options.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }

    // Display the question
    const questionElement = document.getElementById('question');
    questionElement.innerText = novelLinesData[firstLinesIndex].firstLine;

    // Display the options
    const optionsElement = document.getElementById('options');
    optionsElement.innerHTML = options.map(option => `<button>${option}</button>`).join('');

     // Add event listeners to the options buttons
    const buttons = optionsElement.getElementsByTagName('button');
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener('click', function() {
            // Create a div to wrap the text and the image
            const div = document.createElement('div');
            div.style.width = 'fit-content';
            div.style.margin = '0 auto';
            div.style.textAlign = 'center'; // Add this line

            if (this.innerText === CorrectAnswer) {
                // Add the text to the div
                const text = document.createElement('p');
                text.innerText = 'Correct! \n \n The answer is ' + CorrectAnswer;
                div.appendChild(text);

                // Display the author's image
                const img = document.createElement('img');
                img.src = novelLinesData[firstLinesIndex].authorImage;
                img.style.width = '60%'; // Change this line
                img.style.display = 'block'; // Add this line
                img.style.margin = '0 auto'; // Add this line
                div.appendChild(img);
            } else {
                // Add the text to the div
                const text = document.createElement('p');
                text.innerText = 'Incorrect. \n \n The correct answer is ' + CorrectAnswer;
                div.appendChild(text);
            }

            optionsElement.innerHTML = '';
            questionElement.innerHTML = '';
            questionElement.appendChild(div);
        });
    }

    // Change the button text
    const buttonElement = document.getElementById('guess-again');
    buttonElement.innerText = 'Guess again';
}
var ExcelToJSON = function () {
    const btn_startQuiz = document.getElementById('start-quiz')
    this.parseExcel = function (file) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var data = e.target.result;
            var workbook = XLSX.read(data, {
                type: 'binary'
            });
            workbook.SheetNames.forEach(function (sheetName) {
                // Here is your object
                var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                var json_object = JSON.stringify(XL_row_object);
                var quiz_shuffed = shuffle(JSON.parse(json_object));
                if (quiz_shuffed.length > 0) {
                    $('#start-quiz').prop('disabled', false);
                    var quiz_info = `Total Questions = ${quiz_shuffed.length}`;
                } else return
                jQuery('#quiz-info').val(quiz_info);
                btn_startQuiz.onclick = () => {
                    startQuiz(quiz_shuffed)
                }
            })
        };

        reader.onerror = function (ex) {
            console.log(ex);
        };

        reader.readAsBinaryString(file);
    };
};


function handleFileSelect(evt) {

    var files = evt.target.files; // FileList object
    var xl2json = new ExcelToJSON();
    xl2json.parseExcel(files[0]);
}

function buttonSwitcher(id) {
    $(function () {
        $(`#${id}`).toggle();
    });
}

//Fisher–Yates Shuffle
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

function startQuiz(data) {
    //FuncVar
    let correctAnswer = 0;
    let wrongAnswers = []
    let index = 0;
    let quizQuestions = data;
    let quizLength = quizQuestions.length;

    //DocVar
    const header = $('#qa-header');
    const body = $('#qa-body');
    const btn_checkAnswer = document.getElementById('check-answer');
    const btn_answerYes = document.getElementById('answer-yes');
    const btn_answerNo = document.getElementById('answer-no');
    const answerDecor = document.getElementById('answer-decor');

    buttonSwitcher('homepage');
    buttonSwitcher('question-answer');

    function loadQuestion() {
        if (index < quizQuestions.length) {
            let currQuestion = quizQuestions.pop();
            header.text(`Question number: ${currQuestion.No}`);
            body.text(currQuestion.Question);

            btn_checkAnswer.onclick = () => {
                answerDecor.innerHTML = "Did you get it correct?";
                body.text(currQuestion.Answer);
                buttonSwitcher('answer-decor');
                buttonSwitcher('check-answer');
                buttonSwitcher('answer-yes');
                buttonSwitcher('answer-no');
            }

            btn_answerYes.onclick = () => {
                correctAnswer++;
                answerDecor.innerHTML = "";
                buttonSwitcher('check-answer');
                buttonSwitcher('answer-yes');
                buttonSwitcher('answer-no');
                loadQuestion();
            }

            btn_answerNo.onclick = () => {
                wrongAnswers.push(currQuestion);
                answerDecor.innerHTML = "";
                buttonSwitcher('check-answer');
                buttonSwitcher('answer-yes');
                buttonSwitcher('answer-no');
                loadQuestion();
            }
        } else {
            buttonSwitcher('question-answer');
            buttonSwitcher('result-box');
            endQuiz(correctAnswer, wrongAnswers, quizLength);
        }
    }

    loadQuestion();
}

function endQuiz(correctAnswerData, wrongAnswerData, questionLength) {
    //FuncVar
    let correctAnswer = correctAnswerData;
    let wrongAnswers = wrongAnswerData;
    let totalQuestion = questionLength;

    //DocVar
    const scoreText = $('#result-score');
    const wrongText = document.getElementById('result-wrongs');
    const btn_home = document.getElementById('mainmenu-button');

    wrongText.innerText = "Wrong Answers: ";
    scoreText.text(`You scored ${correctAnswer}/${totalQuestion}`)
    for (let i = 0; i < wrongAnswers.length; i++) {
        wrongText.textContent += wrongAnswers[i].No;
        wrongText.textContent += ", ";
    }

    btn_home.onclick = () => {
        buttonSwitcher('result-box');
        buttonSwitcher('homepage');
        buttonSwitcher('quizupload');
    }
}

function tutorialChanger(btnID) {
    const textHeader = document.getElementById('tutorial-text-header');
    const textBody = document.getElementById('tutorial-text-body');

    switch (btnID) {
        case 1:
            textHeader.innerText = "Step 1: Creating your excel file";
            textBody.innerHTML = "To get started, create an XLSX/XLS file from your favourite spreadsheet application." +
                "Create the first row with No | Question | Answer | Source (exact spelling and Capitalization) " +
                "Start filling in with questions and answers! <a href='https://bit.ly/QuizzerpExample'>Example</a>";
            break
        case 2:
            textHeader.innerText = "Step 2: Download your file to local device";
            textBody.innerHTML = "Prepare your \"Knowledge-Filled\" excel file. Fill them up with important subjects " +
                "and those pesky hard concepts that you have to memorize. When you are ready to test yourself, download " +
                "file to your local device and click the \"Get Started\" button";
            break
        case 3:
            textHeader.innerText = "Step 3: Start Quizzerping!";
            textBody.innerHTML = "Quiz yourself, ONLY check answer if you have attempted to answer your question. " +
                "After checking the answer, be honest with yourself. Did you answer it correctly or not? This application " +
                "will record the wrong answers and display which questions were incorrect. Keep trying and do your best!"
            break
        case 4:
            textHeader.innerText = "Step 4: Share your quizzerp!";
            textBody.innerHTML = "The beauty of studying is that you can do it together! Quizzerp with your friends, or " +
                "share your excel file with your friends and let them study along. The boundaries are limitless. " +
                "Remember, studying is a process, and everyone has their own pace :)";

            break
        case 5:textHeader.innerText = "Credits";
            textBody.innerHTML = "For further contact/bug report: <a href='https://www.linkedin.com/in/aulia-rahman-ardan/'> LinkedIn</a>" +
                "\n Check out my other apps: <a href='https://linktr.ee/InspiredByArdan'>Projects</a>"

            break
        default:
            break;
    }
}

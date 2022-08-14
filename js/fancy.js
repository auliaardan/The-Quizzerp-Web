//similar to type() python
var trueTypeOf = (obj) => Object.prototype.toString.call(obj).slice(8, -1).toLowerCase()

var ExcelToJSON = function () {

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
                } else
                    return
                jQuery('#quiz-info').val(quiz_info);
                startQuiz(quiz_shuffed);
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
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

function startQuiz(data) {
    
    while (true){

    }
}


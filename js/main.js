
/**********************************************************************
 * Constants
 *********************************************************************/
const days = {
    0: 'sun',
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat'
}

/**********************************************************************
 * Utility functions
 *********************************************************************/
/* 
The below function is used to get day for the year
input : datestring, year
output : day of the week between 0-6
 */
function getDayForYear(dateString, year) {
    return new Date(dateString.substring(0, dateString.lastIndexOf('/') + 1) + year).getDay();
}

/* 
The below function is used to get day for the year
input : name
output : Initials of the name, 1 character if its only firstname/last name, two characters if more than 1 name
 */
function getInitials(nameString) {
    let nameArray = nameString.split(' ');
    return nameArray.length === 1 ? nameArray[0].charAt(0) :
        nameArray[0].charAt(0) + nameArray[nameArray.length - 1].charAt(0);

}
/* 
The below function is used to validate a date
input : string value
output : if its valid date, return true else false
 */
function validateDate(dt) {
    let yearRegex = /^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|99)?[0-9]{2})*$/;
    return yearRegex.test(dt);
}


/**********************************************************************
 * Primary functions
 *********************************************************************/
/* 
The below function is used to reset css
input : none
output : none
 */
function clearBirthdays() {
    let classPeople = document.getElementsByClassName("day__people");
    for (let i = 0; i < classPeople.length; i++) {
        classPeople[i].innerHTML = "";
    }
    let classDay = document.getElementsByClassName("cal__day");
    for (let i = 0; i < classDay.length; i++) {
        classDay[i].classList.add("day--empty");
    }
}

/* 
The below function is used to create personDiv 
input : initials of the person, day of the week
output : none
 */
function createPersonDiv(initial, day) {
    let div = document.createElement('div');
    div.className = 'day__person';
    div.innerHTML = initial;
    let dayCard = document.querySelector("[data-day='" + days[day] + "']");
    if (dayCard) {
        dayCard.classList.remove("day--empty");
        let peopleDiv = dayCard.getElementsByClassName("day__people")[0];
        peopleDiv.appendChild(div);
    }
}

function redrawStyles() {
    for (let day = 0; day <= 6; day++) {
        let dayCard = document.querySelector("[data-day='" + days[day] + "']");
        if (dayCard) {
            let peopleDiv = dayCard.getElementsByClassName("day__people")[0];
            let rows = Math.ceil(Math.sqrt(peopleDiv.childElementCount));
            peopleDiv.style.gridTemplateColumns = 'repeat(' + rows + ', 1fr)';
            peopleDiv.style.gridTemplateRows = 'repeat(' + rows + ', 1fr)';
            let width = peopleDiv.lastChild.offsetWidth;
            if (width * rows > peopleDiv.offsetWidth) {
                let personDiv = dayCard.getElementsByClassName("day__person");
                for (let i = 0; i < personDiv.length; i++) {
                    personDiv[i].style.fontSize = '0.30em';
                }
            }
        }
    }
}

/* 
The below function will act as entry point when button click happens and redraw the birthday calendar
input : none
output : none
 */
function DisplayBirthdays() {
    let inputField = document.getElementById("json-input");
    let invalidBirthdays = "";
    let year = document.getElementById("year-input").value;
    let dataArray = [];
    try {
        dataArray = eval('(' + inputField.value + ')');
    }
    catch (err) {
        alert("Please enter birthday details");
        return;
    }
    clearBirthdays();
    if (dataArray.length === 0) {
        alert("Please enter birthday details");
        return;
    }
    if (!(/^\d+$/).test(year)) {
        alert("Please enter valid year");
        return;
    }
    dataArray.sort(function (a, b) {
        return new Date(b.birthday) > new Date(a.birthday) ? 1 : -1;
    })
    let minBirthdayYear = new Date(dataArray[0].birthday).getFullYear();
    if (minBirthdayYear > year) {
        alert("You have entered year lesser than the youngest one's year of birth(" + minBirthdayYear + "). This might give you inaccurate result.");
    }
    dataArray.forEach(function (element) {
        validateDate(element.birthday) ?
            createPersonDiv(getInitials(element.name), getDayForYear(element.birthday, year))
            : invalidBirthdays += "\n" + element.name;
    });
    redrawStyles();
    if (invalidBirthdays)
        alert("The below ones are not considered due to wrong date of birth" + invalidBirthdays);
}


document.addEventListener("DOMContentLoaded", function () {
    DisplayBirthdays();
});




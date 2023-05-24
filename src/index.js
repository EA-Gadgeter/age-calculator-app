const messages = {
    emptyMessage: "The field is required",
    validDay: "Must be a valid day",
    validMonth: "Must be a valid month",
    validYear: "Must be a valid year",
    inPast: "Must be in the past",
    validDate: "Must be a valid date",
};

function submitForm(event) {
    event.preventDefault();

    resetErrorUI();

    let isValid = true;

    // Function for validating empty fields
    isValid = validateValueMissing();

    // Function that checks days, months and years are valid
    // receives a bool that indicates that first test passes
    isValid = validateInvalidInputs(isValid);

    // Function that checks that date is valid
    // receives a bool that indicates that second test passes
    isValid = validateInvalidDate(isValid);

    // If everything is correct, we calculate the age
    if (isValid) {
        // Creating date from user input, and today's date
        const userBirth = new Date(`${yearInput.value}-${monthInput.value}-${dayInput.value}`);
        const todayDate = new Date();

        /* No need of adding +1 to the month later is necessary, above JS already indexes
        the months, so when making the subtraction below, the quantity of months is correctly
        calculated */
        let years = todayDate.getFullYear() - userBirth.getUTCFullYear();
        let months = todayDate.getMonth() - userBirth.getUTCMonth();
        let days = todayDate.getDate() - userBirth.getUTCDate();

        // There are a few days left before we reach the birthday day,
        // so we decrease the months in one, we need to get the number of the days of the
        // previous month, and add it to get the correct amount of days
        if (days < 0) {
            months--;
            const daysPreviousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0).getDate();
            days += daysPreviousMonth;
        }

        // We haven't completed year for the next birthday, so we decrease years in 1, and add 12 to months,
        // so they aren't negative
        if (months < 0) {
            years--;
            months += 12;
        }

        yearResult.textContent = years;
        monthResult.textContent = months;
        dayResult.textContent = days;
    }
}

function validateValueMissing() {
    let isValid = true;

    if (dayInput.validity.valueMissing) {
        // We show the message with a content
        dayInputMessage.textContent = messages.emptyMessage;
        dayInputMessage.classList.remove("hidden");

        //Outline the border of the input
        dayInput.classList.add("invalid-input");
        // Make label red
        dayInputLabel.classList.add("invalid-input");

        isValid = false;
    }

    if (monthInput.validity.valueMissing) {
        monthInputMessage.textContent = messages.emptyMessage;
        monthInputMessage.classList.remove("hidden");

        monthInput.classList.add("invalid-input");
        monthInputLabel.classList.add("invalid-input");

        isValid = false;
    }

    if (yearInput.validity.valueMissing) {
        yearInputMessage.textContent = messages.emptyMessage;
        yearInputMessage.classList.remove("hidden");

        yearInput.classList.add("invalid-input");
        yearInputLabel.classList.add("invalid-input");

        isValid = false;
    }

    if(!isValid) {
        yearResult.textContent = "--";
        monthResult.textContent = "--";
        dayResult.textContent = '--';
    }

    return isValid;
}

function validateInvalidInputs(firstTestPassed) {
    if (!firstTestPassed) {
        yearResult.textContent = "--";
        monthResult.textContent = "--";
        dayResult.textContent = '--';

        return false;
    }

    let isValid = true;
    const todayDate = new Date();

    // If the date is not between 1 and 31
    if(dayInput.validity.rangeOverflow || dayInput.validity.rangeUnderflow) {
        dayInputMessage.textContent = messages.validDay;
        dayInputMessage.classList.remove("hidden");

        dayInput.classList.add("invalid-input");
        dayInputLabel.classList.add("invalid-input");

        isValid = false;
    }

    // If the month is not between 1 and 12
    if(monthInput.validity.rangeOverflow || monthInput.validity.rangeUnderflow) {
        monthInputMessage.textContent = messages.validMonth;
        monthInputMessage.classList.remove("hidden");

        monthInput.classList.add("invalid-input");
        monthInputLabel.classList.add("invalid-input");

        isValid = false;
    }


    // If the year is not 4 numerical digits
    if(yearInput.validity.patternMismatch) {
        yearInputMessage.textContent = messages.validYear;
        yearInputMessage.classList.remove("hidden");

        yearInput.classList.add("invalid-input");
        yearInputLabel.classList.add("invalid-input");

        isValid = false;
    } else if (yearInput.value > todayDate.getFullYear()) {
        yearInputMessage.textContent = messages.inPast;
        yearInputMessage.classList.remove("hidden");

        yearInput.classList.add("invalid-input");
        yearInputLabel.classList.add("invalid-input");

        isValid = false;
    }

    if(!isValid) {
        yearResult.textContent = "--";
        monthResult.textContent = "--";
        dayResult.textContent = '--';
    }

    return isValid;
}

function validateInvalidDate(secondTestPassed) {
    if (!secondTestPassed) {
        yearResult.textContent = "--";
        monthResult.textContent = "--";
        dayResult.textContent = '--';

        return false;
    }

    const date = new Date(`${yearInput.value}-${monthInput.value}-${dayInput.value}`);
    // Need to use UTC for avoiding TimeZone to subtract and hour, because time isn't specified in Date constructor
    // if we don't use UTC, date may have one less day
    const year = date.getUTCFullYear();
    const month = date.getUTCMonth() + 1; // JavaScript´s months are 0-based
    const day = date.getUTCDate();

    let isValid = true;
  
    /* 
        Above, if we pass a no-existing data like "2023-04-31"
        Date constructor will transform it to the next valid date,
        that is to say, ANOTHER date, so if the input values are not
        equal to the JS date, then the submitted inputs are invalid.
    */
    const isValidDate = year == yearInput.value && month == monthInput.value && day == dayInput.value;

    if(!isValidDate) {
        dayInputMessage.textContent = messages.validDate;
        dayInputMessage.classList.remove("hidden");

        // Based in the design, we only show the message in the day input,
        // so we hide other inputs messages
        monthInputMessage.classList.add("hidden");
        yearInputMessage.classList.add("hidden");

        dayInput.classList.add("invalid-input");
        dayInputLabel.classList.add("invalid-input");

        // ...but we still need to outline the other inputs
        monthInput.classList.add("invalid-input");
        monthInputLabel.classList.add("invalid-input");

        yearInput.classList.add("invalid-input");
        yearInputLabel.classList.add("invalid-input");

        isValid = false;

        yearResult.textContent = "--";
        monthResult.textContent = "--";
        dayResult.textContent = '--';
    }

    return isValid;
}

function resetErrorUI () {

    dayInput.classList.remove("invalid-input");
    dayInputLabel.classList.remove("invalid-input");
    dayInputMessage.textContent = "";
    dayInputMessage.classList.add("hidden");

    monthInput.classList.remove("invalid-input");
    monthInputLabel.classList.remove("invalid-input");
    monthInputMessage.textContent = "";
    monthInputMessage.classList.add("hidden");

    yearInput.classList.remove("invalid-input");
    yearInputLabel.classList.remove("invalid-input");
    yearInputMessage.textContent = "";
    yearInputMessage.classList.add("hidden");
}

// Obtaining the 3 inputs with this error messages and labels
const dayInput = document.querySelector("#day");
const dayInputMessage = document.querySelector("#dayLabel p");
const dayInputLabel = document.querySelector("#dayLabel span");

const monthInput = document.querySelector("#month");
const monthInputLabel = document.querySelector("#monthLabel span");
const monthInputMessage = document.querySelector("#monthLabel p");

const yearInput = document.querySelector("#year");
const yearInputLabel = document.querySelector("#yearLabel span");
const yearInputMessage = document.querySelector("#yearLabel p");

// Obtain result elements
const yearResult = document.querySelector("#yearResult");
const monthResult = document.querySelector("#monthResult");
const dayResult = document.querySelector("#dayResult");

// Obtaining the form button and adding event
const formButton = document.querySelector("button.arrow-container");
formButton.addEventListener("click", submitForm);

// export module
module.exports.getDate = getDate;

function getDate() {
    let today = new Date();

    let options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    };

    return day = today.toLocaleDateString("en-MY", options);
}

module.exports.getDay = getDay;

function getDay() {
    let today = new Date();

    let options = {
        weekday: "long",
    };

    return day = today.toLocaleDateString("en-MY", options);
}
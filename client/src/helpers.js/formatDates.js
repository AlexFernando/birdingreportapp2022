
let monthsAbbreviation  = ['Ene', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatDates(str) {
    if(str.length > 0) {
        let splittedDate = str.split("-");
        splittedDate[1] = monthsAbbreviation[splittedDate[1]-1];
       
        let convertedStringDate = splittedDate.reverse().join(" ");

        return convertedStringDate
    }
   
    else {
        return str;
    }
}

function formatTimes(str) {
    if(str.length > 0 && str.slice(0,1) === '0') {
        //changing the format 
        let newFormatTime = str.slice(1, str.length);

        return newFormatTime;
    }

    else {
        return str;
    }
}

module.exports = {
    formatDates,
    formatTimes
}
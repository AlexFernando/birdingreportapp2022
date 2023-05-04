function findMatchingDates(dateObjects, startYear, endYear, startMonth, endMonth) {

    let startYearNumber = Number(startYear);
    let endYearNumber = Number(endYear)
    // Create a map of month abbreviations to month numbers
    const monthMap = {
        "Jan": 0,
        "Feb": 1,
        "Mar": 2,
        "Apr": 3,
        "May": 4,
        "Jun": 5,
        "Jul": 6,
        "Aug": 7,
        "Sep": 8,
        "Oct": 9,
        "Nov": 10,
        "Dec": 11,
    };

    const matchingDates = [];
  
    for (let i = 0; i < dateObjects.length; i++) {
      const dateString = dateObjects[i].MyDate;
      const date = new Date(dateString);
  
      const year = date.getFullYear();
      const month = date.getMonth();

      if(Number(monthMap[startMonth]) === 11 && Number(monthMap[endMonth]) === 1){
        
        if (startYearNumber <= year && endYearNumber >= year && (month === 0 || month === 1 || month === 11)) {
            console.log("case")
          matchingDates.push(dateObjects[i]);
        }
      }

      else {
        if (startYearNumber <= year && endYearNumber >= year && Number(monthMap[startMonth]) <= month && Number(monthMap[endMonth]) >= month) {
          console.log("yes")
          matchingDates.push(dateObjects[i]);
        }
      }   
    }

    console.log("matching dates: ", matchingDates)
  
    return matchingDates;
  }
  
module.exports = {
    findMatchingDates
}
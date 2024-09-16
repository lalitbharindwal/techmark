
function emails_sent_today(){
    var total_emails_sent_monthly = 0;
    var total_emails_sent_today = 0;
    for (const key in cache["email-campaigns"].data) {
        if(key != "email"){
          //console.log(cache["email-campaigns"]["data"][key])
            //console.log(key)
            for (const recipients in cache["email-campaigns"]["data"][key]["to"]){
                 // Parse the given date string
                const [datePart, timePart] = cache["email-campaigns"]["data"][key]["to"][recipients]["datetime"].split(' ');
                const [day, month, year] = datePart.split('-');

                // Create a Date object from the parsed components
                const givenDate = new Date(year, month - 1, day);
                // Create a new Date object for the current date
                const now = new Date();

                // Extract current year, month, and day
                const currentYear = now.getFullYear();
                const currentMonth = now.getMonth() + 1; // Note: 0-based month index
                const currentDay = now.getDate(); // Gets the day of the month
                const givenYear = givenDate.getFullYear();
                const givenMonth = givenDate.getMonth() + 1; // Note: 0-based month index
                const givenDay = givenDate.getDate(); // Gets the day of the month
                
                if(givenMonth == currentMonth && givenYear == currentYear){
                    ++total_emails_sent_monthly;
                }

                if(givenDay == currentDay && givenMonth == currentMonth && givenYear == currentYear){
                    ++total_emails_sent_today;
                }

            }
        }
    }
    document.getElementById("emails-sent-today").innerHTML = total_emails_sent_today;
    document.getElementById("total-emails-sent").innerHTML = total_emails_sent_monthly;
    document.getElementById("quota-limit").innerHTML = 2000 - total_emails_sent_today;
}

emails_sent_today()
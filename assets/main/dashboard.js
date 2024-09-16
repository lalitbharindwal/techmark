
function emails_sent_today(){
    var total_emails_sent_monthly = 0;
    var total_emails_sent_today = 0;
    var months =  [0,0,0,0,0,0,0,0,0,0,0,0];
    var days = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
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
                const givenMonth = givenDate.getMonth(); // Note: 0-based month index
                const givenDay = givenDate.getDate(); // Gets the day of the month
                days[givenDay]++;
                months[givenMonth]++;
                if((givenMonth+1) == currentMonth && givenYear == currentYear){
                    total_emails_sent_monthly++;
                }

                if(givenDay == currentDay && (givenMonth+1) == currentMonth && givenYear == currentYear){
                    total_emails_sent_today++;
                }
            }
        }
    }

    document.getElementById("emails-sent-today").innerHTML = total_emails_sent_today;
    document.getElementById("total-emails-sent").innerHTML = total_emails_sent_monthly;
    document.getElementById("quota-limit").innerHTML = 2000 - total_emails_sent_today;
    var options, chart, linechartcustomerColor= getChartColorsArray("total-emails-sent-today"), chartDonutBasicColors = ((options = {
        series: [{
            name: "Emails Sent",
            type: "bar",
            data: months
        }],
        chart: {
            height: 370,
            type: "line",
            toolbar: {
                show: !1
            }
        },
        stroke: {
            curve: "straight",
            dashArray: [0, 0, 8],
            width: [2, 0, 2.2]
        },
        fill: {
            opacity: [0.7, 0.7, 0.7]
        },
        markers: {
            size: [0, 0, 0],
            strokeWidth: 2,
            hover: {
                size: 4
            }
        },
        xaxis: {
            categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"],
            axisTicks: {
                show: !1
            },
            axisBorder: {
                show: !1
            }
        },
        grid: {
            show: !0,
            xaxis: {
                lines: {
                    show: !0
                }
            },
            yaxis: {
                lines: {
                    show: !1
                }
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10
            }
        },
        legend: {
            show: !0,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: -5,
            markers: {
                width: 9,
                height: 9,
                radius: 6
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            }
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                barHeight: "70%"
            }
        },
        colors: linechartcustomerColors
    },
    (chart = new ApexCharts(document.querySelector("#total-emails-sent-today"),options)).render()));


    var options, chart, linechartcustomerColors= getChartColorsArray("total-emails-sent-month"), chartDonutBasicColors = ((options = {
        series: [{
            name: "Emails Sent",
            type: "line",
            data: days
        }],
        chart: {
            height: 370,
            type: "line",
            toolbar: {
                show: !1
            }
        },
        stroke: {
            curve: "straight",
            dashArray: [0, 0, 8],
            width: [2, 0, 2.2]
        },
        fill: {
            opacity: [0.7, 0.7, 0.7]
        },
        markers: {
            size: [0, 0, 0],
            strokeWidth: 2,
            hover: {
                size: 4
            }
        },
        xaxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
                11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
                21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
            axisTicks: {
                show: !1
            },
            axisBorder: {
                show: !1
            }
        },
        grid: {
            show: !0,
            xaxis: {
                lines: {
                    show: !0
                }
            },
            yaxis: {
                lines: {
                    show: !1
                }
            },
            padding: {
                top: 0,
                right: -2,
                bottom: 15,
                left: 10
            }
        },
        legend: {
            show: !0,
            horizontalAlign: "center",
            offsetX: 0,
            offsetY: -5,
            markers: {
                width: 9,
                height: 9,
                radius: 6
            },
            itemMargin: {
                horizontal: 10,
                vertical: 0
            }
        },
        plotOptions: {
            bar: {
                columnWidth: "30%",
                barHeight: "70%"
            }
        },
        colors: linechartcustomerColors
    },
    (chart = new ApexCharts(document.querySelector("#total-emails-sent-month"),options)).render()))
}

emails_sent_today()

function getChartColorsArray(e) {
    if (null !== document.getElementById(e)) {
        var t = document.getElementById(e).getAttribute("data-colors");
        if (t)
            return (t = JSON.parse(t)).map(function(e) {
                var t = e.replace(" ", "");
                return -1 === t.indexOf(",") ? getComputedStyle(document.documentElement).getPropertyValue(t) || t : 2 == (e = e.split(",")).length ? "rgba(" + getComputedStyle(document.documentElement).getPropertyValue(e[0]) + "," + e[1] + ")" : t
            });
        console.warn("data-colors atributes not found on", e)
    }
}
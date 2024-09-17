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




function emailsSendingLog() {
    // Initialize counters and arrays
    let totalEmailsSentMonthly = 0;
    let totalEmailsSentToday = 0;
    let totalEmailsSentYearly = 0;
    // Define years of interest including 2024
    const yearsOfInterest = [2023, 2024, 2025, 2026];

    // Initialize a structure to hold day counts for each year and month
    const data = {};
    yearsOfInterest.forEach(year => {
        data[year] = Array.from({ length: 12 }, () => Array(31).fill(0)); // 12 months, 31 data each
    });

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-based index
    const currentDay = now.getDate();

    // Iterate through cached email data
    for (const key in cache["email-campaigns"].data) {
        if (key !== "email") {
            const campaign = cache["email-campaigns"].data[key];
            for (const recipient of Object.values(campaign.to)) {
                if (recipient.sent) {
                    const [datePart] = recipient.datetime.split(' ');
                    const [day, month, year] = datePart.split('-').map(Number);

                    const givenDate = new Date(year, month - 1, day); // Date object for comparison
                    const givenYear = givenDate.getFullYear();
                    const givenMonth = givenDate.getMonth(); // 0-based index
                    const givenDay = givenDate.getDate();

                    // Check if the year is one of the specified years
                    if (yearsOfInterest.includes(givenYear) && givenDay <= 31 && givenMonth < 12) {
                        data[givenYear][givenMonth][givenDay - 1]++;
                    }

                    // Count emails by month for the current year
                    if (givenYear === currentYear && givenMonth < 12) {
                        totalEmailsSentMonthly++;
                    }

                    // Count emails by year
                    if (yearsOfInterest.includes(givenYear)) {
                        totalEmailsSentYearly++;
                    }

                    // Count emails for today
                    if (givenYear === currentYear) {
                        if (givenMonth === currentMonth) {
                            if (givenDay === currentDay) {
                                totalEmailsSentToday++;
                            }
                        }
                    }
                }
            }
        }
    }

    var EmaildSentDaily = data[currentYear][currentMonth];
    var EmaildSentMonthly = [];
    for(var i=0;i<12;i++){
        const sum = data[currentYear][i].reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        EmaildSentMonthly.push(sum)
    }

    document.getElementById("emails-sent-today").innerHTML = totalEmailsSentToday;
    document.getElementById("total-emails-sent").innerHTML = totalEmailsSentMonthly;
    document.getElementById("quota-limit").innerHTML = 2000 - totalEmailsSentToday;
    cache.data.todaysmailsquota = 2000 - totalEmailsSentToday;
    sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
    var options, chart, linechartcustomerColor= getChartColorsArray("total-emails-sent-month"), chartDonutBasicColors = ((options = {
        series: [{
            name: "Emails Sent",
            type: "bar",
            data: EmaildSentMonthly
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
    (chart = new ApexCharts(document.querySelector("#total-emails-sent-month"),options)).render()));


    var options, chart, linechartcustomerColors= getChartColorsArray("total-emails-sent-today"), chartDonutBasicColors = ((options = {
        series: [{
            name: "Emails Sent",
            type: "line",
            data: EmaildSentDaily
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
    (chart = new ApexCharts(document.querySelector("#total-emails-sent-today"),options)).render()))
}

emailsSendingLog()
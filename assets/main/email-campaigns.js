var payload = [];
var count = 0

async function table(payload){
    document.getElementById("campaigns") && new gridjs.Grid({
        columns: [{
            name: "Sr. No",
            width: "75px",
            formatter: function(e) {
                return gridjs.html('<span class="fw-semibold">' + e + "</span>")
            }
        }, {
            name: "Campaign ID",
            width: "140px",
            formatter: function(e) {
                return gridjs.html(`<a href="campaign-details.html?id=${e}">` + e + "</a>")
            }
        }, {
            name: "Campaign Name",
            width: "170px"
        }, {
            name: "Sender",
            width: "190px"
        }, {
            name: "Sender Name",
            width: "170px"
        }, {
            name: "Useremail",
            width: "190px"
        }, {
            name: "Actions",
            width: "150px",
            formatter: function(e) {
                return gridjs.html(`<a href='campaign-details.html?id=${e}' class='text-reset text-decoration-underline'>Details</a>`)
            }
        }],
        pagination: {
            limit: 10
        },
        sort: !0,
        search: !0,
        data: payload
    }).render(document.getElementById("campaigns"))
} 

const params = new URLSearchParams(window.location.search);
const id = params.get('id');
async function tabledata() {
    await storage("techmark", "get");
    if(id){
        console.log(cache)
        document.getElementById("subject").innerHTML = cache.data["email-campaigns"][id]["payload"]["subject"];
        document.getElementById("from").innerHTML = cache.data["email-campaigns"][id]["payload"]["from"];
        document.getElementById("name").innerHTML = cache.data["email-campaigns"][id]["payload"]["fullname"];
        document.getElementById("user-email").innerHTML = cache.data["email-campaigns"][id]["payload"]["useremail"];
        document.getElementById("cc").innerHTML = cache.data["email-campaigns"][id]["payload"]["cc"];
        document.getElementById("bcc").innerHTML = cache.data["email-campaigns"][id]["payload"]["bcc"];
        document.getElementById("replyto").innerHTML = cache.data["email-campaigns"][id]["payload"]["replyto"];
        if(cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]].domain != "@gmail.com"){
            document.getElementById("domain-name").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["whoisinfo"]["domain_name"];
            document.getElementById("created-on").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["whoisinfo"]["creation_date"];
            document.getElementById("expire-on").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["whoisinfo"]["expiration_date"];
            document.getElementById("nameservers").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["whoisinfo"]["name_servers"];
            document.getElementById("registerer").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["whoisinfo"]["registrar"];
            document.getElementById("ipaddress").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["ip"];
            document.getElementById("a").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["dnsinfo"]["A"];
            document.getElementById("mx").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["dnsinfo"]["MX"];
            document.getElementById("ns").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["dnsinfo"]["NS"];
            document.getElementById("txt").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["dnsinfo"]["TXT"];
            document.getElementById("organization").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["org"];
            document.getElementById("location").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["city"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["postal"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["region"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["payload"]["from"]]["data"]["domaininfo"]["ipinfo"]["timezone"];
        }else{
            document.getElementById("dnsinfo").innerHTML = "";
            document.getElementById("ipinfo").innerHTML = "";
        }
        for (const key in cache.data["email-campaigns"][id]) {
            if(key!="payload"){

                payload.push([++count, key, cache.data["email-campaigns"][id][key]["datetime"], cache.data["email-campaigns"][id][key]["sent"], id]);
            }
        }
        document.getElementById("campaign-detail") && new gridjs.Grid({
            columns: [{
                name: "Sr. No",
                width: "80px",
                formatter: function(e) {
                    return gridjs.html('<span class="fw-semibold">' + e + "</span>")
                }
            }, {
                name: "To",
                width: "150px"
            }, {
                name: "Sent on",
                width: "140px"
            }, {
                name: "Status",
                width: "80px",
                formatter: function(e) {
                    if(e == "True"){
                        return gridjs.html(`<span class="badge bg-success">SENT</span>`)
                    }
    
                    if(e == "False"){
                        return gridjs.html(`<span class="badge bg-danger">FAILED</span>`)
                    }
    
                    if(e == "Error"){
                        return gridjs.html(`<span class="badge bg-warning">ERROR</span>`)
                    }else{
                        return gridjs.html(`<span class="badge bg-info">${e}</span>`)
                    }
                }
            }, {
                name: "Content",
                width: "80px",
                formatter: function(e) {
                    return gridjs.html(`<button type="button" onclick="view_email(this)" id="${e}" data-bs-toggle="modal" data-bs-target=".bs-example-modal-lg" class="btn btn-ghost-dark waves-effect waves-light">View</button>`)
                }
            }],
            pagination: {
                limit: 10
            },
            sort: !0,
            search: !0,
            data: payload
        }).render(document.getElementById("campaign-detail"))
    }else{
        console.log(cache)
        for (const key in cache.data["email-campaigns"]) {
            payload.push([++count, key, cache.data["email-campaigns"][key]["payload"]["subject"], cache.data["email-campaigns"][key]["payload"]["from"], cache.data["email-campaigns"][key]["payload"]["fullname"], cache.data["email-campaigns"][key]["payload"]["useremail"], key]);
        }
        
        await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
        table(payload);
    }
}


function view_email(obj){
    document.getElementById("preview-frame").srcdoc = cache.data["email-campaigns"][obj.id]["payload"]["body_html"];
}

function resizeDevice(deviceType) {
    const iframe1 = document.getElementById("preview");
    const iframe2 = document.getElementById("preview-frame");
    // Set iframe dimensions based on the selected device type
    switch (deviceType) {
        case 'desktop':
            //iframe1.style.width = "17cm";
            //iframe1.style.height = "12cm";
            iframe2.style.width = "15cm";
            iframe2.style.height = "10cm";
            break;
        case 'tablet-p':
            //iframe1.style.width = "10cm";
            //iframe1.style.height = "12cm";
            iframe2.style.width = "10cm";
            iframe2.style.height = "12cm";
            break;
        case 'mobile-p':
            //iframe1.style.width = "7cm";
            //iframe1.style.height = "12cm";
            iframe2.style.width = "7cm";
            iframe2.style.height = "13cm";
            break;
        case 'mobile-l':
            //iframe1.style.width = "15cm";
            //iframe1.style.height = "7cm";
            iframe2.style.width = "13cm";
            iframe2.style.height = "6cm";
            break;
        default:
            //iframe1.style.width = "100%";
            //iframe1.style.height = "800px";
            iframe2.style.width = "15cm";
            iframe2.style.height = "10cm";
    }
}
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
        document.getElementById("subject").innerHTML = cache.data["email-campaigns"][id]["subject"];
        document.getElementById("from").innerHTML = cache.data["email-campaigns"][id]["from"];
        document.getElementById("name").innerHTML = cache.data["email-campaigns"][id]["fullname"];
        document.getElementById("user-email").innerHTML = cache.data["email-campaigns"][id]["useremail"];
        document.getElementById("cc").innerHTML = cache.data["email-campaigns"][id]["cc"];
        document.getElementById("bcc").innerHTML = cache.data["email-campaigns"][id]["bcc"];
        document.getElementById("replyto").innerHTML = cache.data["email-campaigns"][id]["replyto"];
        if(cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]].domain != "@gmail.com"){
            document.getElementById("domain-name").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["whoisinfo"]["domain_name"];
            document.getElementById("created-on").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["whoisinfo"]["creation_date"];
            document.getElementById("expire-on").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["whoisinfo"]["expiration_date"];
            document.getElementById("nameservers").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["whoisinfo"]["name_servers"];
            document.getElementById("registerer").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["whoisinfo"]["registrar"];
            document.getElementById("ipaddress").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["ip"];
            document.getElementById("a").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["dnsinfo"]["A"];
            document.getElementById("mx").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["dnsinfo"]["MX"];
            document.getElementById("ns").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["dnsinfo"]["NS"];
            document.getElementById("txt").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["dnsinfo"]["TXT"];
            document.getElementById("organization").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["org"];
            document.getElementById("location").innerHTML = cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["city"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["postal"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["region"] + " " + cache.data["email-credentials"][cache.data["email-campaigns"][id]["from"]]["data"]["domaininfo"]["ipinfo"]["timezone"];
        }else{
            document.getElementById("dnsinfo").innerHTML = "";
            document.getElementById("ipinfo").innerHTML = "";
        }
        for (const key in cache.data["email-campaigns"][id]["payload"]) {
            payload.push([++count, key, cache.data["email-campaigns"][id]["payload"][key]["datetime"], cache.data["email-campaigns"][id]["payload"][key]["status"], key]);
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
                    return gridjs.html(`<button type="button" onclick="view_email(this)" id="${e}" data-bs-toggle="modal" data-bs-target=".exampleModalFullscreen" class="btn btn-ghost-dark waves-effect waves-light">View</button>`)
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
        for (const key in cache.data["email-campaigns"]) {
            payload.push([++count, key, cache.data["email-campaigns"][key]["subject"], cache.data["email-campaigns"][key]["from"], cache.data["email-campaigns"][key]["fullname"], cache.data["email-campaigns"][key]["useremail"], key]);
        }
        
        await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
        table(payload);
    }
}

function view_email(obj){
    editor1.setHTMLCode(cache.data["email-campaigns"][id]["payload"][obj.id]["body_html"]);
}
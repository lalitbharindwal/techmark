function datetime(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

var campaignid;
function getid(){
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

async function startsession() {
    await storage("techmark", "get");
    document.getElementById("campaignid").innerHTML = getid();
    campaignid = document.getElementById("campaignid").textContent;
    cache.data.campaignid = {};
    show_aliases();
    check_gmail();
}

function show_aliases(){
    document.getElementById("sender-list").innerHTML = `<a class="dropdown-item" data-bs-toggle="modal" data-bs-target=".bs-modal-xl1" href="javascript:void(0);">Manage Sender</a>`;
    document.getElementById("verifiedemailslist").innerHTML = '';
    for (let key in cache["data"]["email-credentials"]) {
        if (cache["data"]["email-credentials"].hasOwnProperty(key)) {
          document.getElementById("sender-list").innerHTML += `<a class="dropdown-item" id="${key}" onclick="select_sender(this)" href="javascript:void(0);">${key}</a>`;
          document.getElementById("verifiedemailslist").innerHTML += 
                `<tr>
                    <td data-label="Name">${cache["data"]["email-credentials"][key]["name"]}</td>
                    <td data-label="Sender">${key}</td>
                    <td data-label="Alias Email">${cache["data"]["email-credentials"][key]["useremail"]}</td>
                    <td data-label="Verified on">${cache["data"]["email-credentials"][key]["created"]}</td>
                    <td data-label="Status" id="status-badge-${key}"><span class="badge bg-light text-body" id="${key}" onclick="select_sender(this)">Select</span></td>
                </tr>`;
        }
    }
}

var recipients;
function check_gmail(){
    const params = new URLSearchParams(window.location.search);
    if(params.get('templateid')){
        storage("techmark", "get");
        editor1.setHTMLCode(cache.data["email-templates"][params.get('templateid')]["html-content"]);
    }
    if(cache.data.gmail != undefined){
        document.getElementById("sender").innerHTML = "Authenticating access...";
        document.getElementById("status-badge-"+cache.data.gmail).innerHTML = `<span class="badge bg-warning">Authenticating</span>`;
        const clientId = '386167497194-ngpan3ub2v01mn4l0lv225gi83jth9mv.apps.googleusercontent.com';
        const redirectUri = 'https://techmark.solutions/add-campaign';
        const clientSecret = "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";
        const event = {
            "email": cache.data.gmail,
            "clientId": clientId,
            "clientSecret": clientSecret,
            "redirect_uri": redirectUri
        }
        flow(event);
    }

    if(cache.data.campaignid.recipients != undefined){
        var emailsHTML = '';
        recipients = cache.data.campaignid.recipients.join(' ');
        (cache.data.campaignid.recipients).forEach((email, index) => {
            emailsHTML += `<tr>
                <td>${index + 1}</td>
                <td>${email.trim()}</td>
            </tr>`;
        });

        // Update the HTML content using innerHTML only once
        document.getElementById("emailslist").innerHTML =
            `<div class="card-header">
                <h4 class="card-title mb-0">Valid Emails</h4>
            </div><!-- end card header -->
            <div class="card-body" style="height: 10cm; overflow: auto;">
                <!-- Striped Rows -->
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Sr. No</th>
                            <th scope="col">Emails</th>
                        </tr>
                    </thead>
                    <tbody id="emails">${emailsHTML}</tbody>
                </table>
            </div>`;

        // Update the buttons section
        document.getElementById("card-btns").innerHTML =
            `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" onclick="editContacts()">
                <i class="ri-edit-box-line me-1 align-middle"></i> Edit
            </a>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="saveContacts()">Select</button>`;
            
        document.getElementById("select-recipient").innerHTML = `${cache.data.campaignid.recipients.length} Recipient Selected`;
    }
}

function validateContactList() {
    recipients = document.getElementById("emaillist").value;
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    // Find all matches of valid email patterns in the textarea
    var validEmails = [...new Set(recipients.match(emailRegex))];
    
    if (validEmails == null) {
        alert("Please Enter Recipients");
        return;
    }

    var emailsHTML = '';
    validEmails.forEach((email, index) => {
        emailsHTML += `<tr>
            <td>${index + 1}</td>
            <td>${email.trim()}</td>
        </tr>`;
    });

    // Update the HTML content using innerHTML only once
    document.getElementById("emailslist").innerHTML =
        `<div class="card-header">
            <h4 class="card-title mb-0">Valid Emails</h4>
        </div><!-- end card header -->
        <div class="card-body" style="height: 10cm; overflow: auto;">
            <!-- Striped Rows -->
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th scope="col">Sr. No</th>
                        <th scope="col">Emails</th>
                    </tr>
                </thead>
                <tbody id="emails">${emailsHTML}</tbody>
            </table>
        </div>`;

    // Update the buttons section
    document.getElementById("card-btns").innerHTML =
        `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" onclick="editContacts()">
            <i class="ri-edit-box-line me-1 align-middle"></i> Edit
        </a>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="saveContacts()">Select</button>`;
}

function editContacts(){
    document.getElementById("emailslist").innerHTML = 
    `<div class="card-header">
        <h4 class="card-title mb-0">Enter Emails</h4>
    </div>
    <div class="card-body">
        <textarea style="width: 100%; height: 8cm;" id="emaillist" placeholder="Enter one email address per line">${recipients}</textarea>
    </div>`;
    document.getElementById("card-btns").innerHTML = 
    `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" data-bs-dismiss="modal">
        <i class="ri-close-line me-1 align-middle"></i> Close
    </a>
    <button type="button" class="btn btn-primary" onclick="validateContactList()">Validate</button>`;
}

function saveContacts(){
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    // Find all matches of valid email patterns in the textarea
    var validEmails = [...new Set(recipients.match(emailRegex))];
    var emails = []
    if(validEmails){
        validEmails.forEach((email, index) => {
            emails.push(email.trim())
        });
    }

    if(emails.length<=300){
        if((cache.data.todaysmailsquota-emails.length) >= 0){
            cache.data.campaignid.recipients = emails;
            document.getElementById("select-recipient").innerHTML = `${emails.length} Recipient Selected`;
            storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
        }else{
            cache.data.campaignid.recipients = undefined;
            document.getElementById("select-recipient").innerHTML = `0 Recipient Selected`;
            alert("Quota Limit Excedding");
        }
    }else{
        alert("Send 300 Emails Per Campaign");
    }
}

function raw(gmail){
const raw =
`From: ${cache.data["email-campaigns"][campaignid]["fullname"]} <${cache.data["email-campaigns"][campaignid]["from"]}>
To: ${gmail}
Cc: ${cache.data["email-campaigns"][campaignid]["cc"]}
Bcc: ${cache.data["email-campaigns"][campaignid]["bcc"]}
Reply-To: ${cache.data["email-campaigns"][campaignid]["replyto"]}
Subject: ${cache.data["email-campaigns"][campaignid]["subject"]}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="techmark-mail-boundary"

--techmark-mail-boundary
Content-Type: text/plain; charset="UTF-8"

${cache.data["email-campaigns"][campaignid]["body_text"]}

--techmark-mail-boundary
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TechMark</title>
</head>
<body>
${cache.data["email-campaigns"][campaignid]["body_html"]}
</body>
</html>

--techmark-mail-boundary--`;

return {"raw": customBase64Encode(raw)}
}

function generatePayload(payload){
    cache.data["email-campaigns"][campaignid] = {
        "useremail": payload["useremail"],
        "fullname": payload["fullname"],
        "from": payload["from"],
        "cc": payload["cc"],
        "bcc": payload["bcc"],
        "replyto": payload["replyto"],
        "subject": payload["subject"],
        "body_text": payload["body_text"],
        "body_html": payload["body_html"],
        "smtp_server": payload["smtp_server"],
        "payload":{},
        "body_text": payload["body_text"],
        "body_html": payload["body_html"]
    };

    payload["to"].forEach((mail, index) => {
        cache.data["email-campaigns"][campaignid]["payload"][mail] = {
            "attributes": {},
            "status": "PENDING",
            "datetime": "",
            "response": ""
        };
    });
}

document.getElementById("send_emails_btn") && document.getElementById("send_emails_btn").addEventListener("click", function() {
    Swal.fire({
        title: "Do you want to start campaign?",
        showDenyButton: !1,
        showCancelButton: !0,
        confirmButtonText: "Start",
        //confirmButtonClass: "btn btn-success w-xs me-2",
        //cancelButtonClass: "btn btn-danger w-xs",
        //denyButtonClass: "btn btn-info w-xs me-2",
        buttonsStyling: !0,
        //denyButtonText: "Don't save",
        showCloseButton: !0
    }).then(function(t) {
        if(t.isConfirmed){
            if(document.getElementById("sender").textContent == "Select Sender"){
                alert("Please select Sender");
            }else{
                if(cache.data.campaignid.recipients == undefined){
                    alert("Please Select Recipients");
                }else{
                    var cc;
                    var bcc;
                    var replyto;
                    var smtp_server;
                    try{
                        cc = document.getElementById("cc").value;
                    }catch(error){
                        cc = "";
                    }
                        
                    try{
                        bcc = document.getElementById("bcc").value;
                    }catch(error){
                        bcc = "";
                    }

                    try{
                        replyto = document.getElementById("replytoemail").value;
                    }catch(error){
                        replyto = "";
                    }

                    try{
                        smtp_server = cache["data"]["email-credentials"][document.getElementById("sender").textContent]["data"]["domaininfo"]["smtp_server"];
                    }catch(error){
                        smtp_server = "";
                    }

                    var payload = {
                        "useremail": cache["data"]["email-credentials"][document.getElementById("sender").textContent]["useremail"],
                        "fullname": cache["data"]["email-credentials"][document.getElementById("sender").textContent]["name"],
                        "from": document.getElementById("sender").textContent,
                        "to": cache.data.campaignid.recipients,
                        "cc": cc,
                        "bcc": bcc,
                        "replyto": replyto,
                        "subject": document.getElementById("subject").value,
                        "body_text": editor1.getPlainText(),
                        "body_html": editor1.getHTMLCode(),
                        "smtp_server": smtp_server
                    }
                    var logmodel = new bootstrap.Modal(document.querySelector('.bs-example-modal-xl1'), {
                        backdrop: 'static', // Disable closing by clicking outside the modal
                        keyboard: false     // Disable closing with the Esc key
                    });
                    logmodel.show();
                    document.getElementById("send_emails_log_btn").innerHTML = `<button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl1">SENDING LOG <i class="ri-send-plane-2-fill fs-10"></i></button>`;
                    document.getElementById("log-title").innerHTML = payload.subject;
                    document.getElementById("log-from").innerHTML = payload.from;
                    document.getElementById("log-subject").innerHTML = payload.subject;
                    document.getElementById("log-name").innerHTML = payload.fullname;
                    document.getElementById("log-cc").innerHTML = payload.cc;
                    document.getElementById("log-bcc").innerHTML = payload.bcc;
                    document.getElementById("log-replyto").innerHTML = payload.replyto;
                    generatePayload(payload);
                    Mailer();
                }
            }
        }
    })
})

function Mailer(){
    if((cache.data["email-campaigns"][campaignid]["from"].split("@"))[1] == "gmail.com"){
        document.getElementById("log-status").innerHTML = "Connecting to server...";
        let jsonString = JSON.stringify(cache.data["email-campaigns"][campaignid]);  
        let compressedData = pako.gzip(jsonString, { level: 9 });
        let compressedBase64 = btoa(String.fromCharCode.apply(null, compressedData));
        let headers = new Headers();
        headers.append('Origin', '*');
        fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
            mode: 'cors',
            headers: headers,
            "method": "POST",
            "body": JSON.stringify({
                "service": "s3",
                "method": "put",
                "bucket_name": "techmark-email-campaigns",
                "file_content": compressedBase64,
                "object_name": `${cache["data"]["email"]}/${campaignid}/payload.txt`
        })
        }).then(response => {
                if (!response.ok) {
                    location = "auth-offline.html";
                }
                return response.json()
        }).then(data => {
            if(JSON.parse(data["body"])["error"] == "true"){
                location = "auth-500.html";
                //console.log(data)
            }else{   
                document.getElementById("log-status").innerHTML = "Starting Connection...";
                cache.data.todaysmailsquota = cache.data.todaysmailsquota-cache.data.campaignid.recipients.length;
                cache.data["email-campaigns"][campaignid]["bearer"] = atob(cache.data.campaignid.bearer);
                cache.data.campaignid.flag = 0;
                send_gmail(cache.data.campaignid.flag);
            }
        }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
        });
    }else{
        document.getElementById("log-status").innerHTML = "Connecting to server...";
        let jsonString = JSON.stringify(cache.data["email-campaigns"][campaignid]);  
        let compressedData = pako.gzip(jsonString, { level: 9 });
        let compressedBase64 = btoa(String.fromCharCode.apply(null, compressedData));
        let headers = new Headers();
        headers.append('Origin', '*');
        fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
            mode: 'cors',
            headers: headers,
            "method": "POST",
            "body": JSON.stringify({
                "service": "s3",
                "method": "put",
                "bucket_name": "techmark-email-campaigns",
                "file_content": compressedBase64,
                "object_name": `${cache["data"]["email"]}/${campaignid}/payload.txt`
            })
        }).then(response => {
            if (!response.ok) {
                location = "auth-offline.html";
            }
            return response.json()
        }).then(data => {
            if(JSON.parse(data["body"])["error"] == "true"){
                location = "auth-500.html";
            }else{
                document.getElementById("log-status").innerHTML = "Starting Connection...";
                cache.data.todaysmailsquota = cache.data.todaysmailsquota-cache.data.campaignid.recipients.length;
                cache.data.campaignid.flag = 0;
                send_email(cache.data.campaignid.flag);
            }
        }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
        });
    }
}


var sent = 0, failed = 0, error = 0, sendingCount = 0;
async function display_log(mail){
    sendingCount++;
    if(cache["data"]["email-campaigns"][campaignid]["payload"][mail]["status"] == "True"){
       sent++;
       document.getElementById("log-status").innerHTML = `Sent to ${mail} successfully`;
       document.getElementById("emaillog").innerHTML += 
        `<tr class="table-success">
            <td data-label="Sr No.">${sendingCount}</td>
            <td data-label="From">${cache.data["email-campaigns"][campaignid]["from"]}</td>
            <td data-label="To">${mail}</td>
            <td data-label="Datetime">${cache["data"]["email-campaigns"][campaignid]["payload"][mail]["datetime"]}</td>
            <td data-label="Status"><span class="badge bg-success">Sent</span></td>
        </tr>`;
        // progressbar
        updateProgressBars(sent, failed, error);
    }

    if(cache["data"]["email-campaigns"][campaignid]["payload"][mail]["status"] == "False"){
       failed++;
       document.getElementById("log-status").innerHTML = `Failed to send ${mail}`;
       document.getElementById("emaillog").innerHTML += 
        `<tr class="table-danger">
            <td data-label="Sr No.">${sendingCount}</td>
            <td data-label="From">${cache.data["email-campaigns"][campaignid]["from"]}</td>
            <td data-label="To">${mail}</td>
            <td data-label="Datetime">${cache["data"]["email-campaigns"][campaignid]["payload"][mail]["datetime"]}</td>
            <td data-label="Status"><span class="badge bg-danger">Failed</span></td>
        </tr>`;
        // progressbar
        updateProgressBars(sent, failed, error);
        document.getElementById("log-status").innerHTML = `Failed to send ${mail}: ${cache["data"]["email-campaigns"][campaignid]["payload"][mail]["response"]}`;
        return
    }

    if(cache["data"]["email-campaigns"][campaignid]["payload"][mail]["status"] == "Error"){
        error++;
        document.getElementById("log-status").innerHTML = `Error to send ${mail}`;
        document.getElementById("emaillog").innerHTML +=
         `<tr class="table-warning">
             <td data-label="Sr No.">${sendingCount}</td>
             <td data-label="From">${cache.data["email-campaigns"][campaignid]["from"]}</td>
             <td data-label="To">${mail}</td>
             <td data-label="Datetime">${cache["data"]["email-campaigns"][campaignid]["payload"][mail]["datetime"]}</td>
             <td data-label="Status"><span class="badge bg-warning">Error</span></td>
         </tr>`;
        // progressbar
        updateProgressBars(sent, failed, error);
     }
}

function updateProgressBars(sent, failed, error) {
    // Calculate total sum of all values
    const total = sent + failed + error;
    const inprogress = cache.data.campaignid.recipients.length - total;
    // Calculate width percentages
    const successPercentage = (sent / total) * 100;
    const inprogressPercentage = (inprogress / total) * 100;
    const failurePercentage = (failed / total) * 100;
    const errorPercentage = (error / total) * 100;

    document.getElementById("log-sent").innerHTML = `<i class="mdi text-success fs-18 align-middle me-2">${sent} Sent</i>`;
    document.getElementById("log-inprogress").innerHTML = `<i class="mdi text-info fs-18 align-middle me-2">${inprogress} In Progress</i>`;
    document.getElementById("log-failed").innerHTML = `<i class="mdi text-danger fs-18 align-middle me-2">${failed} Failed</i>`;
    document.getElementById("log-error").innerHTML = `<i class="mdi text-warning fs-18 align-middle me-2">${error} Error</i>`;
    // Update the progress bars
    document.querySelector('.progress-bar.bg-success').style.width = `${successPercentage}%`;
    document.querySelector('.progress-bar.bg-info').style.width = `${inprogressPercentage}%`;
    document.querySelector('.progress-bar.bg-danger').style.width = `${failurePercentage}%`;
    document.querySelector('.progress-bar.bg-warning').style.width = `${errorPercentage}%`;
}

async function saveemailpayload(email){
    let jsonString = JSON.stringify(cache.data["email-campaigns"][campaignid]);  
    let compressedData = pako.gzip(jsonString, { level: 9 });
    let compressedBase64 = btoa(String.fromCharCode.apply(null, compressedData));
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
        mode: 'cors',
        headers: headers,
        "method": "POST",
        "body": JSON.stringify({
            "service": "s3",
            "method": "put",
            "bucket_name": "techmark-email-campaigns",
            "file_content": compressedBase64,
            "object_name": `${cache["data"]["email"]}/${campaignid}/payload.txt`
        })
    }).then(response => {
        if (!response.ok) {
            location = "auth-offline.html";
        }
        return response.json()
    }).then(data => {
        if(JSON.parse(data["body"])["error"] == "true"){
            location = "auth-500.html";
            //console.log(data)
        }else{
            display_log(email);
        }
    }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
    });
    cache.data.campaignid.flag++;
    await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
    if(cache.data.campaignid.flag < cache.data.campaignid.recipients.length){
        await send_email(cache.data.campaignid.flag);
    }else{
        document.getElementById("log-status").innerHTML = `Campaign Ended`;
    }
}

async function savegmailpayload(gmail){
    let jsonString = JSON.stringify(cache.data["email-campaigns"][campaignid]);  
    let compressedData = pako.gzip(jsonString, { level: 9 });
    let compressedBase64 = btoa(String.fromCharCode.apply(null, compressedData));
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
        mode: 'cors',
        headers: headers,
        "method": "POST",
        "body": JSON.stringify({
            "service": "s3",
            "method": "put",
            "bucket_name": "techmark-email-campaigns",
            "file_content": compressedBase64,
            "object_name": `${cache["data"]["email"]}/${campaignid}/payload.txt`
        })
    }).then(response => {
        if (!response.ok) {
            location = "auth-offline.html";
        }
        return response.json()
    }).then(data => {
        if(JSON.parse(data["body"])["error"] == "true"){
            location = "auth-500.html";
            //console.log(data)
        }else{
            display_log(gmail);
        }
    }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
    });
    cache.data.flag++;
    await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
    if(cache.data.campaignid.flag < cache.data.campaignid.recipients.length){
        await send_gmail(cache.data.campaignid.flag);
    }else{
        document.getElementById("log-status").innerHTML = `Campaign Ended`;
    }
}

async function send_gmail(index){
    var gmail = cache.data.campaignid.recipients[index]
    document.getElementById("log-status").innerHTML = `Sending to ${gmail}`;
    await fetch('https://gmail.googleapis.com/gmail/v1/users/'+ cache.data["email-campaigns"][campaignid]["from"] + '/messages/send', {
        method: 'POST', // Change the method accordingly (POST, PUT, etc.)
        headers: {
           'Authorization': `Bearer ${cache.data["email-campaigns"][campaignid]["bearer"]}`,
           'Content-Type': 'application/json'
       },
            body: JSON.stringify(raw(gmail)) // Convert the request body to JSON string
       }).then(response => {
            if (!response.ok) {
               return false
            }
            return response.json();
       }).then(data => {
           if(data["id"]){
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["response"] = data;
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["status"] = "True";
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["datetime"] = datetime();
           }else{
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["response"] = data;
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["status"] = "False";
                cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["datetime"] = datetime();
           }
       }).catch(error => {
            cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["response"] = error;
            cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["status"] = "Error";
            cache["data"]["email-campaigns"][campaignid]["payload"][gmail]["datetime"] = datetime();
   });

   await savegmailpayload(gmail);
}

async function send_email(index){
    var email = cache.data.campaignid.recipients[index]
    document.getElementById("log-status").innerHTML = `Sending to ${email}`;
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://y9iwqqz637.execute-api.us-east-1.amazonaws.com/techmarkemailapi/", {
      mode: 'cors',
      headers: headers,
      "method": "POST",
      "body": JSON.stringify({
        "action": "send_email",
        "name": cache.data["email-campaigns"][campaignid]["fullname"],
        "email": cache.data["email-campaigns"][campaignid]["from"],
        "useremail": cache.data["email-campaigns"][campaignid]["useremail"],
        "password": atob(cache["data"]["email-credentials"][cache.data["email-campaigns"][campaignid]["from"]]["password"]),
        "to": email,
        "cc": cache.data["email-campaigns"][campaignid]["cc"],
        "bcc": cache.data["email-campaigns"][campaignid]["bcc"],
        "replyto": cache.data["email-campaigns"][campaignid]["replyto"],
        "subject": cache.data["email-campaigns"][campaignid]["subject"],
        "body_text": cache.data["email-campaigns"][campaignid]["body_text"],
        "body_html": cache.data["email-campaigns"][campaignid]["body_html"],
        "smtp_server": cache.data["email-campaigns"][campaignid]["smtp_server"]
    })}).then(response => {
        if (!response.ok) {
          location = "auth-offline.html";
        }
        return response.json()
    }).then(data => {
        if(!data.error){
            if(data.body.status == 'success'){
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["response"] = data.body;
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["status"] = "True";
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["datetime"] = datetime();
            }else{
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["response"] = data.body;
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["status"] = "False";
                cache["data"]["email-campaigns"][campaignid]["payload"][email]["datetime"] = datetime();
            }
        }

    }).catch(error => {
        cache["data"]["email-campaigns"][campaignid]["payload"][email]["response"] = error;
        cache["data"]["email-campaigns"][campaignid]["payload"][email]["status"] = "Error";
        cache["data"]["email-campaigns"][campaignid]["payload"][email]["datetime"] = datetime();
    });

    await saveemailpayload(email);
}

function getEmail(){
    let email = document.getElementById("newemail").value;
    const domain = email.split('@')[1];
    if(domain != undefined){
      document.getElementById("domain").innerHTML = `@${domain}`;
    }
  }

function extractCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

function flow(event){
    const bearer = cache.data.campaignid.bearer;
    if(bearer == undefined){
        const authorizationCode = extractCodeFromUrl();
        if (authorizationCode) {
            authenticate_code(authorizationCode, event);
        }else{
            document.getElementById("sender").innerHTML = "Select Sender";
            document.getElementById("status-badge-"+event["email"]).innerHTML = `<span class="badge bg-danger">Authentication Failed</span>`;
        }
    }else{
        getProfile(atob(bearer), event)
    }
  }

function getCode(gmail){
    const event = {
        "clientId": '386167497194-ngpan3ub2v01mn4l0lv225gi83jth9mv.apps.googleusercontent.com',
        "redirect_uri": 'https://techmark.solutions/add-campaign'
    }
    if(gmail != ""){
        cache.data.gmail = gmail;
        storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
        startOAuthFlow(event["clientId"], event["redirect_uri"]);
    }else{
        alert("Please enter valid Gmail");
    }
  }

// Function to initiate OAuth flow
function startOAuthFlow(clientId, redirect_uri) {
    const authorizationEndpoint = 'https://accounts.google.com/o/oauth2/auth';
    const scope = 'https://mail.google.com/'; // Scopes required by your application
    const responseType = 'code';
    // Construct the authorization URL
    const authUrl = `${authorizationEndpoint}?client_id=${clientId}&redirect_uri=${redirect_uri}&response_type=${responseType}&scope=${scope}`;
    // Redirect user to the authorization URL
    window.location.href = authUrl;
  }

function authenticate_code(authCode, event){
    fetch('https://fejo93w844.execute-api.us-east-1.amazonaws.com/techmark-oauth', {
        method: 'POST',
        body: JSON.stringify({
            "client_id": event["clientId"],
            "client_secret": event["clientSecret"],
            "redirect_uri": event["redirect_uri"],
            "code": authCode
        })
        }).then((data)=>{
            return data.text();
        }).then((data2)=>{
            const token_json = JSON.parse(data2)
            getProfile(JSON.parse(token_json["body"])["access_token"], event)
    });
  }

function getProfile(token, event){
    document.getElementById("sender").innerHTML = "Verifying...";
    fetch('https://gmail.googleapis.com/gmail/v1/users/'+ event["email"] +'/profile', {
        method: 'GET', // Change the method accordingly (POST, PUT, etc.)
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
        }).then(response => {
            return response.json();
        }).then(data => {
            try{
                if(data["error"]["status"] == "PERMISSION_DENIED"){
                    cache.data.campaignid.bearer = undefined;
                    cache.data.gmail = undefined;
                    storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
                    document.getElementById("status-badge-"+event["email"]).innerHTML = `<span class="badge bg-danger">Authentication Failed</span>`;
                    document.getElementById("sender").innerHTML = ((data["error"]["message"]).split(" ")[3]);
                }
            }catch{
                    cache.data.campaignid.bearer = btoa(token);
                    cache.data.gmail = data["emailAddress"];
                    storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
                    document.getElementById("status-badge-"+data["emailAddress"]).innerHTML = `<span class="badge bg-success">Selected</span>`;
                    document.getElementById("sender").innerHTML = data["emailAddress"];
            }
        }).catch(error => {
            cache.data.campaignid.bearer = undefined;
            cache.data.gmail = undefined;
            storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
            document.getElementById("status-badge-"+data["emailAddress"]).innerHTML = `<span class="badge bg-danger">Authentication Failed</span>`;
            document.getElementById("sender").innerHTML = "Authentication Failed";
            alert("Please Authenticate " + event["email"]);
    });
  }

function putCredentials(){
  var condition_expression = "#useremail = :value1";
  var update_expression = "SET #useremailcredentials = :value2";
  var expression_attribute_names = {"#useremail": "email", "#useremailcredentials": "email-credentials"};
  var expression_attribute_values = {":value1": cache["data"]["email"],  ":value2": cache["data"]["email-credentials"]};
  let headers = new Headers();
  headers.append('Origin', '*');
  fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
    mode: 'cors',
    headers: headers,
    "method": "POST",
    "body": JSON.stringify({
      "service": "dynamodb",
      "method": "update",
      "table_name": "techmark-solutions",
      "primary_key": {"email": cache["data"]["email"]},
      "condition_expression": condition_expression,
      "update_expression": update_expression,
      "expression_attribute_names": expression_attribute_names,
      "expression_attribute_values": expression_attribute_values
    })
  }).then(response => {
      if (!response.ok) {
        location = "auth-offline.html";
      }
      return response.json()
  }).then(data => {
      if(JSON.parse(data["body"])["error"] == "true"){
          location = "auth-500.html";
      }else{
        storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
      }
  }).catch(error => {
      location = "auth-offline.html";
  });
}

//
function select_sender(obj){
    if(cache["data"]["email-credentials"][obj.id]["domain"] == "@gmail.com"){
        getCode(obj.id)
    }else{
        document.getElementById("status-badge-"+obj.id).innerHTML = `<span class="badge bg-info">Authenticating</span>`;
        document.getElementById("sender").innerHTML = "Authenticating";
        const payload = cache["data"]["email-credentials"][obj.id]
        let headers = new Headers();
        headers.append('Origin', '*');
        fetch("https://y9iwqqz637.execute-api.us-east-1.amazonaws.com/techmarkemailapi/", {
          mode: 'cors',
          headers: headers,
          "method": "POST",
          "body": JSON.stringify({
            "action": "authenticate",
            "email": payload.useremail,
            "password": atob(payload.password)
        })}).then(response => {
            if (!response.ok) {
              location = "auth-offline.html";
            }
            return response.json()
        }).then(data => {
            if(!data.error){
                if(data.body.login){
                    const domaininfo = JSON.parse(data.body.domaininfo);
                    const whoisinfo = domaininfo.domaininfo.whoisinfo;
                        const dnsinfo = domaininfo.domaininfo.dnsinfo;
                        const ipinfo = domaininfo.domaininfo.ipinfo;
                        const smtp_server = domaininfo.domaininfo.smtp_server;
                        const log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Ip Address</th>
                                                <td class="text-muted" data-label="-">${ipinfo.ip}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Loc</th>
                                                <td class="text-muted" data-label="-">${ipinfo.loc}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">City</th>
                                                <td class="text-muted" data-label="-">${ipinfo.city}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Postal</th>
                                                <td class="text-muted" data-label="-">${ipinfo.postal}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Country</th>
                                                <td class="text-muted" data-label="-">${ipinfo.country}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Organisation</th>
                                                <td class="text-muted" data-label="-">${ipinfo.org}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Timestamp</th>
                                                <td class="text-muted" data-label="-">${ipinfo.timezone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    
                    show_aliases();
                    document.getElementById("sender").innerHTML = obj.id;
                    document.getElementById("status-badge-"+obj.id).innerHTML = `<span class="badge bg-success">Selected</span>`;
                    document.getElementById("domaininfo").innerHTML = log;
                }else{
                    show_aliases();
                    document.getElementById("sender").innerHTML = "Select Sender";
                    document.getElementById("status-badge-"+obj.id).innerHTML = `<span class="badge bg-danger">Authentication Failed</span>`;
                    const domaininfo = JSON.parse(data.body.domaininfo);
                    const whoisinfo = domaininfo.domaininfo.whoisinfo;
                    const dnsinfo = domaininfo.domaininfo.dnsinfo;
                    const ipinfo = domaininfo.domaininfo.ipinfo;
                    const smtp_server = domaininfo.domaininfo.smtp_server;
                    var log = '';
                    if(whoisinfo){
                        log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }
                    
                    if(dnsinfo){
                        log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }

                    if(ipinfo){
                        log = `<div class="card">
                                <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Ip Address</th>
                                                <td class="text-muted" data-label="-">${ipinfo.ip}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Loc</th>
                                                <td class="text-muted" data-label="-">${ipinfo.loc}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">City</th>
                                                <td class="text-muted" data-label="-">${ipinfo.city}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Postal</th>
                                                <td class="text-muted" data-label="-">${ipinfo.postal}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Country</th>
                                                <td class="text-muted" data-label="-">${ipinfo.country}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Organisation</th>
                                                <td class="text-muted" data-label="-">${ipinfo.org}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Timestamp</th>
                                                <td class="text-muted" data-label="-">${ipinfo.timezone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }
                    document.getElementById("domaininfo").innerHTML = log;
                }
            }else{
                location = "auth-500.html";
            }
        }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
        });
    }
}

function verifymail(){
    const payload = {
        "name": document.getElementById("newemailname").value,
        "useremail": document.getElementById("newemail").value,
        "password": btoa(document.getElementById("newemailpassword").value),
        "alias-email": (document.getElementById("newaliasemail").value == "")?"":document.getElementById("newaliasemail").value+document.getElementById("domain").textContent,
        "domain": document.getElementById("domain").textContent,
        "created": datetime()
    }
    if(payload.domain == "@gmail.com"){
        cache["data"]["email-credentials"][payload["useremail"]] = payload;
        putCredentials();
        getCode(payload.useremail);
    }else{
        let headers = new Headers();
        headers.append('Origin', '*');
        document.getElementById("verifyemailBtn").innerHTML = `<button type="button" class="btn rounded-pill btn-info waves-effect">Verifying...</button>`;
        fetch("https://y9iwqqz637.execute-api.us-east-1.amazonaws.com/techmarkemailapi/", {
          mode: 'cors',
          headers: headers,
          "method": "POST",
          "body": JSON.stringify({
            "action": "authenticate",
            "email": payload.useremail,
            "password": atob(payload.password)
        })}).then(response => {
            if (!response.ok) {
              location = "auth-offline.html";
            }
            return response.json()
        }).then(data => {
            console.log(data)
            if(!data.error){
                if(data.body.login){
                    const domaininfo = JSON.parse(data.body.domaininfo);
                    const whoisinfo = domaininfo.domaininfo.whoisinfo;
                        const dnsinfo = domaininfo.domaininfo.dnsinfo;
                        const ipinfo = domaininfo.domaininfo.ipinfo;
                        const smtp_server = domaininfo.domaininfo.smtp_server;
                        const log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Ip Address</th>
                                                <td class="text-muted" data-label="-">${ipinfo.ip}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Loc</th>
                                                <td class="text-muted" data-label="-">${ipinfo.loc}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">City</th>
                                                <td class="text-muted" data-label="-">${ipinfo.city}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Postal</th>
                                                <td class="text-muted" data-label="-">${ipinfo.postal}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Country</th>
                                                <td class="text-muted" data-label="-">${ipinfo.country}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Organisation</th>
                                                <td class="text-muted" data-label="-">${ipinfo.org}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Timestamp</th>
                                                <td class="text-muted" data-label="-">${ipinfo.timezone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    if(payload["alias-email"] == ""){
                        payload["data"] = domaininfo;
                        cache["data"]["email-credentials"][payload.useremail] = payload;
                        storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
                        show_aliases();
                        putCredentials(payload);
                        document.getElementById("status-badge-"+payload.useremail).innerHTML = `<span class="badge bg-success">Selected</span>`;
                        document.getElementById("sender").innerHTML = payload.useremail;
                        document.getElementById("verifyemailBtn").innerHTML = `<button type="button" class="btn rounded-pill btn-success waves-effect">VERIFIED</button>`;
                        document.getElementById("domaininfo").innerHTML = log;
                        document.getElementById("domaininfolog").innerHTML = log;
                    }else{
                        payload["data"] = JSON.parse(data.body.domaininfo)
                        cache["data"]["email-credentials"][payload["alias-email"]] = payload;
                        storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
                        show_aliases();
                        putCredentials(payload);
                        document.getElementById("status-badge-"+payload["alias-email"]).innerHTML = `<span class="badge bg-success">Selected</span>`;
                        document.getElementById("sender").innerHTML = payload["alias-email"];
                        document.getElementById("verifyemailBtn").innerHTML = `<button type="button" class="btn rounded-pill btn-success waves-effect">VERIFIED</button>`;
                        document.getElementById("domaininfo").innerHTML = log;
                        document.getElementById("domaininfolog").innerHTML = log;
                    }
                }else{
                    show_aliases();
                    document.getElementById("verifyemailBtn").innerHTML = `<button type="button" class="btn rounded-pill btn-light waves-effect" onclick="verifymail()">VERIFY</button><hr>
                                                                            <!-- Danger Alert -->
                                                                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                                                <strong>Verification Failed</strong>
                                                                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                                                            </div>`;
                    const domaininfo = JSON.parse(data.body.domaininfo);
                    const whoisinfo = domaininfo.domaininfo.whoisinfo;
                    const dnsinfo = domaininfo.domaininfo.dnsinfo;
                    const ipinfo = domaininfo.domaininfo.ipinfo;
                    const smtp_server = domaininfo.domaininfo.smtp_server;
                    var log = '';
                    if(whoisinfo){
                        log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }
                    
                    if(dnsinfo){
                        log = `<div class="card">
                            <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }

                    if(ipinfo){
                        log = `<div class="card">
                                <div class="card-body">
                                <h5 class="card-title mb-3">${payload.useremail}</h5>
                                <div class="table-responsive">
                                    <table class="table table-borderless mb-0">
                                        <tbody>
                                            <tr>
                                                <th class="ps-0" scope="col">User Email</th>
                                                <td class="text-muted" data-label="-">${payload.useremail}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain</th>
                                                <td class="text-muted" data-label="-">${payload.domain}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">User Name</th>
                                                <td class="text-muted" data-label="-">${payload.name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Alias Email</th>
                                                <td class="text-muted" data-label="-">${payload["alias-email"]}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="col">Domain Name</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.domain_name}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Created On</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.creation_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Expiry Date</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.expiration_date}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">SMTP Server</th>
                                                <td class="text-muted" data-label="-">${smtp_server}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Name Servers :</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.name_servers}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Registerer</th>
                                                <td class="text-muted" data-label="-">${whoisinfo.registrar}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">A</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.A}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">MX</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.MX}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">NS</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.NS}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">TXT</th>
                                                <td class="text-muted" data-label="-">${dnsinfo.TXT}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Ip Address</th>
                                                <td class="text-muted" data-label="-">${ipinfo.ip}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Loc</th>
                                                <td class="text-muted" data-label="-">${ipinfo.loc}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">City</th>
                                                <td class="text-muted" data-label="-">${ipinfo.city}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Postal</th>
                                                <td class="text-muted" data-label="-">${ipinfo.postal}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Country</th>
                                                <td class="text-muted" data-label="-">${ipinfo.country}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Organisation</th>
                                                <td class="text-muted" data-label="-">${ipinfo.org}</td>
                                            </tr>
                                            <tr>
                                                <th class="ps-0" scope="row">Timestamp</th>
                                                <td class="text-muted" data-label="-">${ipinfo.timezone}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div><!-- end card body -->
                        </div><!-- end card -->`;
                    }
                    document.getElementById("domaininfo").innerHTML = log;
                    document.getElementById("domaininfolog").innerHTML = log;
                }
            }else{
                location = "auth-500.html";
            }
        }).catch(error => {
            //console.log(error)
            location = "auth-offline.html";
        });
    }
}

function dropdown(obj){
    if(obj.id == "ccon"){
        document.getElementById("Cc").innerHTML =
            `<div class="row mb-3">
                <div class="col-lg-1">
                    <label for="Cc" class="form-label">Cc</label>
                </div>
                <div class="col-lg-4">
                    <input type="email" class="form-control" id="cc" placeholder="Enter Cc Recipient" multiple>
                </div>
            </div>`;
        document.getElementById("toggle-cc-btn").innerHTML = '<a class="dropdown-item active" id="ccoff" onclick="dropdown(this)">Cc</a>';
    }else if(obj.id == "ccoff"){
        document.getElementById("Cc").innerHTML = "";
        document.getElementById("toggle-cc-btn").innerHTML = '<a class="dropdown-item" id="ccon" onclick="dropdown(this)">Cc</a>';
    }else if(obj.id == "bccon"){
        document.getElementById("Bcc").innerHTML = 
            `<div class="row mb-3">
                <div class="col-lg-1">
                    <label for="Bcc" class="form-label">Bcc</label>
                </div>
                <div class="col-lg-4">
                    <input type="email" class="form-control" id="bcc" placeholder="Enter Bcc Recipient" multiple>
                </div>
            </div>`;
        document.getElementById("toggle-bcc-btn").innerHTML = '<a class="dropdown-item active" id="bccoff" onclick="dropdown(this)">Bcc</a>';
    }else if(obj.id == "bccoff"){
        document.getElementById("Bcc").innerHTML = "";
        document.getElementById("toggle-bcc-btn").innerHTML = '<a class="dropdown-item" id="bccon" onclick="dropdown(this)">Bcc</a>';
    }else if(obj.id == "replytoon"){
        document.getElementById("Replyto").innerHTML = 
            `<div class="row mb-3">
                <div class="col-lg-1">
                    <label for="Bcc" class="form-label">Replyto</label>
                </div>
                <div class="col-lg-4">
                    <input type="email" class="form-control" id="replytoemail" placeholder="Enter Replyto Recipient">
                </div>
            </div>`;
        document.getElementById("toggle-replyto-btn").innerHTML = '<a class="dropdown-item active" id="replytooff" onclick="dropdown(this)">Replyto</a>';
    }else if(obj.id == "replytooff"){
        document.getElementById("Replyto").innerHTML = "";
        document.getElementById("toggle-replyto-btn").innerHTML = '<a class="dropdown-item" id="replytoon" onclick="dropdown(this)">Replyto</a>';
    }
}
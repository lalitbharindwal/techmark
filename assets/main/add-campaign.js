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

for (let key in cache["data"]["email-credentials"]) {
    if (cache["data"]["email-credentials"].hasOwnProperty(key)) {
      document.getElementById("sender-list").innerHTML += `<a class="dropdown-item" id="${key}" onclick="select_sender(this)" href="javascript:void(0);">${key}</a>`;
      document.getElementById("verifiedemailslist").innerHTML += 
            `<tr>
                <td data-label="Name">${cache["data"]["email-credentials"][key]["name"]}</td>
                <td data-label="Email">${key}</td>
                <td data-label="Alias Email">${cache["data"]["email-credentials"][key]["alias-email"]}-</td>
                <td data-label="Verified on">${cache["data"]["email-credentials"][key]["created"]}</td>
            </tr>`;
    }
  }

function select_sender(obj){
    if(cache["data"]["email-credentials"][obj.id]["domain"] == "@gmail.com"){
        getCode(obj.id)
    }
}

function customBase64Encode(str) {
    let utf8Bytes = unescape(encodeURIComponent(str));
    let charCodeList = utf8Bytes.split('').map(c => c.charCodeAt(0));
    let binaryString = String.fromCharCode(...charCodeList);
    return btoa(binaryString);
  }

function raw(payload){
const raw =
`From: ${payload["fullname"]} <${payload["from"]}>
To: ${payload["to"]}
Cc: ${payload["cc"]}
Bcc: ${payload["bcc"]}
Reply-To: ${payload["replyto"]}
Subject: ${payload["subject"]}
MIME-Version: 1.0
Content-Type: multipart/alternative; boundary="techmark-mail-boundary"

--techmark-mail-boundary
Content-Type: text/plain; charset="UTF-8"

${payload["body_text"]}

--techmark-mail-boundary
Content-Type: text/html; charset="UTF-8"

<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>TechMark</title>
</head>
<body>
${payload["body_html"]}
</body>
</html>

--techmark-mail-boundary--`;

return {"raw": customBase64Encode(raw)}
}

function send_mail(){
    var cc;
    var bcc;
    var replyto;
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

    let userResponse = confirm("Do you want to proceed?");
    if (userResponse) {
      if(document.getElementById("sender").textContent == "Select Sender"){
        alert("Please select Sender");
      }else{
        if(cache.data.recipients == undefined){
          alert("Please Select Recipients");
        }else{
          const payload = {
                "fullname": cache["data"]["email-credentials"][document.getElementById("sender").textContent]["name"],
                "from": document.getElementById("sender").textContent,
                "to": cache["data"]["recipients"],
                "cc": cc,
                "bcc": bcc,
                "replyto": replyto,
                "subject": document.getElementById("subject").value,
                "body_text": editor1.getPlainText(),
                "body_html": editor1.getHTMLCode()
            }
          if((payload["from"].split("@"))[1] == "gmail.com"){
            var logmodel = new bootstrap.Modal(document.querySelector('.bs-example-modal-xl1'), {
                backdrop: 'static', // Disable closing by clicking outside the modal
                keyboard: false     // Disable closing with the Esc key
            });
            logmodel.show();
            document.getElementById("send_emails_btn").innerHTML = `<button class="btn btn-primary" type="button" data-bs-toggle="modal" data-bs-target=".bs-example-modal-xl1">SENDING LOG <i class="ri-send-plane-2-fill fs-10"></i></button>`;
            document.getElementById("log-title").innerHTML = payload.subject;
            document.getElementById("log-from").innerHTML = payload.from;
            document.getElementById("log-subject").innerHTML = payload.subject;
            document.getElementById("log-name").innerHTML = payload.fullname;
            document.getElementById("log-cc").innerHTML = payload.cc;
            document.getElementById("log-bcc").innerHTML = payload.bcc;
            document.getElementById("log-replyto").innerHTML = payload.replyto;
            payload["bearer"] = atob(cache.data.bearer);
            payload["to"].forEach((gmail, index) => {
                const delay = 2850 * index;
                setTimeout(() => {
                    payload["to"] = gmail;
                    payload["requestBody"] = raw(payload)
                    send_gmail(payload)
                }, delay);
            });
          }
        }
      }
    }
}

var sent = 0, failed = 0, error = 0, sendingCount = 0;
function display_log(payload){
    sendingCount++;
    if(payload["sent"] == "True"){
       sent++;
       document.getElementById("emaillog").innerHTML += 
        `<tr class="table-success">
            <td>${sendingCount}</td>
            <td>${payload.from}</td>
            <td>${payload.to}</td>
            <td>${payload.datetime}</td>
            <td><span class="badge bg-success">Sent</span></td>
        </tr>`;
    }

    if(payload["sent"] == "False"){
       failed++;
       document.getElementById("emaillog").innerHTML += 
        `<tr class="table-danger">
            <td>${sendingCount}</td>
            <td>${payload.from}</td>
            <td>${payload.to}</td>
            <td>${payload.datetime}</td>
            <td><span class="badge bg-danger">Failed</span></td>
        </tr>`;
    }

    if(payload["sent"] == "Error"){
        error++;
        document.getElementById("emaillog").innerHTML += 
         `<tr class="table-warning">
             <td>${sendingCount}</td>
             <td>${payload.from}</td>
             <td>${payload.to}</td>
             <td>${payload.datetime}</td>
             <td><span class="badge bg-warning">Error</span></td>
         </tr>`;
     }

    // progressbar
    updateProgressBars(sent, failed, error);
}

function updateProgressBars(sent, failed, error) {
    // Calculate total sum of all values
    const total = sent + failed + error;
    const inprogress = cache["data"]["recipients"].length - total;

    // Calculate width percentages
    const successPercentage = (sent / total) * 100;
    const inprogressPercentage = (inprogress / total) * 100;
    const failurePercentage = (failed / total) * 100;
    const errorPercentage = (error / total) * 100;

    document.getElementById("log-sent").innerHTML = `<i class="mdi mdi-numeric-${sent}-circle text-success fs-18 align-middle me-2"></i>Sent`;
    document.getElementById("log-inprogress").innerHTML = `<i class="mdi mdi-numeric-${inprogress}-circle text-info fs-18 align-middle me-2"></i>In Progress`;
    document.getElementById("log-failed").innerHTML = `<i class="mdi mdi-numeric-${failed}-circle text-danger fs-18 align-middle me-2"></i>Failed`;
    document.getElementById("log-error").innerHTML = `<i class="mdi mdi-numeric-${error}-circle text-warning fs-18 align-middle me-2"></i>Error`;
    // Update the progress bars
    document.querySelector('.progress-bar.bg-success').style.width = `${successPercentage}%`;
    document.querySelector('.progress-bar.bg-info').style.width = `${inprogressPercentage}%`;
    document.querySelector('.progress-bar.bg-danger').style.width = `${failurePercentage}%`;
    document.querySelector('.progress-bar.bg-warning').style.width = `${errorPercentage}%`;
}

function savepayload(payload){
    console.log(payload)
}

function send_gmail(payload){
    fetch('https://gmail.googleapis.com/gmail/v1/users/'+ payload.from + '/messages/send', {
        method: 'POST', // Change the method accordingly (POST, PUT, etc.)
        headers: {
           'Authorization': `Bearer ${payload.bearer}`,
           'Content-Type': 'application/json'
       },
            body: JSON.stringify(payload.requestBody) // Convert the request body to JSON string
       }).then(response => {
            if (!response.ok) {
               return false
            }
            return response.json();
       }).then(data => {
           if(data["id"]){
               payload["response"] = data;
               payload["sent"] = "True";
               payload["datetime"] = datetime();
               display_log(payload);
               savepayload(payload);
           }else{
               payload["response"] = data;
               payload["sent"] = "False";
               payload["datetime"] = datetime();
               display_log(payload);
               savepayload(payload);
           }
       }).catch(error => {
            payload["response"] = error;
            payload["sent"] = "Error";
            payload["datetime"] = datetime();
            display_log(payload);
            savepayload(payload);
   });
}

function getEmail(){
    let email = document.getElementById("newemail").value;
    const domain = email.split('@')[1];
    if(domain != undefined){
      document.getElementById("domain").innerHTML = `@${domain}`;
    }
  }

var text;
function validateContactList(){
    text = document.getElementById("emaillist").value;
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    // Find all matches of valid email patterns in the textarea
    var validEmails = text.match(emailRegex);
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
            <tbody id="emails"></tbody>
        </table>
    </div>`;

    document.getElementById("card-btns").innerHTML =
    `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" onclick="editContacts()">
        <i class="ri-edit-box-line me-1 align-middle" ></i> Edit
    </a>
    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="saveContacts()">Select</button>`;

    if(validEmails){
        validEmails.forEach((email, index) => {
            document.getElementById("emails").innerHTML += 
            `<tr>
                <td>${index+1}</td>
                <td>${email.trim()}</td>
            </tr>`;
        });
    }
  }

function editContacts(){
    document.getElementById("emailslist").innerHTML = 
    `<div class="card-header">
        <h4 class="card-title mb-0">Enter Emails</h4>
    </div>
    <div class="card-body">
        <textarea style="width: 100%; height: 8cm;" id="emaillist" placeholder="Enter one email address per line">${text}</textarea>
    </div>`;
    document.getElementById("card-btns").innerHTML = 
    `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" data-bs-dismiss="modal">
        <i class="ri-close-line me-1 align-middle"></i> Close
    </a>
    <button type="button" class="btn btn-primary" onclick="validateContactList()">Next</button>`;
}

function saveContacts(){
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    // Find all matches of valid email patterns in the textarea
    var validEmails = text.match(emailRegex);
    var emails = []
    if(validEmails){
        validEmails.forEach((email, index) => {
            emails.push(email.trim())
        });
    }
    cache["data"]["recipients"] = emails;
    document.getElementById("select-recipient").innerHTML = `${emails.length} Recipient Selected`;
}


function verifymail(){
    const email = document.getElementById("newemail").value;
    let domain = document.getElementById("domain").textContent;
    const payload = {
        "name": document.getElementById("newemailname").value,
        "password": document.getElementById("newemailpassword").value,
        "alias-email": document.getElementById("newaliasemail").value,
        "domain": document.getElementById("domain").textContent,
        "created": datetime()
    }
    if(domain == "@gmail.com"){
        putCredentials(email, payload);
        getCode(email);
    }else{
        alert("Enter Valid Gmail");
    }
}

function extractCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

if(cache.data.gmail != undefined){
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

function flow(event){
    const bearer = cache.data.bearer;
    if(bearer == undefined){
        const authorizationCode = extractCodeFromUrl();
        if (authorizationCode) {
            authenticate_code(authorizationCode, event);
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
        sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
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
    fetch('https://gmail.googleapis.com/gmail/v1/users/'+ event["email"] +'/profile', {
        method: 'GET', // Change the method accordingly (POST, PUT, etc.)
        headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
        }
        }).then(response => {
            if (!response.ok) {
                alert("Please Verify " + event["email"]);
            }
            return response.json();
        }).then(data => {
            try{
                if(data["error"]["status"] == "PERMISSION_DENIED"){
                    cache.data.bearer = btoa(token);
                    cache.data.gmail = ((data["error"]["message"]).split(" ")[3]);
                    sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
                    document.getElementById("sender").innerHTML = ((data["error"]["message"]).split(" ")[3]);
                }
            }catch{
                    sessionStorage.setItem("bearer", btoa(token));
                    cache.data.bearer = btoa(token);
                    cache.data.gmail = data["emailAddress"];
                    sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
                    document.getElementById("sender").innerHTML = data["emailAddress"];
            }
        }).catch(error => {
            cache.data.bearer = btoa(token);
            sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
            alert("verification Failed!")
    });
  }

function putCredentials(email, payload){
  cache["data"]["email-credentials"][email] = payload;
  var condition_expression = "#useremail = :value1";
  var update_expression = "SET #useremailcredentials = :value2";
  var expression_attribute_names = {"#useremail": "email", "#useremailcredentials": "email-credentials"};
  var expression_attribute_values = {":value1": cache["data"]["email"],  ":value2": cache["data"]["email-credentials"]};
  let headers = new Headers();
  headers.append('Origin', '*');
  fetch("https://oyq9jvb6p9.execute-api.us-east-1.amazonaws.com/techmark-dynamodb", {
    mode: 'cors',
    headers: headers,
    "method": "POST",
    "body": JSON.stringify({
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
          sessionStorage.setItem("cache", btoa(JSON.stringify(cache)));
      }
  }).catch(error => {
      location = "auth-offline.html";
  });
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

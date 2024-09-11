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


for (let key in useremailcredentials) {
    if (useremailcredentials.hasOwnProperty(key)) {
      document.getElementById("sender-list").innerHTML += `<a class="dropdown-item" id="${key}" onclick="select_sender(this)" href="javascript:void(0);">${key}</a>`;
      document.getElementById("verifiedemailslist").innerHTML += 
            `<tr>
                <td scope="col">${useremailcredentials[key]["name"]}</td>
                <td scope="col">${key}</td>
                <td scope="col">${useremailcredentials[key]["alias-email"]}</td>
                <td scope="col">${useremailcredentials[key]["created"]}</td>
                <td scope="col">${useremailcredentials[key]["status"]}</td>
            </tr>`;
    }
  }

sessionStorage.setItem("contactlist", "")
function select_sender(obj){
    if(useremailcredentials[obj.id]["domain"] == "@gmail.com"){
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
`From: ${payload["from"]}
To: ${payload["fullname"]} <${payload["to"]}>
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
        replyto = document.getElementById("replytoemailbcc").value;
    }catch(error){
        replyto = "";
    }

    const payload = {
        "fullname": useremailcredentials[document.getElementById("sender").textContent]["name"],
        "from": document.getElementById("sender").textContent,
        "to": sessionStorage.getItem("contactlist").split(","),
        "cc": cc,
        "bcc": bcc,
        "replyto": replyto,
        "subject": document.getElementById("subject").value,
        "body_text": editor1.getPlainText(),
        "body_html": editor1.getHTMLCode()
    }

    let userResponse = confirm("Do you want to proceed?");
    if (userResponse) {
      if(payload["from"] == "Select Sender"){
        alert("Please select Sender");
      }else{
        if(sessionStorage.getItem("contactlist") == ""){
          alert("Please Select Recipients");
        }else{
          if((payload["from"].split("@"))[1] == "gmail.com"){
            payload["bearer"] = atob(sessionStorage.getItem("bearer"));
            payload["to"].forEach((gmail, index) => {
                const delay = 1850 * index;
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

function display_gmail_log(log, payload){
    console.log(log, payload)
}

function send_gmail(payload){
    console.log(payload.from)
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
           console.log(data)
           if(data["id"]){
               payload["sent"] = "True";
               payload["datetime"] = datetime();
               display_gmail_log(data, payload)
           }else{
               payload["sent"] = "False";
               payload["datetime"] = datetime();
               display_gmail_log(data, payload)
           }
       }).catch(error => {
            console.log(error)
            payload["sent"] = "Error";
            payload["datetime"] = datetime();
            display_gmail_log(error, payload)
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
    sessionStorage.setItem("contactlist", emails)
    document.getElementById("select-recipient").innerHTML = `${emails.length} Recipient Selected`;
}

function verifyEmail(){
    const email = document.getElementById("newemail").value;
    let domain = document.getElementById("domain").textContent;
    const newemaildata = {
        "name": document.getElementById("newemailname").value,
        "password": document.getElementById("newemailpassword").value,
        "alias-email": document.getElementById("newaliasemail").value,
        "domain": document.getElementById("domain").textContent,
        "created": datetime(),
        "status": "verified"
    }
    if(domain == "@gmail.com"){
        sessionStorage.setItem("newemailcredential", JSON.stringify(newemaildata))
        getCode(email);
    }else{
        alert("Enter Valid Gmail");
    }
}

function extractCodeFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('code');
  }

if((sessionStorage.getItem("gmail") != null) && (sessionStorage.getItem("gmail") != "null")){
    const clientId = '386167497194-ngpan3ub2v01mn4l0lv225gi83jth9mv.apps.googleusercontent.com';
    const redirectUri = 'https://techmark.solutions/add-campaign';
    const clientSecret = "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";
    const event = {
        "email": sessionStorage.getItem("gmail"),
        "clientId": clientId,
        "clientSecret": clientSecret,
        "redirect_uri": redirectUri
    }
    flow(event);
  }

function flow(event){
    const bearer = sessionStorage.getItem("bearer")
    if(bearer == "unverified"){
        const authorizationCode = extractCodeFromUrl();
        if (authorizationCode) {
            authenticate_code(authorizationCode, event);
        }
    }else{
        getProfile(atob(bearer), event)
    }
  }

function getCode(email){
    const event = {
        "clientId": '386167497194-ngpan3ub2v01mn4l0lv225gi83jth9mv.apps.googleusercontent.com',
        "redirect_uri": 'https://techmark.solutions/add-campaign'
    }
    if(email != ""){
        sessionStorage.setItem("gmail", email);
        sessionStorage.setItem("bearer", "unverified")
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
                alert("Please Login to " + event["email"]);
            }
            return response.json();
        }).then(data => {
            try{
                if(data["error"]["status"] == "PERMISSION_DENIED"){
                    sessionStorage.setItem("bearer", btoa(token));
                    sessionStorage.setItem("gmail", ((data["error"]["message"]).split(" ")[3]));
                    putCredentials()
                }
            }catch{
                    sessionStorage.setItem("bearer", btoa(token));
                    sessionStorage.setItem("gmail", data["emailAddress"]);
                    putCredentials()
            }
        }).catch(error => {
            console.log(error)
            sessionStorage.setItem("bearer", btoa(token))
            alert("verification Failed!")
    });
  }

function putCredentials(){
  var newemailcredential = JSON.parse(sessionStorage.getItem("newemailcredential"));
  useremailcredentials[sessionStorage.getItem("gmail")] = newemailcredential;
  var condition_expression = "#useremail = :value1";
  var update_expression = "SET #useremailcredentials = :value2";
  var expression_attribute_names = {"#useremail": "email", "#useremailcredentials": "email-credentials"};
  var expression_attribute_values = {":value1": useremail,  ":value2": useremailcredentials};
  let headers = new Headers();
  headers.append('Origin', '*');
  fetch("https://oyq9jvb6p9.execute-api.us-east-1.amazonaws.com/techmark-dynamodb", {
    mode: 'cors',
    headers: headers,
    "method": "POST",
    "body": JSON.stringify({
      "method": "update",
      "table_name": "techmark-solutions",
      "primary_key": {"email": useremail},
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
          document.getElementById("sender").innerHTML = sessionStorage.getItem("gmail");
      }
  }).catch(error => {
      location = "auth-offline.html";
  });
}


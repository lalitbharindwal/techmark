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

async function save_template(){
    await storage('techmark', 'get')
    document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" type="button"><i class="fs-17 bx bx-save"></i> Saving...</button>`;
    const text = editor1.getPlainText();
    const html = editor1.getHTMLCode();
    const templatename = document.getElementById("templatename").value;
    const templateid =  getid();
    const createdon = datetime();
    var condition_expression = "#useremail = :value1";
    var update_expression = "SET #emailtemplates.#templateid = :value2";
    var expression_attribute_names = {"#useremail": "email", "#emailtemplates": "email-templates" ,"#templateid": templateid};
    var expression_attribute_values = {":value1": cache.data.email, ":value2": {"template-name": templatename, "text-content": text, "html-content": html, "datetime": createdon}};
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
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
            //console.log(data)
        }else{
            document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" type="button"><i class="fs-17 bx bx-save"></i> Template Saved</button>`;
        }
    }).catch(error => {
        //console.log(error)
        location = "auth-offline.html";
    });

    cache.data["email-templates"][templateid] = {"template-name": templatename, "text-content": text, "html-content": html, "datetime": createdon};
    await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
    location = "templates.html";
}

var payload = [];
var count = 0;
const params = new URLSearchParams(window.location.search);
const id = params.get('id');

async function tabledata() {
    await storage("techmark", "get");
    if(id){
        editor1.setHTMLCode(cache.data["email-templates"][id]["html-content"]);
        document.getElementById("templatename").value = cache.data["email-templates"][id]["template-name"]
        document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" onclick="update_template()" type="button"><i class="fs-17 bx bx-save"></i> Update</button>`;
    }else{
        for (const key in cache.data["email-templates"]) {
            payload.push([++count, key, cache.data["email-templates"][key]["template-name"], cache.data["email-templates"][key]["datetime"], key]);
        }
        
        await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
        table(payload);
    }
}

async function templateedit() {
    await storage("techmark", "get");
    if(id){
        editor1.setHTMLCode(cache.data["email-templates"][id]["html-content"]);
        document.getElementById("templatename").value = cache.data["email-templates"][id]["template-name"]
        document.getElementById("add-campaign").href = `add-campaign.html?templateid=${id}`;
        document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" onclick="update_template()" type="button"><i class="fs-17 bx bx-save"></i> Update</button>`;
    }
}

async function table(payload){
    document.getElementById("templates") && new gridjs.Grid({
        columns: [{
            name: "Sr. No",
            width: "75px",
            formatter: function(e) {
                return gridjs.html('<span class="fw-semibold">' + e + "</span>")
            }
        }, {
            name: "Template ID",
            width: "140px",
            formatter: function(e) {
                return gridjs.html(`<a href="template-editor.html?id=${e}">` + e + "</a>")
            }
        }, {
            name: "Template Name",
            width: "170px"
        }, {
            name: "Created On",
            width: "190px"
        }, {
            name: "Actions",
            width: "150px",
            formatter: function(e) {
                return gridjs.html(`<a href='template-editor.html?id=${e}' class='text-reset text-decoration-underline'>View</a>`)
            }
        }],
        pagination: {
            limit: 10
        },
        sort: !0,
        search: !0,
        data: payload
    }).render(document.getElementById("templates"))
}

async function update_template(){
    document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" type="button"><i class="fs-17 bx bx-save"></i> Updating...</button>`;
    const text = editor1.getPlainText();
    const html = editor1.getHTMLCode();
    const templatename = document.getElementById("templatename").value;
    const templateid =  id;
    const createdon = datetime();
    var condition_expression = "#useremail = :value1";
    var update_expression = "SET #emailtemplates.#templateid = :value2";
    var expression_attribute_names = {"#useremail": "email", "#emailtemplates": "email-templates" ,"#templateid": templateid};
    var expression_attribute_values = {":value1": cache.data.email, ":value2": {"template-name": templatename, "text-content": text, "html-content": html, "datetime": createdon}};
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
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
            //console.log(data)
        }else{
            
            document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-light" type="button"><i class="fs-17 bx bx-save"></i> Template Updated</button>`;
        }
    }).catch(error => {
        //console.log(error)
        location = "auth-offline.html";
    });

    cache.data["email-templates"][templateid] = {"template-name": templatename, "text-content": text, "html-content": html, "datetime": createdon};
    await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
    location = "templates.html";
}

async function delete_template(){
    const templateid =  id;
    document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-danger" type="button">Deleting...</button>`;
    var condition_expression = "#useremail = :value1";
    var update_expression = "REMOVE #emailtemplates.#templateid";
    var expression_attribute_names = {"#useremail": "email", "#emailtemplates": "email-templates" ,"#templateid": templateid};
    var expression_attribute_values = {":value1": cache.data.email};
    let headers = new Headers();
    headers.append('Origin', '*');
    await fetch("https://vtipzz6d5e.execute-api.us-east-1.amazonaws.com/techmark-aws/", {
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
        console.log(data)
        if(JSON.parse(data["body"])["error"] == "true"){
            location = "auth-500.html";
            //console.log(data)
        }else{
            document.getElementById("editor-button").innerHTML = `<button class="fs-16 btn btn-danger" type="button"><i class="fs-17 bx bx-save"></i> Template Deleted</button>`;
        }
    }).catch(error => {
        //console.log(error)
        location = "auth-offline.html";
    });

    delete cache.data["email-templates"][templateid];
    await storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
}

document.getElementById("sa-params") && document.getElementById("sa-params").addEventListener("click", function() {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        confirmButtonClass: "btn btn-primary w-xs me-2 mt-2",
        cancelButtonClass: "btn btn-danger w-xs mt-2",
        buttonsStyling: false,
        showCloseButton: true
    }).then(function(result) {
        if (result.value) {
            delete_template();
            Swal.fire({
                title: "Deleted!",
                text: "Your Template has been deleted.",
                icon: "success",
                confirmButtonClass: "btn btn-primary w-xs mt-2",
                buttonsStyling: false
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            // User clicked "No, cancel!" or clicked outside the dialog
            Swal.fire({
                title: "Cancelled",
                text: "",
                icon: "error",
                confirmButtonClass: "btn btn-primary mt-2",
                buttonsStyling: false
            });
        }
    });
});
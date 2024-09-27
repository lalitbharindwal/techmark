function uploadoptions(obj){
    if(obj.id == "excel"){
        document.getElementById("uploadoptions").innerHTML =
        `<div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Upload Excel Sheet</h4>
                    </div><!-- end card header -->
            
                    <div class="card-body">
                        <div class="drop_box">
                            <header>
                                <h4>Select File here</h4>
                            </header>
                            <input type="file" hidden accept=".xlsx, .xls" id="fileID" style="display:none;">
                            <button class="btn btn-primary">Choose File</button>
                            <h6 id="filename"></h6>
                            <div id="previewArea" style="overflow: auto; max-height: 10cm"></div>
                        </div>
                    </div>
                    <!-- end card body -->
                </div>
                <!-- end card -->
            </div> <!-- end col -->
        </div>
        <!-- end row -->`;
        fileupload()
    }else if(obj.id == "csv"){
        document.getElementById("uploadoptions").innerHTML =
        `<div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Upload CSV</h4>
                    </div><!-- end card header -->
                    <div class="card-body">
                        

                        
                    </div>
                    <!-- end card body -->
                </div>
                <!-- end card -->
            </div> <!-- end col -->
        </div>
        <!-- end row -->`;
    }else if(obj.id == "type"){
        cache.data.campaignid.excelsheet = false;
        document.getElementById("uploadoptions").innerHTML =
        `<div class="row">
            <div class="col-lg-12">
                <div class="card" id="emailslist">
                    <div class="card-header">
                        <h4 class="card-title mb-0">Enter Emails</h4>
                    </div><!-- end card header -->
                    <div class="card-body">
                        <textarea style="width: 100%; height: 8cm;" id="emaillist" placeholder="Enter one email address per line"></textarea>
                    </div>
                </div>
            </div>
        </div>`;
        document.getElementById("card-btns").innerHTML = 
            `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" data-bs-dismiss="modal"><i class="ri-close-line me-1 align-middle"></i> Close</a>
            <button type="button" class="btn btn-primary" onclick="validateContactList()">Validate</button>`;
        editor_without_attributes()
}else if(obj.id == "contacts"){
    document.getElementById("uploadoptions").innerHTML =
    `<div class="row">
        <div class="col-lg-12">
            <div class="card">
                <div class="card-header">
                    <h4 class="card-title mb-0">Select a list</h4>
                </div><!-- end card header -->
                <div class="card-body">
                    <!-- Default dropdown -->
                    <div class="btn-group">
                        <button class="btn btn-light dropdown-toggle" type="button" id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false">Select a contact list</button>
                        <ul class="dropdown-menu" aria-labelledby="defaultDropdown" id="contactlist"></ul>
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    document.getElementById("card-btns").innerHTML = `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" data-bs-dismiss="modal"><i class="ri-close-line me-1 align-middle"></i> Close</a>`;
    getContactList();
    };
}


function fileupload(){
    const dropArea = document.querySelector(".drop_box"),
    button = dropArea.querySelector("button"),
    input = dropArea.querySelector("input");
    button.onclick = () => {
        input.click();
    };
    
    input.addEventListener("change", function (e) {
        var fileName = e.target.files[0].name;
        document.getElementById("filename").innerHTML = fileName;
        var file = e.target.files[0]; // Get the uploaded file
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                var data = new Uint8Array(e.target.result);
                var workbook = XLSX.read(data, { type: 'array' });
                // Assuming only one sheet exists, you can also iterate over all sheets
                var sheetName = workbook.SheetNames[0];
                var sheet = workbook.Sheets[sheetName];
                // Find column index for 'Emails' header dynamically
                var emailsColumnIndex = findColumnIndex(sheet, 'Emails');

                if (emailsColumnIndex === -1) {
                    input.value = null; // Clear the file input
                    document.getElementById("filename").innerHTML = "No File Selected";
                    previewArea.innerHTML = '<p>Error: Sheet must contain a column header "Emails"</p>';
                    return;
                }

                // Count rows in the sheet
                var rowCount = sheet['!ref'].match(/[0-9]+/g)[1];
                if (parseInt(rowCount) > 300) {
                    input.value = null; // Clear the file input
                    document.getElementById("filename").innerHTML = "No File Selected";
                    previewArea.innerHTML = "Error: Sheet must not exceed 300 Emails.";
                    return;
                }
                // Convert sheet to JSON array
                var jsonData = XLSX.utils.sheet_to_json(sheet, { raw: true });
                cache.data.campaignid.excelsheet = jsonData;
                displayPreview();
            };
            reader.readAsArrayBuffer(file);
        }
    });
}

function displayPreview() {
    // Clear previous preview if any
    previewArea.innerHTML = '';

    if (cache.data.campaignid.excelsheet.length > 0) {
        // Generate HTML for table
        var tableHtml = '<table><thead style="background-color:#0ab39c;color:white;"><tr><th>#</th>';
        Object.keys(cache.data.campaignid.excelsheet[0]).forEach(function(key) {
            tableHtml += '<th>' + key + '</th>';
            attributes.push(key)
        });
        tableHtml += '</tr></thead><tbody>';

        // Generate HTML for table rows
        cache.data.campaignid.excelsheet.forEach(function(row, index) {
            // Check if row contains 'Emails' field
            if ('Emails' in row) {
                tableHtml += '<tr>';
                tableHtml += '<td>' + (index + 1) + '</td>'; // Display row number
                Object.values(row).forEach(function(value) {
                    var displayValue = value === null || value === '' ? 'Null' : value;
                    tableHtml += '<td>' + displayValue + '</td>';
                });
                tableHtml += '</tr>';
            }else{
                tableHtml += '<tr style="background-color:#ffc0aa;">';
                tableHtml += '<td>' + (index + 1) + '</td>'; // Display row number
                Object.values(row).forEach(function(value) {
                    var displayValue = value === null || value === '' ? 'Null' : value;
                    tableHtml += '<td>' + displayValue + '</td>';
                });
                tableHtml += '</tr>';
            }
        });

        tableHtml += '</tbody></table>';

        editor_with_attributes()
        // Append table HTML to previewArea
        previewArea.innerHTML = tableHtml;
        document.getElementById("card-btns").innerHTML = 
            `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" data-bs-dismiss="modal"><i class="ri-close-line me-1 align-middle"></i> Close</a>
            <button type="button" class="btn btn-primary" onclick="validateExcelsheet()">Validate</button>`;
    } else {
        previewArea.innerHTML = '<p>No data found</p>';
    }
}

function findColumnIndex(sheet, columnHeader) {
    var range = XLSX.utils.decode_range(sheet['!ref']);
    for (var C = range.s.c; C <= range.e.c; ++C) {
        var cell = sheet[XLSX.utils.encode_cell({ r: 0, c: C })];
        if (cell && cell.t === 's' && cell.v === columnHeader) {
            return C;
        }
    }
    return -1; // Column header not found
}

function editor_with_attributes(){
    var content = editor1.getHTMLCode();
    editorcfg.toolbarfactory_myselect = function (cmd, suffix) {
        var sel = document.createElement("select");
        sel.style.cssText = "height:28px;width:88px;margin:2px;padding:0px 2px;border:hidden";
        function addOption(text, value) {
            var option = document.createElement("option");
            option.innerText = text;
            option.setAttribute("value", value);
            option.rawValue = value;
            sel.appendChild(option);
        }
        addOption("Attributes")
        attributes.forEach(function(element) {
            addOption(element, element)
        });
        
        sel.onclick = function (e) {
            //the select will get focus , editor will lost focus
            e.stopPropagation();//prevent editor get focus automatically
        }
        sel.onchange = function () {
            var option = sel.options[sel.selectedIndex];
            var val = option.rawValue;
            sel.selectedIndex = 0;
            editor1.insertHTML(`{{${val}}}`)
        }
        return sel;
    }
    editorcfg.svgCode_menu_mymenu1 = '<svg viewBox="-2 -2 20 20" fill="#5F6368"><path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zm-12-1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2h-12z" clip-rule="evenodd"/><path fill="#666666" d="M10.648 7.646a.5.5 0 01.577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z"/><path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/></svg>';
    editorcfg.toolbar = "mytoolbar";
    RTE_DefaultConfig.text_mymenu1 = "Insert Image";
    editorcfg.toolbar_mytoolbar = "{bold,italic,underline,forecolor,backcolor}|{justifyleft,justifycenter,justifyright,justifyfull}|{insertorderedlist,insertunorderedlist,indent,outdent,insertblockquote,insertemoji}" + " #{paragraphs:toggle,fontname:toggle,fontsize:toggle,inlinestyle,lineheight,selectall,toggleborder}" + " / {removeformat,cut,copy,paste,delete,find}|{insertlink,insertchars,inserttable,inserttemplate,insertcode,menu_mymenu1}|{preview,code}" + "#{fullscreenenter,fullscreenexit,undo,redo,myselect,togglemore}";
    editorcfg.subtoolbar_mymenu1 = 'insertimage,insertgallery';
    editor1 = RichTextEditor("#div_editor1", editorcfg, { skin: "grey", toolbar: "default" });
    editor1.setHTMLCode(content);
}

function editor_without_attributes(){
    var content = editor1.getHTMLCode();
    editorcfg.svgCode_menu_mymenu1 = '<svg viewBox="-2 -2 20 20" fill="#5F6368"><path fill-rule="evenodd" d="M14.002 2h-12a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1V3a1 1 0 00-1-1zm-12-1a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V3a2 2 0 00-2-2h-12z" clip-rule="evenodd"/><path fill="#666666" d="M10.648 7.646a.5.5 0 01.577-.093L15.002 9.5V14h-14v-2l2.646-2.354a.5.5 0 01.63-.062l2.66 1.773 3.71-3.71z"/><path fill-rule="evenodd" d="M4.502 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"/></svg>';
    editorcfg.toolbar = "mytoolbar";
    RTE_DefaultConfig.text_mymenu1 = "Insert Image";
    editorcfg.toolbar_mytoolbar = "{bold,italic,underline,forecolor,backcolor}|{justifyleft,justifycenter,justifyright,justifyfull}|{insertorderedlist,insertunorderedlist,indent,outdent,insertblockquote,insertemoji}" + " #{paragraphs:toggle,fontname:toggle,fontsize:toggle,inlinestyle,lineheight,selectall,toggleborder}" + " / {removeformat,cut,copy,paste,delete,find}|{insertlink,insertchars,inserttable,inserttemplate,insertcode,menu_mymenu1}|{preview,code}" + "#{fullscreenenter,fullscreenexit,undo,redo,togglemore}";
    editorcfg.subtoolbar_mymenu1 = 'insertimage,insertgallery';
    editor1 = RichTextEditor("#div_editor1", editorcfg, { skin: "grey", toolbar: "default" });
    editor1.setHTMLCode(content);
}

function validateExcelsheet(){
    // Generate HTML for table rows
    cache.data.campaignid.recipients = ``;
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    cache.data.campaignid.excelsheet.forEach(function(row, index) {
        // Check if row contains 'Emails' field
        if ('Emails' in row) {
            cache.data.campaignid.recipients+=` ${row["Emails"]}`;
        }
    });
    cache.data.campaignid.recipients = [...new Set(cache.data.campaignid.recipients.match(emailRegex))]
    var emailsHTML = '';
    cache.data.campaignid.recipients.forEach((email, index) => {
        emailsHTML += `<tr>
            <td>${index + 1}</td>
            <td>${email.trim()}</td>
        </tr>`;
    });

    // Update the HTML content using innerHTML only once
    document.getElementById("previewArea").innerHTML =
        `<div class="card-body">
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
        `<a href="javascript:void(0);" class="btn btn-link link-success fw-medium" onclick="displayPreview()">
            <i class="ri-edit-box-line me-1 align-middle"></i> Excelsheet
        </a>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" onclick="saveExcelContacts()">Select</button>`;
    
}

function saveExcelContacts(){
    cache.data.campaignid.recipients = ``;
    var emailRegex = /\b[A-Za-z0-9._]+@(?:[A-Za-z0-9-]+\.)+(?:com|org|in|in.net|net.in|net|co|co.in|uk|group|digital|io|ai|live|studio|au|ventures|is)\b/g;
    cache.data.campaignid.excelsheet.forEach(function(row, index) {
        // Check if row contains 'Emails' field
        if ('Emails' in row) {
            cache.data.campaignid.recipients+=` ${row["Emails"]}`;
        }
    });
    cache.data.campaignid.recipients = [...new Set(cache.data.campaignid.recipients.match(emailRegex))]
    document.getElementById("select-recipient").innerHTML = `${cache.data.campaignid.recipients.length} Recipient Selected`;
    storage({"techmark": "techmark", "cache": customBase64Encode(JSON.stringify(cache))}, "update");
}
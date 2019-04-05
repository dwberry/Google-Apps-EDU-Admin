/**
Lists Chrome Device Serial Number, OS Version, OrgUnit, Last Synced User, and Last Sync Date to Sheet.
**/
function listCrOS() {
    var customerId = 'my_customer'; // Change to your customer number or use 'my_customer' for domain your account belongs
    var spreadsheetURL = 'https://docs.google.com/spreadsheets/d/1NkaE7YVwcGZ3d8dbOLUNTeRFcdeCSN21a2y8csN9Ry0/edit#gid=0'; //URL of your Google Sheet
    var sheetName = 'CrOSRecent'; // Name of the sheet in your Google Sheet
    var deviceArray = [['Org Unit','Serial Number','OS Version','Most Recent User','Last Sync','Status']]; 
    var pageToken, page;
    do {
        var response = AdminDirectory.Chromeosdevices.list(customerId, { pageToken: pageToken });
        var devices = response.chromeosdevices;
        if (devices && devices.length > 0) {
            for (i = 0; i < devices.length; i++) {
                var device = devices[i];
                if (device.recentUsers !== undefined) {
                    deviceArray.push([device.orgUnitPath, device.serialNumber, device.osVersion, device.recentUsers[0].email, new Date(device.lastSync),device.status]);
                }
            }
        }
        pageToken = response.nextPageToken;
    }
    while (pageToken);
    
    addData2SS(spreadsheetURL ,sheetName , deviceArray);
}

function addData2SS(ssURL, sheetName, data){  
    //Add Data to Spreadsheet
    var ss = SpreadsheetApp.openByUrl(ssURL);
    var numRowCol = ss.getDataRange().getValues(); // gets data from Sheet
    ss.getSheetByName(sheetName).getRange(1, 1, numRowCol.length, numRowCol[0].length).clear(); // deletes data from Sheet
    ss.getSheetByName(sheetName).getRange(1, 1, data.length, data[0].length).setValues(data); // sets new data from array
}

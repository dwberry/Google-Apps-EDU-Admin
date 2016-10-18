function listAllEmployeeGroups() {
  var values = []; 
  var member = [];
  var pageToken, page;
  //Get Groups
  do {
    page = AdminDirectory.Groups.list({
      domain: 'domain-name', // Change Domain to get groups from .org accounts
      maxResults: 200,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var groupId = groups[i].id;
        if (groups[i].directMembersCount < 500) member = getMembers(group.email); //if there are more than 500 member this is skipped, they will not fit into a single cell.
        var mem = member.join(", ");
        member =[];
        values.push([groups[i].name, groups[i].email, groups[i].directMembersCount, groupId, groups[i].description, mem]);
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
   //Add Group Array to Spreadsheet
   var spreadsheetUrl = 'https://docs.google.com/a/kcsdschools.org/spreadsheets/d/1RoO5Q/edit#gid=0'; //Your SS URL
   var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
   var numRowCol = ss.getDataRange().getValues();
   ss.getSheets()[0].getRange(3, 1, numRowCol.length, numRowCol[0].length).clear();
   ss.getSheets()[0].getRange(3, 1, values.length, values[0].length).setValues(values).sort(1);
}

function listEmployeeStaffEmailGroups() { //Time Triggered once a week to populate SS for automating other systems
  var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/1Yujms/edit#gid=0'; //Your SS URL
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var numRowCol = ss.getDataRange().getValues();
  var sheet = ss.getSheetByName("SchoolStaffGroups");
  var groups = ["atstaff@schools.net",// Do not change the order of this list unless CO and Form Ranger are updated https://docs.google.com/a/kcsdschools.org/forms/d/1SSF0M/edit
                "bstaff@schools.net",
                "cstaff@schools.net",
                "dstaff@schools.net",
                "estaff@schools.net",
                "wstaff@schools.net"];
  sheet.getRange(1, 1, numRowCol.length, numRowCol[0].length).clear();
  for (var i = 0; i < groups.length; i++) {
    var member = getAllMembers(groups[i]); 
    sheet.getRange(1, i+1).setValue(groups[i]).setFontWeight("bold");
    for (var j = 0; j < member.length; j++) {
      sheet.getRange(j+2, i+1).setValue(member[j]);
    }
    sheet.autoResizeColumn(i+1).setFrozenRows(1);
  }
    
}
  
  
  
  
  
function listAllEmployeeStaffGroupsinProgress() { ///In Progress
  var values = [];
  var member = []; 
  var groupAndMem = [];
  var pageToken, page;
  //Get Groups
  do {
    page = AdminDirectory.Groups.list({
      domain: 'Your-domain-name', // Change Domain to get groups from .org accounts
      maxResults: 4,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        if (groups[i].directMembersCount < 500) member = getMembers(groups[i].email); //if there are more than 500 member this is skipped, they will not fit into a single cell.
        groupAndMem.push(groups[i].email);
            for (var j = 0; j < member.length; j++) {
            groupAndMem.push(member[j]);
            //groupNames.push(groups[i].email, member);
            }
      values.push(groupAndMem);
      //groupAndMem=[];
      }
    } else {
      Logger.log('No groups found.');
    }
    //pageToken = page.nextPageToken;
  } while (pageToken);
   //Add Group Array to Spreadsheet
   var spreadsheetUrl = 'https://docs.google.com/a/kcsdschools.org/spreadsheets/d/1RoH5Q/edit#gid=0'; //Your SS URL
   var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
   var numRowCol = ss.getSheets()[5].getDataRange().getValues();
   ss.getSheets()[5].getRange(1, 1, numRowCol.length, numRowCol[0].length).clear();
   ss.getSheets()[5].getRange(1, 1, groupAndMem.length, groupAndMem[0].length).setValues(groupAndMem);

   //ss.getSheets()[5].getRange(1, 1, values.length, values[0].length).setValues(values);
}
   
function listGroupMembers(email) {
     var group = GroupsApp.getGroupByEmail(email);
     var s = group.getEmail() + ': ';
     var users = group.getUsers();
     for (var i = 0; i < users.length; i++) {
       var user = users[i];
       s = s + user.getEmail() + ", ";
     }
     Logger.log(s);
  return s;
   }

function transposeArray(array){
        var result = [];
        for(var row = 0; row < array.length; row++){ // Loop over rows
          for(var col = 0; col < array[row].length; col++){ // Loop over columns
            result[row][col] = array[col][row]; // Rotate
          }
        }
        return result;
    }



function listAllStudentGroups() {
  var values = []; 
  var member = [];
  var ownersArray = [];
  var pageToken, page;
  //Get Groups
  do {
    page = AdminDirectory.Groups.list({
      domain: 'schools.org', 
      maxResults: 30,
      pageToken: pageToken
    });
    var groups = page.groups;
    if (groups) {
      for (var i = 0; i < groups.length; i++) {
        var group = groups[i];
        var groupId = groups[i].id;
        if (groups[i].directMembersCount < 500) member = getMembers(group.email); //if there are more than 500 member this is skipped, they will not fit into a single cell.
        var mem = member.join(", ");
        //member =[];
        ownersArray = getGroupOwners(group.email);
        var owners = ownersArray.join(", ");
        //ownersArray = [];
        values.push([groups[i].name, groups[i].email, groups[i].directMembersCount, groupId, groups[i].description, mem, owners]);
      }
    } else {
      Logger.log('No groups found.');
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
   //Add Group Array to Spreadsheet
   var spreadsheetUrl = 'https://docs.google.com/a/kcsdschools.org/spreadsheets/d/1REH5Q/edit#gid=0'; //Your SS URL
   var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
   var numRowCol = ss.getDataRange().getValues();
   ss.getSheets()[2].getRange(3, 1, numRowCol.length, numRowCol[0].length).clear();
   ss.getSheets()[2].getRange(3, 1, values.length, values[0].length).setValues(values);
}



function updateOUtoGroups() {
  var spreadsheetUrl = 'https://docs.google.com/a/kcsdschools.org/spreadsheets/d/1RobEH5Q/edit#gid=0'; //Your SS URL 
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = ss.getSheets()[3];
  var numRowCol = sheet.getDataRange().getValues();
  var cell, startRow = 1,lastRow;
  var out,status;
  var updateValues = [];
  var report2, report = ["Status Report:"], updateValues;
  var now = new Date();
  ss.getSheets()[3].getRange(1, 1, numRowCol.length, 2);
  lastRow = numRowCol.length-1;
  //If the process completes for all rows the Report is moved and the Queue reset  
  if (numRowCol[lastRow][3] == "Done"){
     updateValues = sheet.getRange(1, 5, numRowCol.length, 1).getValues(); 
     sheet.getRange(1, 6, numRowCol.length, 1).setValues(updateValues); 
     sheet.getRange(1, 3, numRowCol.length, 3).clear(); 
     }
  // Get Status of processed list 
  status = numRowCol[0][3];
  while (status == "Done"){
     startRow++;
     status = numRowCol[(startRow-1)][3];  
   } 
   for (var i = (startRow-1); i < (startRow+1); i++) { 
     var OUMembers = getMembersofOU(numRowCol[i][0]);
     for (var j=0; j < OUMembers.length; j++) {
       out = addGroupMember(OUMembers[j], numRowCol[i][1]);
       if (out) report.push(out);
       out='';  
Logger.log("Added %s to %s", OUMembers[j], numRowCol[i][1]);
       report2 = (j+1)+" of "+OUMembers.length;
       cell = sheet.getRange((i+1), 3);
       cell.setValue(report2);
     }
     cell = sheet.getRange((i+1), 4);
     now = new Date(); 
     cell.setValue("Done");
     cell = sheet.getRange((i+1), 5);
     cell.setValue("Updated: " + now);
     report = [];    
    }         
}




function moveCLCstudents(){ //Time triggered to put CLC Students in the CLC OU 
  var clcMembers = getMembers('stu@schools.org');
  var org = {orgUnitPath: '/Students'};
  var student = "your-domain-name";
  //Check that no faculty are in array
  for (var j=0; j < clcMembers.length; j++){
    if (clcMembers[j].match(student)) AdminDirectory.Users.update(org, clcMembers[j]);
  }  
}
function clc2SS(){
  var clcMembers = getMembers('students@schools.org');
  var values =[];
  var organization =[];
  var orgArray = [];
        //Convert Google ArrayObject to Array
        for (var i = 0; i < clcMembers.length; i++) {
          var user = AdminDirectory.Users.get(clcMembers[i]);
          organization = user.organizations;
          for (var x in organization){
            orgArray = organization[x]
          }
        var Department = orgArray["department"];
        var Location = orgArray["location"];
        if (user.externalIds) {
          stuID = user.externalIds[0].value;      
        } else stuID = 0

        values.push([user.name.givenName, 
                user.name.familyName,
                user.name.fullName,
                user.primaryEmail, 
                Department, 
                Location,
                user.orgUnitPath, 
                user.externalIds[0].value]);
        }

   //Add Group Array to Spreadsheet
   var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/14FHo8/edit#gid=1770763404'; //Your SS URL
   var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
   var numRowCol = ss.getDataRange().getValues();
   ss.getSheetByName('clcImport').getRange(2, 1, numRowCol.length, numRowCol[0].length).clear();
   ss.getSheetByName('clcImport').getRange(2, 1, values.length, values[0].length).setValues(values);
}




function getGroupOwners(groupEmail){
//  var groupEmail = 'student@schools.org';
  //Get members of group
  var membersPageToken, membersPage;
  var member =[];
  do {
    membersPage = AdminDirectory.Members.list(groupEmail, {
      maxResults: 200,
      pageToken: membersPageToken,
      roles: 'OWNER'
      });
    var members = membersPage.members;
    if (members) {
      //Iterate group members
      for (var j in members) {
        member.push(members[j].email);
      }
    } 
    membersPageToken = membersPage.nextPageToken;  
  } while (membersPageToken);
  Logger.log(member);
  Logger.log(members);
  return member;
}


function getMembersofOU(OU) {
  //Get members of group
  var OUPageToken, OUPage;
  var member =[];
  var text = 'orgUnitPath='
  var orgUnit =text.concat(OU);
  do {
    OUPage = AdminDirectory.Users.list({
      domain: 'schools.org',
      maxResults: 500,
      pageToken: OUPageToken,
      query: orgUnit
      });
    var members = OUPage.users;
    if (members) {
      //Iterate group members
      for (var j in members) {
        member.push(members[j].primaryEmail);
      }
    } 
    OUPageToken = OUPage.nextPageToken;  
  } while (OUPageToken);
  return member;
}


function addGroupMember(userEmail, groupEmail) {
  var text;
  var member = {
    email: userEmail,
    role: 'MEMBER'
  };
  try {
  AdminDirectory.Members.insert(member, groupEmail);
  text = "Added " +userEmail;
  return text;
  }
  catch (err){
          err = userEmail + " is already a member. ";
    return err;
    }
}


function getMembers(groupEmail) {
  //var groupEmail = 'administration@schools.net';
  //Get members of group
  var membersPageToken, membersPage;
  var member =[];
  do {
    membersPage = AdminDirectory.Members.list(groupEmail, {
      maxResults: 200,
      pageToken: membersPageToken,
      roles: 'MEMBER'
      });
    var members = membersPage.members;
    if (members) {
      //Iterate group members
      for (var j in members) {
        member.push(members[j].email);
      }
    } 
    membersPageToken = membersPage.nextPageToken;  
  } while (membersPageToken);
  return member;
}

function getAllMembers(groupEmail) {
  //var groupEmail = 'administration@schools.net';
  //Get members of group
  var membersPageToken, membersPage;
  var member =[];
  do {
    membersPage = AdminDirectory.Members.list(groupEmail, {
      maxResults: 200,
      pageToken: membersPageToken
//      roles: 'MEMBER'
      });
    var members = membersPage.members;
    if (members) {
      //Iterate group members
      for (var j in members) {
        member.push(members[j].email);
      }
    } 
    membersPageToken = membersPage.nextPageToken;  
  } while (membersPageToken);
  return member;
}


function updateEmployeesGroup() {
  var report, memReport, memOutput =[], ownerReport, ownerOutput =[];
  var now = new Date();
  var employees = getAllEmployees();
  var owners = ['aers@schools.net',
                'webmaster@schools.net'];
  memOutput.push('Employees added:\n');

  ownerOutput.push('Owners added:\n');
  //--Add owners, Error from try will return any owners that were added
  for (var j in owners) {
     ownerReport = addGroupOwner(owners[j],'employees@schools.net');
     if (ownerReport) ownerOutput.push(ownerReport+'\n');
     ownerReport=''; 
  }  
  GmailApp.sendEmail('api@schools.org', 'KCSD Employee Group Update ' + now, 'KCSD Employee Group Update Report.\n\n'+memOutput+'\n\n'+ownerOutput);
  Logger.log(memOutput);
  Logger.log(ownerOutput);
}  

function sendEmail(email, subject, body){
    GmailApp.sendEmail(email.toString(), subject.toString(), body.toString());
}

function addGroupOwner(userEmail, groupEmail) {
  var text;
  var member = {
    email: userEmail,
    role: 'OWNER'
  };

  try {
    AdminDirectory.Members.insert(member, groupEmail);
    text = "Added " +userEmail+ " to "+groupEmail;
    Logger.log(text);
    return text;
  }
  catch (err){
//    AdminDirectory.Members.update(member, groupEmail, member);
    Logger.log(err);
    err = err + " " + userEmail + " is already an owner or mmber of "+groupEmail;
    return err;
    }    
}

function addOwners2GroupsfromSS(){
  var spreadsheetUrl = 'https://docs.google.com/a/kcsdschools.org/spreadsheets/d/1RH5Q/edit#gid=0'; //Your SS URL
  var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
  var sheet = ss.getSheets()[4];
  var ownerArray = sheet.getDataRange().getValues();
  var log = [],status;
  var numofGroups =ownerArray.length;
  for (var j=0; j < numofGroups; j++) {
    for (var o=1; o < 50; o++) {
      if (ownerArray[j][o]){
        status = addGroupOwner(ownerArray[j][o],ownerArray[j][0]);
        Logger.log(status);
        if (status) log.push(status);
          //status='';
      }
    }
  }
  Logger.log(log);
}

function areYouaMember(email, group){
  try {
    AdminDirectory.Members.get(group, email);
    var mem = true;
  return mem;
  }
  catch (err){
    return false;
    }
  
}

function getAllEmployees(){
  var page,pageToken; 
  var employees = [];
  do {
    page = AdminDirectory.Users.list({
      domain: 'schools.net',
      maxResults: 500,
      pageToken: pageToken,
      query: 'orgUnitPath=/schools.net'
    });
    var users = page.users;
    if (users) {
        for (var i = 0; i < users.length; i++) {
          employees.push([users[i].primaryEmail]);
        }
    }
    pageToken = page.nextPageToken;
  } while (pageToken);
  return employees;
}

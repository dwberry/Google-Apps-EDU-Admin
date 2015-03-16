function printAllActiveStudents2Spreadsheet() {
  var values =[];
  var organization =[];
  var orgArray = [];
  var pageToken,page,stuID,photoURL;
  //Get users from Google Apps
  do {
    page = AdminDirectory.Users.list({
      domain: 'yourgoogleappsdomain.com',// Add your domain as a string
      maxResults: 500,
      pageToken: pageToken,
      query: 'orgUnitPath=/Students' //You GAPS student OU path
    });
    var users = page.users;
    if (users) {
        //Convert Google ArrayObject to Array
        for (var i = 0; i < users.length; i++) {
          organization = users[i].organizations;
          for (var x in organization){
            orgArray = organization[x]
          }
        var Department = orgArray["department"];
        var Location = orgArray["location"];
        if (users[i].externalIds) { //For use with any external IDs in your GAfE
          stuID = users[i].externalIds[0].value;      
        } else stuID = 0
        if (users[i].thumbnailPhotoUrl) {
          photoURL = users[i].thumbnailPhotoUrl;     //Still working on this if anyone has any ideas 
        } else photoURL = 'https://www.googleapis.com/admin/directory/v1/users/' + users[i].primaryEmail + '/photos/thumbnail' 
        //var photos = 'https://www.googleapis.com/admin/directory/v1/users/' + users[i].primaryEmail + '/photos/thumbnail';
        //Add page of users to Values Array
        values.push([users[i].name.givenName, 
                users[i].name.familyName,
                users[i].primaryEmail, 
                Department, 
                Location, 
                users[i].orgUnitPath, 
                stuID,
                photoURL]);
        }
      }
    pageToken = page.nextPageToken;
  } while (pageToken);
 
 // Data to SpeadSheet
   var spreadsheetUrl = 'https://docs.google.com/a/....'; //Add URL of SS as a string
   var ss = SpreadsheetApp.openByUrl(spreadsheetUrl);
   var numRowCol = ss.getDataRange().getValues();
   ss.getSheets()[0].getRange(3, 1, numRowCol.length, numRowCol[0].length).clear(); //clears all values
   ss.getSheets()[0].getRange(3, 1, values.length, values[0].length).setValues(values).sort(2); // Outputs new values starting on row 3
   
   // You can use the first two rows for AwesomeTables on a restricted google site

}

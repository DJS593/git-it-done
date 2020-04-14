var issueContainerEl = document.querySelector("#issues-container");

var limitWarningEl = document.querySelector("#limit-warning");

var repoNameEl = document.querySelector("#repo-name");



var getRepoName = function() {
  // locating the query from the url
  var queryString = document.location.search;
  
  // once you have the query, need to find the part you need:  example is ?repo=microsoft/activities, so we split on the "=" and use an index of [1] since it is the second part we need
  var repoName = queryString.split("=")[1];
  
  // passing repoName variable inot getRepoName() function, which will use the repoName to fetch the related issues from the GitHub API issues endpoint
  
  getRepoIssues(repoName);
  repoNameEl.textContent = repoName;

  


};



var getRepoIssues = function(repo) {
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";
  
  fetch(apiUrl).then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        // pass response data to dom function
        displayIssues(data);
        // check if api has paginated issues
        if (response.headers.get("Link")) {
          displayWarning(repo);
        }
      });
    } else {
      alert("There was a problem with yoru requst!");
    }

    
  });

};

var displayIssues = function(issues) {

  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  for (var i =0; i < issues.length; i++) {
    // create a link element to take users ot the issue on Github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    // issue objects have an html_url property, which links to the full issue on Github
    issueEl.setAttribute("href", issues[i].html_url);
    // "_blank" opens in new tab
    issueEl.setAttribute("target", "_blank");
  
    issueContainerEl.appendChild(issueEl);
  
 
    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;

    // append to container
    issueEl.appendChild(titleEl);

    // create a type of element
    var typeEl = document.createElement("span");

    // check if issue is an actual iss or a pull request
    if (issues[i].pull_request) {
    typeEl.textContent = "(Pull request)";
    } else {
    typeEl.textContent = "(Issue)"
    }

    // append to container
    issueEl.appendChild(typeEl);
  }
};

var displayWarning = function(repo) {
  // add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on Github.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");

  // append to warning container
  limitWarningEl.appendChild(linkEl);
};

//getRepoIssues("facebook/react");
getRepoName();
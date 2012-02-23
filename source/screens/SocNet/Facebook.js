enyo.kind({
    name: "bj.Facebook",
    kind: "Control",
    // Client ID is the Facebook App Id, Redirect URI will be detected with the access token, Touch friendly UI is used
    // Scope is the permissions list -- http://developers.facebook.com/docs/reference/api/permissions/
    accessTokenURL: "https://www.facebook.com/dialog/oauth?client_id=__APP_ID__&redirect_uri=__REDIRECT_URI__&response_type=token&display=touch&scope=offline_access,publish_stream",
    getUserURL: "https://graph.facebook.com/me?",
    postToWallURL: "https://graph.facebook.com/me/feed?",
    postToAnotherUsersWallURL: "https://graph.facebook.com/__USERID__/feed?",
    components: [
        { name: "fbService", kind: "WebService", onSuccess: "fbServicesuccess", onFailure: "fbServiceFailure", components: [
            { method: "GET", handleAs: "json", contentType: "application/x-www-form-urlencoded" }
        ] },
        { name: "LoginPopup", kind: "Popup", scrim: false, modal: true, width: "94%", height: "94%",
            layoutKind: "VFlexLayout", pack: "center", align: "center", components: [
                { name:"DetailContent", kind: "WebView", url: "", layoutKind: "VFlexLayout", flex: 1,
                  style: "margin-bottom: 25px; background: red;", minFontSize: 10, onPageTitleChanged: "handlePageTitleChanged" }
        ] }
    ],
    create: function() {
        this.inherited(arguments);
        this.redirectUrl = "https://www.facebook.com/connect/login_success.html";
        var url = this.accessTokenURL.replace("__APP_ID__", enyo.application.appSettings['FBAppID']);
        url = url.replace("__REDIRECT_URI__", encodeURIComponent(this.redirectUrl));
        this.cookieName = "FacebookTokens";
        this.access = {
            AppID: enyo.application.appSettings['FBAppID'] ,
            APIKey: enyo.application.appSettings['FBAppID'] ,
            SharedSecret: enyo.application.appSettings['FBAppSecret'],
            url: url
        };
        this.accessor = {};
    },
    fbServicesuccess: function(inSender, inResponse, inRequest) {
        logThis(this, inResponse);
        logThis(this, token);
        enyo.setCookie(this.cookieName, enyo.json.stringify(this.accessor));
    },
    fbServicePostSuccess: function(inSender, inResponse, inRequest) {
        logThis(this, inResponse);
    },
    fbServiceFailure: function(inSender, inResponse, inRequest) {
        logThis(this, inResponse);
        logThis(this, inRequest);
        logThis(this, inRequest.xhr.status);
    },
    loginToFacebook: function(username, password) {
        this.$.LoginPopup.openAtCenter();
        this.$.DetailContent.setUrl(this.access.url);
    },
    postToFacebook: function(message) {
        //For all the available params check, http://developers.facebook.com/docs/reference/api/status/
        var cookieContents = enyo.getCookie(this.cookieName);
        this.accessor = enyo.json.parse(cookieContents);
        //var url = this.postToAnotherUsersWallURL.replace("__USERID__", this.accessor.userID);
        var url = this.postToWallURL + "access_token=" + this.accessor.accessToken;
        this.access = {
            url: url
        };
        this.par = {};
        this.par = { message: message };
        this.$.fbService.setUrl(this.access.url + "&message=" + encodeURIComponent(this.par.message)); // Duplicate messages are not allowed
        this.$.fbService.setMethod("POST");
        this.$.fbService.call({},{onSuccess: "fbServicePostSuccess"});
    },
    handlePageTitleChanged: function(inSender, inTitle, inUrl, inCanGoBack, inCanGoForward) {     
        this.lastTitle = inUrl;
        var decoded = decodeURI(inUrl);
        decoded = decodeURIComponent(inUrl);
        decoded = decoded.replace(/&amp;/g, '&');
        if (decoded.indexOf(this.redirectUrl) > -1) {
            var params = {};
            if (decoded.indexOf('#') > -1)
                decoded = decoded.split("#")[1];
            var queryParamsArray = decoded.split("&");
            for (var i = 0; i < queryParamsArray.length; i++) {
                var paramItem = queryParamsArray[i].split("=");
                params[paramItem[0]] = paramItem[1];
            }            
            if (params["access_token"]) {
                this.accessor.accessToken = params["access_token"];
                logThis(this, this.accessor);
                enyo.setCookie(this.cookieName, enyo.json.stringify(this.accessor));
                this.$.LoginPopup.close();
            }
        }
    }
});
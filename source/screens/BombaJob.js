enyo.kind({
    name : "bj.BombaJob",
    kind : enyo.VFlexBox,
    components : [ {
        name : "pane",
        kind : "Pane",
        flex : 1,
        components : [
            { name : "loading", className : "bgpattern", kind : "bj.Loading", onBack : "goBackLoading" },
            { name : "newestOffers", className : "bgpattern", kind : "bj.NewestOffers", onSelect : "viewOffer" },
            { name : "categories", className : "bgpattern", kind : "bj.Categories", onCategorySelect : "viewCategory", onOfferSelect : "viewOffer" },
            { name : "jobs", className : "bgpattern", kind : "bj.Jobs", onSelect : "viewOffer", onBack : "goBack" },
            { name : "people", className : "bgpattern", kind : "bj.People", onSelect : "viewOffer", onBack : "goBack" },
            { name : "offerDetails", className : "bgpattern", kind : "bj.OfferDetails", onBack : "goBack" },
            { name : "post", className : "bgpattern", kind : "bj.Post" },
            { name : "search", className : "bgpattern", kind : "bj.Search" },
            { name : "preferences", className : "bgpattern", kind : "bj.Preferences", onCancel : "goBack" },
            { name : "about", className : "bgpattern", kind : "bj.About" }
        ]
    },
    {
        name : "mainMenu",
        kind : "AppMenu",
        components : [
          { name: "mnNewestOffers", caption : "New offers", onclick : "showNewestOffers" },
          { name: "mnJobs", caption : "Jobs", onclick : "showJobs" },
          { name: "mnPeople", caption : "People", onclick : "showPeople" },
          { name: "mnPost", caption : "Post", onclick : "showPost" },
          { name: "mnSearch", caption : "Search", onclick : "showSearch" },
          { name: "mnPreferences", caption : "Preferences", onclick : "showPreferences" },
          { name: "mnAbout", caption : "About", onclick : "showAbout" },
        ]
    } ],
    // ------------------------------------------------
    create : function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.mainMenu.components[0].caption = $L('Menu_NewestOffers');
        this.$.mainMenu.components[1].caption = $L('Menu_Jobs');
        this.$.mainMenu.components[2].caption = $L('Menu_People');
        this.$.mainMenu.components[3].caption = $L('Menu_Post');
        this.$.mainMenu.components[4].caption = $L('Menu_Search');
        this.$.mainMenu.components[5].caption = $L('Menu_Preferences');
        this.$.mainMenu.components[6].caption = $L('Menu_About');
        this.$.pane.selectViewByName("loading");
    },
    // App Menu ------------------------------------------------
    openAppMenuHandler: function() {
        this.$.appMenu.open();
    },
    closeAppMenuHandler: function() {
        this.$.appMenu.close();
    },
    // Preferences ------------------------------------------------
    showPreferences : function() {
        this.$.pane.selectViewByName("preferences");
    },
    preferencesReceived : function(inSender, inDefaultUrl) {
    },
    preferencesSaved : function(inSender, inFeedUrl) {
        this.$.pane.back();
    },
    // ------------------------------------------------
    viewOffer : function(inSender, inOffer) {
        this.$.pane.selectViewByName("offerDetails");
        this.$.offerDetails.setOffer(inOffer);
    },
    viewCategory : function(inSender, inCategory, inHumanYn) {
        if (!inHumanYn) {
            this.$.pane.selectViewByName("jobs");
            this.$.jobs.showItems(inCategory.cid);
        }
        else {
            this.$.pane.selectViewByName("people");
            this.$.people.showItems(inCategory.cid);
        }
    },
    // ------------------------------------------------
    goBackLoading : function(inSender, inEvent) {
        this.$.pane.selectViewByName("newestOffers");
    },
    goBack : function(inSender, inEvent) {
        this.$.pane.back(inEvent);
    },
    // Menu ------------------------------------------------
    showNewestOffers : function() {
        this.$.pane.selectViewByName("newestOffers");
    },
    showJobs : function() {
        if (enyo.application.appSettings['ShowCategories']) {
            this.$.pane.selectViewByName("categories");
            this.$.categories.setHumanYn(false);
            this.$.categories.switchView(0);
            this.$.categories.showCategories();
        }
        else {
            this.$.pane.selectViewByName("jobs");
            this.$.jobs.refresh();
        }
    },
    showPeople : function() {
        if (enyo.application.appSettings['ShowCategories']) {
            this.$.pane.selectViewByName("categories");
            this.$.categories.setHumanYn(true);
            this.$.categories.switchView(0);
            this.$.categories.showCategories();
        }
        else {
            this.$.pane.selectViewByName("people");
            this.$.people.refresh();
        }
    },
    showPost : function() {
        this.$.pane.selectViewByName("post");
        this.$.post.refreshLabels();
    },
    showSearch : function() {
        this.$.pane.selectViewByName("search");
    },
    showPreferences : function() {
        this.$.pane.selectViewByName("preferences");
    },
    showAbout : function() {
        this.$.pane.selectViewByName("about");
    }
});
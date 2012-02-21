enyo.kind({
    name : "bj.Loading",
    kind : enyo.VFlexBox,
    events : {
        onBack : ""
    },
    components : [
        {
            name: 'lblLoading',
            content: 'Loading...',
            className: 'loadingLabel'
        },
        {
            name: 'loadingProgress',
            kind: "ProgressBar",
            minimum: 0,
            maximum: 60,
            position: 0,
            className: "loadingProgressBar"
        },
        {
            name: "syncService",
            kind: "WebService",
            onSuccess: "syncFinished",
            onFailure: "syncFailed"
        },
        {
            name : "getConnMgrStatus",
            kind : "PalmService",
            service : "palm://com.palm.connectionmanager/",
            method : "getStatus",
            onSuccess : "statusFinished",
            onFailure : "statusFail",
            onResponse : "gotResponse",
            subscribe : true
        },
        {
            name: "getPreferencesCall",
            kind: "PalmService",
            service: "palm://com.palm.systemservice/",
            method: "getPreferences",
            onSuccess: "getPreferencesSuccess",
            onFailure: "getPreferencesFailure"
        }
    ],
    create: function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.lblLoading.setContent($L('Loading'));
        this.db = enyo.application.persistence;
        
        this.$.getPreferencesCall.call(
        {
            "keys": ["showCategories", "onlineSearch", "inAppEmail", "privateData", "pdEmail"]
        });

        var dbWipe = false;
        if (dbWipe) {
            var that = this;
            enyo.application.persistence.reset();
            enyo.application.persistence.transaction(function(tx) {
                enyo.application.persistence.flush(tx, function() {
                    that.log('Database wiped!');
                    //that.serviceURL = "http://www.bombajob.bg/_mob_service_json.php?action=";
                    //that.$.getConnMgrStatus.call();
                });
            });
        }
        else {
            this.serviceURL = enyo.application.appSettings['ServiceURL'];
            this.$.getConnMgrStatus.call();
        }
    },
    getPreferencesSuccess: function(inSender, inResponse) {
        enyo.application.appSettings['ShowCategories'] = inResponse.showCategories;
        enyo.application.appSettings['OnlineSearch'] = inResponse.onlineSearch;
        enyo.application.appSettings['InAppEmail'] = inResponse.inAppEmail;
        enyo.application.appSettings['PrivateData'] = inResponse.privateData;
        enyo.application.appSettings['PDEmail'] = inResponse.pdEmail;
    },
    getPreferencesFailure: function(inSender, inResponse) {
        enyo.application.appSettings['ShowCategories'] = false;
    },
    statusFinished : function(inSender, inResponse) {
        this.log("getStatus success, results=" + enyo.json.stringify(inResponse));
        this.syncTextContent();
    },
    statusFail : function(inSender, inResponse) {
        this.log("getStatus failure, results=" + enyo.json.stringify(inResponse));
    },
    getStatus : function(inSender, inResponse) {
        this.$.getConnMgrStatus.call({ "subscribe": true });
    },
    syncFinished: function(inSender, inResponse, inRequest) {
        if (inResponse !== null) {
            this.$.loadingProgress.setPosition(20 * this.serviceStatus);
            if (this.serviceStatus == 1 && inResponse.getTextContent != null) {
                enyo.forEach(inResponse.getTextContent, function(ent) {
                    TextContent.all().filter('cid', '=', ent.id).one(function(existing) {
                        if (!existing) {
                            var t = new TextContent();
                            t.cid = ent.id;
                            t.title = ent.title;
                            t.content = ent.content;
                            enyo.application.persistence.add(t);
                            enyo.application.persistence.flush(function(){ });
                        }
                        else {
                            existing.cid = ent.id;
                            existing.title = ent.title;
                            existing.content = ent.content;
                            enyo.application.persistence.flush(function(){ });
                        }
                    });
                }, this);
                enyo.application.persistence.flush(function(){ });
                this.log("Sync done ... text content!");
                this.syncCategories();
            }
            else if (this.serviceStatus == 2) {
                enyo.forEach(inResponse.getCategories, function(ent) {
                    Category.all().filter('cid', '=', ent.id).one(function(existing) {
                        if (!existing) {
                            var t = new Category();
                            t.cid = ent.id;
                            t.title = ent.name;
                            t.offercount = ent.offerCount;
                            enyo.application.persistence.add(t);
                            enyo.application.persistence.flush(function(){ });
                        }
                        else {
                            existing.cid = ent.id;
                            existing.title = ent.name;
                            existing.offercount = ent.offerCount;
                            enyo.application.persistence.flush(function(){ });
                        }
                    });
                }, this);
                enyo.application.persistence.flush(function(){ });
                this.log("Sync done ... categories!");
                this.syncNewestOffers();
            }
            else {
                var that = this;
                enyo.forEach(inResponse.getNewJobs, function(ent) {
                    JobOffer.all().filter('oid', '=', ent.id).one(function(existing) {
                        if (!existing) {
                            var t = new JobOffer();
                            t.oid = ent.id;
                            t.cid = ent.cid;
                            t.title = ent.title;
                            t.categorytitle = ent.category;
                            t.email = ent.email;
                            t.freelanceyn = (ent.fyn == 1);
                            t.humanyn = (ent.hm == 1);
                            t.negativism = ent.negativism;
                            t.positivism = ent.positivism;
                            t.publishdate = Date.parse(ent.date);
                            t.publishdatestring = ent.date;
                            t.publishdatestamp = ent.datestamp;
                            t.readyn = false;
                            t.sentmessageyn = false;
                            enyo.application.persistence.add(t);
                            enyo.application.persistence.flush(function() {
                                enyo.application.persistence.flush(function(){ });
                                that.syncDone();
                            });
                        }
                        else {
                            existing.oid = ent.id;
                            existing.cid = ent.cid;
                            existing.title = ent.title;
                            existing.categorytitle = ent.category;
                            existing.email = ent.email;
                            existing.freelanceyn = (ent.fyn == 1);
                            existing.humanyn = (ent.hm == 1);
                            existing.negativism = ent.negativism;
                            existing.positivism = ent.positivism;
                            existing.publishdate = Date.parse(ent.date);
                            existing.publishdatestring = ent.date;
                            existing.publishdatestamp = ent.datestamp;
                            enyo.application.persistence.flush(function() {
                                enyo.application.persistence.flush(function(){ });
                                that.syncDone();
                            });
                        }
                    });
                }, this);
            }
            this.log("Sync done ... newest job offers!");
        }
        else
            this.syncFailed();
    },
    syncFailed: function() {
        this.log("Synchronization failed (" + this.serviceStatus + ")!");
    },
    syncDone: function() {
        this.$.loadingProgress.setPosition(60);
        this.log("Synchronization completed!");
        this.doBack();
    },
    syncTextContent: function() {
        this.serviceStatus = 1;
        this.$.syncService.setUrl(this.serviceURL + "getTextContent");
        this.$.syncService.call();
    },
    syncCategories: function() {
        this.serviceStatus = 2;
        this.$.syncService.setUrl(this.serviceURL + "getCategories");
        this.$.syncService.call();
    },
    syncNewestOffers: function() {
        this.serviceStatus = 3;
        this.$.syncService.setUrl(this.serviceURL + "getNewJobs&wd=1");
        this.$.syncService.call();
    }
});
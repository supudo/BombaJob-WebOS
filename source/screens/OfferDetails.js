enyo.kind({
    name : "bj.OfferDetails",
    kind : "VFlexBox",
    published : {
        offer : null
    },
    events : {
        onBack : "",
        onSendMessage: "",
        onPostFacebook: ""
    },
    components : [
        { kind : "PageHeader", components : [
             { name : "headerText", kind : enyo.VFlexBox, content : "BombaJob", flex : 1 },
             { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
             { width: "10px" },
             { name : "sharePicker", kind: "Picker", caption: "", value: "", onclick:'clearShare', onChange: "shareChange", onFocusChange: "shareFocus", className: "btn-share" }
        ] },
        { kind : "Scroller", flex : 1, layoutKind: "VFlexLayout", components : [
            { name : "offerContent", kind : "HtmlContent", allowHtml : "true", style: "padding: 2px;" },
            { name: "sendMessageButton", kind: "Button", caption: "Send message", onclick: "sendMessageClick", className: "btn-send-message" }
        ] },
        { name: "mdEmails", kind: "ModalDialog", components: [
            { kind: "RowGroup", name : "grpEmail", caption: "Email", components: [
                { kind: "HFlexBox", align: "center", components: [
                    { name: "emFrom", kind: "Input", hint: "Your email...", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
                ]},
                { kind: "HFlexBox", align: "center", components: [
                    { name: "emTo", kind: "Input", hint: "Send to...", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
                ]},
            ]},
            { layoutKind: "HFlexLayout", pack: "center", components: [
                { name: "btnSend", kind: "Button", caption: "Send", onclick: "sendClick" },
                { name: "btnCancel", kind: "Button", caption: "Cancel", onclick: "cancelClick" }
            ]}
        ]},
        { name: "emService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
        { name: "mdService", kind: "ModalDialog", components: [
            { name: "mdServiceMessage", content: "Thanks", style: "text-align: center;" },
            { layoutKind: "HFlexLayout", pack: "center", components: [
                { name: "btnClose", kind: "Button", caption: "Close", onclick: "closeClick" }
            ]}
        ]}
    ],
    create: function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.backButton.setContent($L('Back'));
        this.$.sendMessageButton.setCaption($L('send_message'));
        this.shareNets = [];
        this.shareNets.push({caption: $L('share_title'), value: 0});
        //this.shareNets.push({caption: "Facebook", value: 1});
        //this.shareNets.push({caption: "Twitter", value: 2});
        this.shareNets.push({caption: "Email", value: 3});
        this.shareNets.push({caption: $L('send_message'), value: 4});
        this.resetShare();
    },
    backClick : function() {
        this.doBack();
    },
    offerChanged : function() {
        var that = this;
        JobOffer.all().filter('oid', '=', this.offer.oid).one(function(existing) {
            if (existing) {
                existing.readyn = true;
                enyo.application.persistence.flush(function(){});
            }
        });
        var off = "";
        off += "<i>" + this.offer.categorytitle + "</i><br><br>";
        off += "<b>" + this.offer.title + "</b><br><br>";
        off += getDateForDetails(this.offer.publishdate) + "<br><br>";
        off += $L('FreelanceYn') + " " + ((this.offer.freelanceyn) ? $L('YES') : $L('NO')) + "<br><br>";
        off += "<b>" + ((this.offer.humanyn) ? $L('odetails_Human_Positiv') : $L('odetails_Company_Positiv')) + "</b><br>";
        off += this.offer.positivism + "<br><br>";
        off += "<b>" + ((this.offer.humanyn) ? $L('odetails_Human_Negativ') : $L('odetails_Company_Negativ')) + "</b><br>";
        off += this.offer.negativism + "<br>";
        this.$.offerContent.setContent(off);
    },
    sendMessageClick: function() {
        this.doSendMessage(this.offer);
    },
    shareChange: function(inSender) {
        var shareTo = this.$.sharePicker.getValue();
        this.clearShare();
        switch (shareTo) {
            case 1:
                this.doShareFacebook();
                break;
            case 2:
                this.doShareTwitter();
                break;
            case 3:
                this.doShareEmail();
                break;
            case 4:
                this.doSendMessage(this.offer);
                break;
            default :
                break;
        }
    },
    shareFocus: function(inSender) {
        this.clearShare();
    },
    clearShare: function() {
        this.$.sharePicker.setValue(0);
        this.$.sharePicker.setCaption("");
    },
    resetShare: function() {
        this.$.sharePicker.setCaption("");
        this.$.sharePicker.setItems(this.shareNets);
        this.$.sharePicker.render();
    },
    // Share Facebook ---------------------------------
    doShareFacebook: function() {
        logThis(this, "share Facebook");
        this.doPostFacebook();
    },
    // Share Twitter ---------------------------------
    doShareTwitter: function() {
        logThis(this, "share Twitter");
    },
    // Share email ---------------------------------
    doShareEmail: function() {
        logThis(this, "share Email");
        this.$.mdEmails.open();
        this.$.grpEmail.setCaption($L('message_title'));
        this.$.emFrom.setHint($L('message_fromEmail'));
        this.$.emTo.setHint($L('message_toEmail'));
        this.$.btnSend.setCaption($L('message_btn_send'));
        this.$.btnCancel.setCaption($L('message_btn_cancel'));
    },
    sendClick: function() {
        var j = {from : addSlashes(this.$.emFrom.getValue()), to : addSlashes(this.$.emTo.getValue())};
        this.$.emService.setUrl(enyo.application.appSettings['ServiceURL'] + "sendEmailMessage&oid=" + this.offer.oid);
        this.$.emService.call("jsonobj=" + enyo.json.stringify(j));
        this.$.mdEmails.close();
    },
    cancelClick: function() {
        this.$.mdEmails.close();
    },
    syncFinished: function(inSender, inResponse, inRequest) {
        enyo.scrim.hide();
        this.$.mdService.open();
        this.$.mdServiceMessage.setContent($L('message_sent'));
        this.$.btnClose.setCaption($L('close_alertbox'));
        logThis(this, "Email sending success - " + enyo.json.stringify(inResponse) + "!");
    },
    syncFailed: function(inSender, inResponse, inRequest) {
        enyo.scrim.hide();
        logThis(this, "Email sending failed (" + enyo.json.stringify(inResponse) + ")!");
    },
    // ------------------------------------------------------------------
    closeClick: function() {
        this.$.mdService.close();
    }
});
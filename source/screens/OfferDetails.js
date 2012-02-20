enyo.kind({
    name : "bj.OfferDetails",
    kind : "VFlexBox",
    published : {
        offer : null
    },
    events : {
        onBack : ""
    },
    components : [
        { kind : "PageHeader", components : [
             { name : "headerText", kind : enyo.VFlexBox, content : "BombaJob", flex : 1 },
             { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" }
        ] },
        { kind : "Scroller", flex : 1, layoutKind: "VFlexLayout", components : [
            { name : "cofferContent", kind : "HtmlContent", allowHtml : "true" }
        ] }
    ],
    create: function() {
        this.inherited(arguments);
        enyo.g11n.setLocale({uiLocale: "bg"});
        this.$.backButton.setContent($L('Back'));
    },
    backClick : function() {
        this.doBack();
    },
    offerChanged : function() {
        var off = "";
        off += "<i>" + this.offer.categorytitle + "</i><br><br>";
        off += "<b>" + this.offer.title + "</b><br><br>";
        off += getDateForDetails(this.offer.publishdate) + "<br><br>";
        off += $L('FreelanceYn') + " " + ((this.offer.freelanceyn) ? $L('YES') : $L('NO')) + "<br><br>";
        off += "<b>" + ((this.offer.humanyn) ? $L('odetails_Human_Positiv') : $L('odetails_Company_Positiv')) + "</b><br>";
        off += this.offer.positivism + "<br><br>";
        off += "<b>" + ((this.offer.humanyn) ? $L('odetails_Human_Negativ') : $L('odetails_Company_Negativ')) + "</b><br>";
        off += this.offer.negativism + "<br>";
        this.$.cofferContent.setContent(off);
    }
});
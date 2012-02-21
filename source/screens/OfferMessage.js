enyo.kind({
  name: "bj.OfferMessage",
  kind: enyo.VFlexBox,
  published : {
      offer : null
  },
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "BombaJob", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" },
          { name : "sendButton", kind : "Button", content : "Send", onclick : "sendClick", className: "btn-send-message" }
      ] },
      { name: "pMessage", kind: "RichText", hint: "...", style: "margin: 4px; height: 80%;", autoWordComplete: "false", alwaysLooksFocused: "true" },
      { name: "msgService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
      { name: "mdPostOK", kind: "ModalDialog", components: [
          { name: "mdPostOKMessage", content: "Thanks", style: "text-align: center;" },
          { layoutKind: "HFlexLayout", pack: "center", components: [
              { name: "btnClose", kind: "Button", caption: "Close", onclick: "closeClick" }
          ]}
      ]}
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.backButton.setCaption($L('Back'));
      this.$.sendButton.setCaption($L('send_button'));
  },
  sendClick: function(inSender, inEvent) {
      enyo.scrim.show();
      var j = {msg : addSlashes(this.$.pMessage.getValue())};
      if (this.$.pMessage.getValue() != "") {
          this.$.msgService.setUrl(enyo.application.appSettings['ServiceURL'] + "postMessage&oid=" + this.offer.oid);
          this.$.msgService.call("jsonobj=" + enyo.json.stringify(j));
      }
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.$.mdPostOK.open();
      this.$.btnClose.setCaption($L('close_alertbox'));
      this.$.mdPostOKMessage.setContent($L('message_sent'));
      this.log("Message success - " + enyo.json.stringify(inResponse) + "!");
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.log("Message failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  backClick : function() {
      this.doBack();
  },
  closeClick: function() {
      this.$.pMessage.setValue("");
      this.$.mdPostOK.close();
      this.doBack();
  }
});
enyo.kind({
  name: "bj.Post",
  kind: enyo.VFlexBox,
  events: { 
      onSelect: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Post", flex : 1 }
      ] },
      { kind : "Scroller", flex : 1, layoutKind: "VFlexLayout", components : [
          { name : "cofferContent", kind : "HtmlContent", allowHtml : "true" }
      ] },
      { kind: "HFlexBox", pack: "end", style: "padding: 0 10px;", components: [
           { name: "saveButton", kind: "Button", content: "Save", onclick: "saveClick" }
       ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Post'));
      this.$.saveButton.setContent($L(''));
  },
  saveClick: function(inSender, inEvent) {
  }
});
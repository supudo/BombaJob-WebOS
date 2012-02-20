enyo.kind({
  name: "bj.Post",
  kind: enyo.VFlexBox,
  events: { 
      onSelect: ""
  },
  components: [
      {
          kind : "PageHeader",
          components : [
              { name : "headerText", kind : enyo.VFlexBox, content : "Post", flex : 1 }
          ]
      }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Post'));
  }
});
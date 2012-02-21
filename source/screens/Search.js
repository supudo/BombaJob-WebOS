enyo.kind({
  name: "bj.Search",
  kind: enyo.VFlexBox,
  events: { 
      onFound: ""
  },
  components: [
      { kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Search", flex : 1 }
      ] },
      { kind: "HFlexBox", align: "center", style: "padding: 2px; margin-top: 10px;", components: [
          { name: "lblFreelanceYn", content: "Freelance?", style: "margin-right: 10px;" },
          { name: "pFreelanceYn", kind: "ToggleButton", flex: 1, style: "width: 80px;" }
      ]},
      { kind: "RowGroup", name: "lblSearch", caption: "Search", style: "padding: 2px; margin-top: 10px;", components: [
          { name: "searchQ", kind: "Input", hint: "...", autoCapitalize: "lowercase", autoWordComplete: "false" }
      ]},
      { kind: "HFlexBox", pack: "center", className: "btn-post-cont", components: [
          { name: "searchButton", kind: "CustomButton", caption: "Search", onclick: "searchClick", className: "btn-post" }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Search'));
      this.$.lblFreelanceYn.setContent($L('post_FreelanceYn_Choice'));
      this.$.pFreelanceYn.setOnLabel($L('YES'));
      this.$.pFreelanceYn.setOffLabel($L('NO'));
      this.$.lblSearch.setCaption($L('search_for'));
      this.$.searchButton.setContent($L('button_search'));
  },
  searchClick: function() {
      this.doFound(this.$.pFreelanceYn.getState(), this.$.searchQ.getValue());
  }
});
enyo.kind({
  name: "bj.Jobs",
  kind: enyo.VFlexBox,
  published: {
      offerItems: [],
      CategoryID: 0
  },
  events: { 
      onSelect: "",
      onBack : ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Jobs", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" }
      ]},
      { kind: "Scroller", flex: 1, components: [
          { name:'list', kind: 'VirtualList', flex:1, onSetupRow:'getListItem', components: [
              { name:'item', kind:'Item', tapHighlight:true, onclick:'listItemClick', layoutKind:'VFlexLayout', components:[
                  { name: "category", kind: "Divider"} ,
                      { kind:'HFlexBox', components:[
                          { name:'content', kind: "HtmlContent", allowHtml: 'true' }
                      ] }
              ] }
          ] }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Jobs'));
      this.db = enyo.application.persistence;
      this.offerItems = new Array();

      this.$.backButton.hide();

      var that = this;
      JobOffer.all().filter('humanyn', '=', 'false').filter('cid', ((this.CategoryID > 0) ? '=' : '>'), ((this.CategoryID > 0) ? this.CategoryID : '0')).order("publishdate", false).list(null, function (results) {
          results.forEach(function (off) {
              that.offerItems.push(off);
              that.refresh();
          });
      });
  },
  backClick : function() {
      this.doBack();
  },
  refresh: function() {
      this.$.list.reset();
      this.$.list.refresh();
  },
  getListItem: function(inSender, inIndex) {
      var r = this.offerItems[inIndex];
      if (r) {
          this.$.category.show();
          if (this.CategoryID > 0)
              this.$.category.hide();
          this.$.category.setCaption(r.categorytitle);
          var offContent = '<b>' + r.title + '</b>';
          offContent += '<br /><i>' + getDateForList(r.publishdate) + '</i>';
          this.$.content.setContent(offContent);
          return true;
      }
  },
  listItemClick: function(inSender, inEvent) {
      var offer = this.offerItems[inEvent.rowIndex];
      this.doSelect(offer);
  },
  showItems: function(categoryID) {
      this.CategoryID = categoryID;

      this.$.backButton.hide();
      if (this.CategoryID > 0)
          this.$.backButton.show();

      this.offerItems = new Array();
      var that = this;
      JobOffer.all().filter('humanyn', '=', 'false').filter('cid', ((this.CategoryID > 0) ? '=' : '>'), ((this.CategoryID > 0) ? this.CategoryID : '0')).order("publishdate", false).list(null, function (results) {
          results.forEach(function (off) {
              that.offerItems.push(off);
              that.refresh();
          });
      });
  }
});
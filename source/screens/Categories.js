enyo.kind({
  name: "bj.Categories",
  kind: enyo.VFlexBox,
  published: {
      catItems: [],
      offerItems: [],
      humanYn: false,
      catYn: true
  },
  events: { 
      onCategorySelect: "",
      onOfferSelect: ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Categories", flex : 1 }
      ]},
      { name: 'tabBar', kind: "TabGroup", onChange: "tabButtonSelected", components: [
          { name: "tabCategories", caption: "Categories" },
          { name: "tabOffers", caption: "Offers" }
      ]},
      { kind: "Scroller", flex: 1, components: [
          { name:'listItems', kind: 'VirtualList', flex:1, onSetupRow:'getListItem', components: [
              { name:'item', kind:'Item', tapHighlight:true, onclick:'listItemClick', layoutKind:'VFlexLayout', components:[
                  { name: "contentDivider", kind: "Divider"} ,
                  { name: "header", kind:'HFlexBox', components:[
                      { name:'content', kind: "HtmlContent", allowHtml: 'true' }
                  ] }
              ] }
          ] }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('headerCategories'));
      this.$.tabCategories.setCaption($L('headerCategories'));
      this.$.tabOffers.setCaption($L('headerOffers'));

      this.catItems = new Array();
      var that = this;
      Category.all().order("title", true).list(null, function (results) {
          results.forEach(function (cat) {
              that.catItems.push(cat);
              that.refreshItems();
          });
      });

      this.offerItems = new Array();
      var that = this;
      JobOffer.all().filter('humanyn', '=', ((this.humanYn) ? 'true' : 'false')).order("publishdate", false).list(null, function (results) {
          results.forEach(function (off) {
              that.offerItems.push(off);
              that.refreshItems();
          });
      });
  },
  tabButtonSelected: function(inSender) {
      this.log("Selected button" + inSender.getValue());
      this.switchView(inSender.getValue());
  },
  switchView: function(tbVal) {
      this.$.tabCategories.setState("depressed", false);
      this.$.tabOffers.setState("depressed", false);
      this.$.tabBar.value = 0;
      if (tbVal == 0) {
          this.$.tabCategories.setState("depressed", true);
          this.catYn = true;
          this.showCategories();
      }
      else {
          this.$.tabOffers.setState("depressed", true);
          this.$.tabBar.value = 1;
          this.catYn = false;
          this.showOffers();
      }
  },
  refreshItems: function() {
      this.$.listItems.reset();
      this.$.listItems.refresh();
  },
  getListItem: function(inSender, inIndex) {
      if (this.catYn) {
          var r = this.catItems[inIndex];
          if (r) {
              this.$.content.setContent(r.title);
              return true;
          }
      }
      else {
          this.$.contentDivider.show();
          var r = this.offerItems[inIndex];
          if (r) {
              this.$.contentDivider.setCaption(r.categorytitle);
              var offContent = '<b>' + r.title + '</b>';
              offContent += '<br /><i>' + getDateForList(r.publishdate) + '</i>';
              this.$.content.setContent(offContent);
              return true;
          }
      }
  },
  listItemClick: function(inSender, inEvent) {
      if (this.catYn) {
          var category = this.catItems[inEvent.rowIndex];
          this.doCategorySelect(category, this.humanYn);
      }
      else {
          var offer = this.offerItems[inEvent.rowIndex];
          this.doOfferSelect(offer);
      }
  },
  showCategories: function() {
      if (this.humanYn)
          this.$.headerText.setContent($L('Menu_People'));
      else
          this.$.headerText.setContent($L('Menu_Jobs'));
      this.$.contentDivider.hide();
      this.catItems = new Array();

      var that = this;
      Category.all().order("title", true).list(null, function (results) {
          results.forEach(function (cat) {
              that.catItems.push(cat);
              that.refreshItems();
          });
      });
  },
  showOffers: function() {
      this.$.contentDivider.show();
      this.offerItems = new Array();

      var that = this;
      JobOffer.all().filter('humanyn', '=', ((this.humanYn) ? 'true' : 'false')).order("publishdate", false).list(null, function (results) {
          results.forEach(function (off) {
              that.offerItems.push(off);
              that.refreshItems();
          });
      });
  }
});
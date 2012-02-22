enyo.kind({
  name: "bj.NewestOffers",
  kind: enyo.VFlexBox,
  published: {
      offerItems: []
  },
  events: { 
      onSelect: ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Newest Offers", flex : 1 }
      ]},
      { kind: "Scroller", flex: 1, components: [
          { name:'list', kind: 'VirtualList', flex:1, onSetupRow:'getListItem', components: [
              { name:'item', kind:'Item', tapHighlight:true, onclick:'listItemClick', layoutKind:'VFlexLayout', components:[
                  { name: "category", kind: "Divider"} ,
                  { name:'header', kind:'HFlexBox', components: [
                      { kind:'Control', components:[
                          { name:'icon', size:'35', kind:'Image', className: 'opIcon' }
                      ] },
                      { kind:'HFlexBox', components:[
                          { name:'content', kind: "HtmlContent", allowHtml: 'true' }
                      ] }
                  ] }
              ] }
          ] }
      ] }
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_NewestOffers'));
  },
  loadOffers: function() {
      this.offerItems = new Array();

      var that = this;
      JobOffer.all().order("publishdate", false).list(null, function (results) {
          results.forEach(function (off) {
              that.offerItems.push(off);
              that.refresh();
          });
      });
  },
  refresh: function() {
      this.$.list.reset();
      this.$.list.refresh();  
  },
  getListItem: function(inSender, inIndex) {
      var r = this.offerItems[inIndex];
      if (r) {
          this.$.category.setCaption(r.categorytitle);
          if (r.humanyn)
              this.$.icon.setSrc("images/icon_person.png");
          else
              this.$.icon.setSrc("images/icon_company.png");
          var offContent = '<b>' + r.title + '</b>';
          offContent += '<br /><i>' + getDateForList(r.publishdate) + '</i>';
          this.$.content.setContent(offContent);
          return true;
      }
  },
  listItemClick: function(inSender, inEvent) {
      var offer = this.offerItems[inEvent.rowIndex];
      this.doSelect(offer);
  }
});
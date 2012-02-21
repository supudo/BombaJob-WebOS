enyo.kind({
  name: "bj.SearchResults",
  kind: enyo.VFlexBox,
  published: {
      freelanceYn: false,
      searchQuery: "",
      offerItems: []
  },
  events: { 
      onBack : "",
      onSelect: ""
  },
  components: [
      {kind : "PageHeader", components : [
          { name : "headerText", kind : enyo.VFlexBox, content : "Search Results", flex : 1 },
          { name : "backButton", kind : "Button", content : "Back", onclick : "backClick" }
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
      ] },
      { name: "searchService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed" },
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_SearchResults'));
      this.$.backButton.setContent($L('Back'));
      this.db = enyo.application.persistence;
  },
  performSearch: function(inFreelance, inSearchQuery) {
      this.freelanceYn = inFreelance;
      this.searchQuery = inSearchQuery;
      this.offerItems = new Array();

      if (enyo.application.appSettings['OnlineSearch']) {
          enyo.scrim.show();
          this.$.searchService.setUrl(enyo.application.appSettings['ServiceURL'] + "searchOffers&wd=1&keyword=" + this.searchQuery + "&freelance=" + (this.freelanceYn ? "1" : "0"));
          this.$.searchService.call();
      }
      else {
          var that = this;
          JobOffer.search("*" + this.searchQuery + "*").list(null, function(results) {
              results.forEach(function (off) {
                  if (off.freelanceyn == that.freelanceYn) {
                      that.offerItems.push(off);
                      that.refresh();
                  }
              });
          });
      }
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
  },
  backClick : function() {
      this.doBack();
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.log("Search success - " + enyo.json.stringify(inResponse) + "!");
      if (inResponse !== null && inResponse.searchOffers != null) {
          var that = this;
          enyo.forEach(inResponse.searchOffers, function(ent) {
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
                  }
              });
          }, this);
          enyo.application.persistence.flush(function(){ });
          var that = this;
          JobOffer.search("*" + this.searchQuery + "*").list(null, function(results) {
              results.forEach(function (off) {
                  if (off.freelanceyn == that.freelanceYn) {
                      that.offerItems.push(off);
                      that.refresh();
                  }
              });
          });
      }
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.log("Search failed (" + enyo.json.stringify(inResponse) + ")!");
  }
});
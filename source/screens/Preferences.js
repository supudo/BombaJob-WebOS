enyo.kind({
  name: "bj.Preferences",
  kind: enyo.VFlexBox,
  events: {
      onReceive: "",
      onSave: "",
      onCancel: ""
  },
  components: [
      {
          name: "getPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "getPreferences",
          onSuccess: "getPreferencesSuccess",
          onFailure: "getPreferencesFailure"
      },
      {
          name: "setPreferencesCall",
          kind: "PalmService",
          service: "palm://com.palm.systemservice/",
          method: "setPreferences",
          onSuccess: "setPreferencesSuccess",
          onFailure: "setPreferencesFailure"
      },
      { kind: "PageHeader", name : "headerText", content: "Preferences" },
      { kind: "Scroller", flex: 1, components: [
          { kind: "VFlexBox", components: [
              { kind: "RowGroup", name : "grpPrivateData", caption: "Private data", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblSavePrivateData", content: "Save data", flex: 1 },
                      { name: "sSavePrivateData", kind: "ToggleButton", onChange: "savePrivateDataClicked" }
                  ]},
                  { kind: "RowGroup", align: "center", components: [
                      { name: "pdEmail", kind: "Input", hint: "PD Email", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
                  ]},
              ]},
              { kind: "RowGroup", name : "grpCategories", caption: "Categories", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblShowCategories", content: "Categories", flex: 1 },
                      { name: "sShowCategories", kind: "ToggleButton", onChange: "showCategoriesClicked" }
                  ]},
              ]},
              { kind: "RowGroup", name : "grpOnlineSearch", caption: "Search", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblOnlineSearch", content: "Online search", flex: 1 },
                      { name: "sOnlineSearch", kind: "ToggleButton", onChange: "onlineSearchClicked" }
                  ]},
              ]},
              { kind: "RowGroup", name : "grpInAppEmail", caption: "Email", components: [
                  { kind: "HFlexBox", align: "center", style: "padding: 5px", components: [
                      { name: "lblInAppEmail", content: "InApp Email", flex: 1 },
                      { name: "sInAppEmail", kind: "ToggleButton", onChange: "inAppEmailClicked" }
                  ]},
              ]},
              { kind: "HFlexBox", pack: "end", style: "padding: 0 10px;", components: [
                  { name: "saveButton", kind: "Button", content: "Save", onclick: "saveClick" },
                  { width: "10px" },
                  { name: "cancelButton", kind: "Button", content: "Cancel", onclick: "cancelClick" }
              ] }
          ] },
      ] },
  ],
  create: function() {
      this.inherited(arguments);
      enyo.g11n.setLocale({uiLocale: "bg"});
      this.$.headerText.setContent($L('Menu_Preferences'));

      this.$.grpPrivateData.setCaption($L('prefs_PrivateData_title'));
      this.$.lblSavePrivateData.setContent($L('prefs_PrivateData_desc'));
      this.$.sSavePrivateData.setOnLabel($L('YES'));
      this.$.sSavePrivateData.setOffLabel($L('NO'));
      this.$.pdEmail.setHint("...");

      this.$.grpCategories.setCaption($L('prefs_ShowCategories_title'));
      this.$.lblShowCategories.setContent($L('prefs_ShowCategories_desc'));
      this.$.sShowCategories.setOnLabel($L('YES'));
      this.$.sShowCategories.setOffLabel($L('NO'));

      this.$.grpOnlineSearch.setCaption($L('prefs_OnlineSearch_title'));
      this.$.lblOnlineSearch.setContent($L('prefs_OnlineSearch_desc'));
      this.$.sOnlineSearch.setOnLabel($L('YES'));
      this.$.sOnlineSearch.setOffLabel($L('NO'));

      this.$.grpInAppEmail.setCaption($L('prefs_InAppEmail_title'));
      this.$.lblInAppEmail.setContent($L('prefs_InAppEmail_desc'));
      this.$.sInAppEmail.setOnLabel($L('YES'));
      this.$.sInAppEmail.setOffLabel($L('NO'));

      this.$.saveButton.setCaption($L('prefs_Save'));
      this.$.cancelButton.setCaption($L('prefs_Cancel'));

      this.$.getPreferencesCall.call(
      {
          "keys": ["showCategories", "onlineSearch", "inAppEmail", "privateData", "pdEmail"]
      });
      this.pShowCategories = false;
      this.pOnlineSearch = false;
      this.pInAppEmail = false;
      this.pPrivateData = false;
      this.pPDEmail = "";
  },
  showCategoriesClicked: function(inSender) {
      this.pShowCategories = inSender.getState();
  },
  onlineSearchClicked: function(inSender) {
      this.pOnlineSearch = inSender.getState();
  },
  inAppEmailClicked: function(inSender) {
      this.pInAppEmail = inSender.getState();
  },
  getPreferencesSuccess: function(inSender, inResponse) {
      this.pShowCategories = inResponse.showCategories;
      this.$.sShowCategories.setState(this.pShowCategories);

      this.pOnlineSearch = inResponse.onlineSearch;
      this.$.sOnlineSearch.setState(this.pOnlineSearch);

      this.pInAppEmail = inResponse.inAppEmail;
      this.$.sInAppEmail.setState(this.pInAppEmail);

      this.pPrivateData = inResponse.privateData;
      this.$.sSavePrivateData.setState(this.pPrivateData);
      
      this.pPDEmail = inResponse.pdEmail;
      if (this.pPDEmail == undefined)
          this.$.pdEmail.setHint("...");
      else
          this.$.pdEmail.setValue(this.pPDEmail);
  },
  getPreferencesFailure: function(inSender, inResponse) {
      enyo.log("Settings read error! " + inResponse);
  },
  setPreferencesSuccess: function(inSender, inResponse) {
      console.log("Settings saved!");
  },
  setPreferencesFailure: function(inSender, inResponse) {
      console.log("Settings save error! " + inResponse);
  },
  saveClick: function(inSender, inEvent) {
      var tShowCategories = this.$.sShowCategories.getState();
      var tOnlineSearch = this.$.sOnlineSearch.getState();
      var tInAppEmail = this.$.sInAppEmail.getState();
      var tPrivateData = this.$.sSavePrivateData.getState();
      var tPDEmail = this.$.pdEmail.getValue();
      this.$.setPreferencesCall.call(
      {
          "showCategories": tShowCategories,
          "onlineSearch": tOnlineSearch,
          "inAppEmail": tInAppEmail,
          "privateData": tPrivateData,
          "pdEmail": tPDEmail
      });
      this.pShowCategories = tShowCategories;
      this.pOnlineSearch = tOnlineSearch;
      this.pInAppEmail = tInAppEmail;
      this.pPrivateData = tPrivateData;
      this.pPDEmail = tPDEmail;
      if (!this.pPrivateData) {
          this.pPDEmail = "";
          this.$.pdEmail.setHint("...");
      }
      enyo.application.appSettings['ShowCategories'] = this.pShowCategories;
      enyo.application.appSettings['OnlineSearch'] = this.pOnlineSearch;
      enyo.application.appSettings['InAppEmail'] = this.pInAppEmail;
      enyo.application.appSettings['PrivateData'] = this.pPrivateData;
      enyo.application.appSettings['PDEmail'] = this.pPDEmail;
  },
  cancelClick: function() {
      this.pShowCategories = enyo.application.appSettings['ShowCategories'];
      this.$.sShowCategories.setState(this.pShowCategories);

      this.pOnlineSearch = enyo.application.appSettings['OnlineSearch'];
      this.$.sOnlineSearch.setState(this.pShowCategories);

      this.pInAppEmail = enyo.application.appSettings['InAppEmail'];
      this.$.sInAppEmail.setState(this.pInAppEmail);

      this.pPrivateData = enyo.application.appSettings['PrivateData'];
      this.$.sPrivateData.setState(this.pPrivateData);

      this.pPDEmail = enyo.application.appSettings['PDEmail'];
      if (!this.pPrivateData) {
          this.pPDEmail = "";
          this.$.pdEmail.setHint("...");
      }
  }
});
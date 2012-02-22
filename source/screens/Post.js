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
          { kind: "HFlexBox", align: "center", style: "padding: 2px; margin-top: 6px;", components: [
              { name: "lblHumanYn", content: "Human?", style: "margin-right: 10px;" },
              { name: "pHumanYn", kind: "ToggleButton", onChange: "humanCompanyChange", flex: 1, style: "width: 150px;" }
          ]},
          { kind: "HFlexBox", align: "center", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "lblFreelanceYn", content: "Freelance?", style: "margin-right: 10px;" },
              { name: "pFreelanceYn", kind: "ToggleButton", flex: 1, style: "width: 80px;" }
          ]},
          { kind: "HFlexBox", align: "center", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "pCategory", kind: "Picker", caption: "Category", className: "post-cat-dd" }
          ]},
          { kind: "RowGroup", name: "lblTitle", caption: "Title", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "pTitle", kind: "RichText", hint: "Title", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblEmail", caption: "Email", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "pEmail", kind: "Input", hint: "Email", autoCapitalize: "lowercase", autoWordComplete: "false", inputType: "email" }
          ]},
          { kind: "RowGroup", name: "lblPositiv", caption: "Positiv", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "pPositiv", kind: "RichText", hint: "Positiv", autoWordComplete: "false" }
          ]},
          { kind: "RowGroup", name: "lblNegativ", caption: "Negativ", style: "padding: 2px; margin-top: 10px;", components: [
              { name: "pNegativ", kind: "RichText", hint: "Negativ", autoWordComplete: "false" }
          ]},
          { name: "errorMsgCont", kind: "HFlexBox", pack: "center", style: "padding: 2px; margin: 6px;", components: [
              { name: "errorMsg", kind: "HtmlContent", className: "btn-post-error" }
          ] },
          { kind: "HFlexBox", pack: "center", className: "btn-post-cont", components: [
              { name: "saveButton", kind: "CustomButton", caption: "Save", onclick: "saveClick", className: "btn-post" }
          ] }
      ] },
      { name: "postService", kind: "WebService", onSuccess: "syncFinished", onFailure: "syncFailed", method: "POST" },
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
      this.$.headerText.setContent($L('Menu_Post'));
      this.refreshLabels();
  },
  refreshLabels: function() {
      this.$.lblHumanYn.setContent($L('post_HumanCompany_Choice'));
      this.$.pHumanYn.setOnLabel($L('post_HumanCompany_H'));
      this.$.pHumanYn.setOffLabel($L('post_HumanCompany_C'));
      this.$.pHumanYn.setState(true);

      this.$.lblFreelanceYn.setContent($L('post_FreelanceYn_Choice'));
      this.$.pFreelanceYn.setOnLabel($L('YES'));
      this.$.pFreelanceYn.setOffLabel($L('NO'));

      this.$.pCategory.setCaption($L('post_Category_Human'));
      this.categories = [];
      var that = this;
      Category.all().order("title", true).list(null, function (results) {
          results.forEach(function (cat) {
              that.categories.push({caption: cat.title, value: cat.cid});
          });
      });
      this.$.pCategory.setItems(this.categories);
      this.$.pCategory.render();
      
      this.$.lblTitle.setCaption($L('post_Human_Title'));
      this.$.pTitle.setHint("...");
      
      this.$.lblEmail.setCaption($L('post_Human_Email'));
      this.$.pEmail.setValue(((enyo.application.appSettings['PrivateData']) ? enyo.application.appSettings['PDEmail'] : "..."));
      
      this.$.lblPositiv.setCaption($L('post_Human_Positiv'));
      this.$.pPositiv.setHint("...");
      
      this.$.lblNegativ.setCaption($L('post_Human_Negativ'));
      this.$.pNegativ.setHint("...");

      this.$.saveButton.setContent($L('post_Button'));
      
      this.$.errorMsgCont.hide();
  },
  humanCompanyChange: function(inSender) {
      if (inSender.getState()) {
          this.$.pCategory.setCaption($L('post_Category_Human'));
          this.$.lblTitle.setCaption($L('post_Human_Title'));
          this.$.lblEmail.setCaption($L('post_Human_Email'));
          this.$.lblPositiv.setCaption($L('post_Human_Positiv'));
          this.$.lblNegativ.setCaption($L('post_Human_Negativ'));
      }
      else {
          this.$.pCategory.setCaption($L('post_Category_Company'));
          this.$.lblTitle.setCaption($L('post_Company_Title'));
          this.$.lblEmail.setCaption($L('post_Company_Email'));
          this.$.lblPositiv.setCaption($L('post_Company_Positiv'));
          this.$.lblNegativ.setCaption($L('post_Company_Negativ'));
      }
  },
  saveClick: function(inSender, inEvent) {
      var isHuman = this.$.pHumanYn.getState();
      var oTitle = this.$.pTitle.getValue();
      var oEmail = this.$.pEmail.getValue();
      var oPositiv = this.$.pPositiv.getValue();
      var oNegativ = this.$.pNegativ.getValue();
      var fr =  (this.$.pFreelanceYn.getState() ? '1' : '0');
      var offCatID = this.$.pCategory.getValue();

      var errorText = "";
      var emailFilter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      var validationError = true;
      if (oTitle == "")
          errorText += (isHuman ? $L('post_error_Human_Title') : $L('post_error_Company_Title'));
      else if (oEmail == "" | !emailFilter.test(oEmail))
          errorText += (isHuman ? $L('post_error_Human_Email') : $L('post_error_Company_Email'));
      else if (oPositiv == "")
          errorText += (isHuman ? $L('post_error_Human_Positiv') : $L('post_error_Company_Positiv'));
      else if (oNegativ == "")
          errorText += (isHuman ? $L('post_error_Human_Negativ') : $L('post_error_Company_Negativ'));
      else if (offCatID == 0)
          errorText += $L('post_error_Category');
      else
          validationError = false;

      var j = {h : (isHuman ? 'true' : 'false'), fr: fr, cid: offCatID, tt: addSlashes(oTitle), em: addSlashes(oEmail), pos: addSlashes(oPositiv), neg: addSlashes(oNegativ)};
      if (validationError) {
          this.$.errorMsg.setContent(errorText);
          this.$.errorMsgCont.show();
      }
      else {
          enyo.scrim.show();
          logThis(this, "posting offer - " + enyo.json.stringify(j));
          this.$.errorMsgCont.hide();
          this.$.postService.setUrl(enyo.application.appSettings['ServiceURL'] + "postNewJob");
          this.$.postService.call("jsonobj=" + enyo.json.stringify(j));
      }
  },
  syncFinished: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      this.$.mdPostOK.open();
      this.$.btnClose.setCaption($L('close_alertbox'));
      this.$.mdPostOKMessage.setContent($L('post_OfferSuccess'));
      logThis(this, "Post success - " + enyo.json.stringify(inResponse) + "!");
  },
  syncFailed: function(inSender, inResponse, inRequest) {
      enyo.scrim.hide();
      logThis(this, "Post failed (" + enyo.json.stringify(inResponse) + ")!");
  },
  closeClick: function() {
      this.$.pHumanYn.setState(true);
      this.$.pFreelanceYn.setState(false);
      this.$.pCategory.setValue(0);
      this.$.pCategory.setCaption($L('post_Category_Human'));
      this.$.pTitle.setValue("");
      this.$.pEmail.setValue(((enyo.application.appSettings['PrivateData']) ? enyo.application.appSettings['PDEmail'] : "..."));
      this.$.pPositiv.setValue("");
      this.$.pNegativ.setValue("");
      this.$.mdPostOK.close();
  }
});
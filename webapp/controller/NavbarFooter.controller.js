sap.ui.define(
  [
    "sap/ui/Device",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Button",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/BadgeEnabler",
  ],
  function (
    Device,
    Controller,
    JSONModel,
    Button,
    MessageToast,
    Fragment,
    MessageBox,
    ResourceModel
  ) {
    "use strict";

    var token = sessionStorage.getItem("token");

    return Controller.extend(
      "regesta.regestarapportini.controller.NavbarFooter",
      {
        onInit: function () {
          var i18nModel = new ResourceModel({
            bundleName: "regesta.regestarapportini.i18n.i18n",
          });

          this.getView().setModel(i18nModel, "i18n");
        },

        fnChange: function (oEvent) {
          var itemPressed = oEvent.getParameter("itemPressed").getId();

          console.log(itemPressed);
          if (
            itemPressed === "__item0-__switch0-0" ||
            itemPressed === "__item1-__switch1-0"
          ) {
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteLogin");
          } else if (
            itemPressed === "__item0-__switch0-1" ||
            itemPressed === "__item1-__switch1-1"
          ) {
            window.open("https://www.regestaitalia.eu/", "_blank");
          } else {
            window.open(
              "https://github.com/andrebellu/WebappRegesta",
              "_blank"
            );
          }
        },

        fnOpen: function (oEvent) {
          var oModel = new JSONModel("model/icons.json"),
            oView = this.getView();
          this.getView().setModel(oModel);

          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: oView.getId(),
              name: "regesta.regestarapportini.fragments.Options",
              controller: this,
            }).then(
              function (oPopover) {
                oView.addDependent(oPopover);
                if (Device.system.phone) {
                  oPopover.setEndButton(
                    new Button({
                      text: "Close",
                      type: "Emphasized",
                      press: this.fnClose.bind(this),
                    })
                  );
                }
                return oPopover;
              }.bind(this)
            );
          }

          var oButton = oEvent.getParameter("button");
          this._pPopover.then(function (oPopover) {
            oPopover.openBy(oButton);
          });
        },

        fnClose: function () {
          this._pPopover.then(function (oPopover) {
            oPopover.close();
          });
        },

        goToTickets: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteHome", { token: token });
        },
        goToRapportini: function (oEvent) {
          var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
          oRouter.navTo("RouteTickets", { token: token });
        },

        getCurrentDate: function () {
          var today = new Date();
          var yyyy = today.getFullYear();
          var mm = today.getMonth() + 1;
          var dd = today.getDate();

          if (dd < 10) dd = "0" + dd;
          if (mm < 10) mm = "0" + mm;

          today = dd + "/" + mm + "/" + yyyy;

          return today;
        },

        showPopup: function (oEvent) {
          const defaultBody = {
            IDRapportino: null,
            IDUtente: null,
            Utente: sessionStorage.getItem("username"),
            IDCliente: 5,
            IDCommessa: 1969,
            IDClienteSede: null,
            IDProgetto: null,
            IDProgettoAttivita: null,
            IDTodoList: null,
            Codice: null,
            Descrizione: "dute mata an cur",
            Attivita: null,
            Sede: "UF",
            Destinazione: null,
            Giorno: this.getCurrentDate(),
            Ore: 22,
            OreLavorate: null,
            Km: null,
            KmEuro: null,
            Pedaggio: null,
            Forfait: null,
            Vitto: null,
            Alloggio: null,
            Noleggio: null,
            Trasporti: null,
            Varie: null,
            Plus: false,
            Fatturabile: true,
            Bloccato: null,
            SpeseVarie: null,
            Docente: null,
          };

          var oModel = this.getView().getModel();
          oModel.setProperty("/nuovoRapportino", defaultBody);

          var source = oEvent.getSource();
          var setContext = source.setBindingContext(
            new sap.ui.model.Context(oModel, "/nuovoRapportino")
          );
          var getContext = setContext.getBindingContext();

          if (!this.pDialog) {
            this.pDialog = this.loadFragment({
              name: "regesta.regestarapportini.fragments.Popup",
            });
          }
          this.pDialog.then(function (oDialog) {
            oModel.setProperty("/nuovoRapportino", defaultBody);
            oDialog.setBindingContext(getContext);
            oDialog.open();
          });
        },

        onSave: function () {
          const defaultBody = {
            IDRapportino: null,
            IDUtente: null,
            Utente: sessionStorage.getItem("username"),
            IDCliente: 5,
            IDCommessa: 1969,
            IDClienteSede: null,
            IDProgetto: null,
            IDProgettoAttivita: null,
            IDTodoList: null,
            Codice: null,
            Descrizione: "dute mata an cur",
            Attivita: null,
            Sede: "UF",
            Destinazione: null,
            Giorno: this.getCurrentDate(),
            Ore: 22,
            OreLavorate: null,
            Km: null,
            KmEuro: null,
            Pedaggio: null,
            Forfait: null,
            Vitto: null,
            Alloggio: null,
            Noleggio: null,
            Trasporti: null,
            Varie: null,
            Plus: false,
            Fatturabile: true,
            Bloccato: null,
            SpeseVarie: null,
            Docente: null,
          };
          var nuovoRapportino = this.getView()
            .getModel()
            .getProperty("/nuovoRapportino");
          console.log(nuovoRapportino);

          // ? Chech date
          // collect input controls
          var oView = this.getView();
          var getDate = oView.byId("date");
          var bValidationError = false;

          bValidationError = this._validateGiornoInput(getDate);

          if (!bValidationError) {
            MessageToast.show("Rapportino aggiunto");

            //! API call for newRepo
            // var raw = JSON.stringify(defaultBody);

            // var requestOptions = {
            //   method: "POST",
            //   body: raw,
            //   redirect: "follow",
            // };

            // var token = sessionStorage.getItem("token");

            // token = token.replace(/"/g, "");
            // var encodedToken = encodeURIComponent(token);

            // sessionStorage.setItem("encodedToken", encodedToken);

            // fetch(
            //   sessionStorage.getItem("hostname") +
            //     "/api_v2/nuovorapportino?token=" +
            //     sessionStorage.getItem("encodedToken"),
            //   requestOptions
            // )
            //   .then((response) => response.text())
            //   .then((result) => console.log(result))
            //   .catch((error) => console.log("error", error));

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append(
              "Cookie",
              "ASP.NET_SessionId=h44eqjrap4hk2tsla2tjsbwv"
            );

            var raw = JSON.stringify(defaultBody);

            var requestOptions = {
              method: "POST",
              headers: myHeaders,
              body: raw,
              redirect: "follow",
            };

            fetch(
              sessionStorage.getItem("hostname") + "/api_v2/nuovorapportino?token=" +
              sessionStorage.getItem("encodedToken"),
              requestOptions
            )
              .then((response) => response.text())
              .then((result) => console.log(result))
              .catch((error) => console.log("error", error));

            this.byId("popup").close();
          } else {
            MessageToast.show("Inserisci i dati correttamemte");
          }
        },

        onCancel: function (oEvent) {
          this.byId("popup").close();
        },

        checkHours: function (oEvent) {
          var oButton = oEvent.getSource(),
            oView = this.getView();

          // create popover
          if (!this._pPopover) {
            this._pPopover = Fragment.load({
              id: oView.getId(),
              name: "regesta.regestarapportini.fragments.ShowHours",
              controller: this,
            }).then(function (oPopover) {
              oView.addDependent(oPopover);
              return oPopover;
            });
          }
          this._pPopover.then(function (oPopover) {
            oPopover.openBy(oButton);
          });
        },

        onGiornoChange: function (oEvent) {
          var oInput = oEvent.getSource();
          this._validateGiornoInput(oInput);
        },

        isDateInThisWeek: function(date)
        {
            const now = new Date();
            
            const weekDay = (now.getDay() + 6) % 7; // Make sure Sunday is 6, not 0
            const monthDay = now.getDate();
            const mondayThisWeek = monthDay - weekDay;
            
            const startOfThisWeek = new Date(+now);
            startOfThisWeek.setDate(mondayThisWeek);
            startOfThisWeek.setHours(0, 0, 0, 0);
            
            const startOfNextWeek = new Date(+startOfThisWeek);
            startOfNextWeek.setDate(mondayThisWeek + 5);
            
            return date >= startOfThisWeek && date < startOfNextWeek;
        },
        //! Check date input
        _validateGiornoInput: function(oInput) 
        {
            var sValueState = "None";
            var bValidationError = false;
            var oBinding = oInput.getBinding("value");

            var [gg, month, year] = oInput.getValue().split("/");
            console.log(gg, month, year);
            console.log(this.isDateInThisWeek(new Date(year, month - 1, gg)))

            var week = new Date(year, month - 1, gg).getDay();
            console.log(week);

            if(week == 0 || week == 6) 
            {
                MessageBox.information("Hai avuto il premesso di creare il rapportino durante il weekend?");

                sValueState = "Error";
                bValidationError = true;
                oInput.setValueState(sValueState);
                return bValidationError;
            }

            if(!this.isDateInThisWeek(new Date(year, month - 1, gg)))
            {
                try 
                {
                    oBinding.getType().validateValue(oInput.getValue());
                } 
                catch(oException) 
                {
                    sValueState = "Error";
                    bValidationError = true;
                }
            }

            oInput.setValueState(sValueState);
            return bValidationError;
        },
      }
    );
  }
);

sap.ui.define([
    "sap/ui/core/mvc/Controller", "sap/m/MessageToast",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, MessageToast) {
        "use strict";

        return Controller.extend("fileuploader2.controller.View1", {
            onInit: function () {
                this.dataToPush = [];
            },
            // handleUploadComplete: function(oEvent) {
            //     var sResponse = oEvent.getParameter("response"),
            //         iHttpStatusCode = parseInt(/\d{3}/.exec(sResponse)),
            //         sMessage;

            //     if (sResponse) {
            //         sMessage = iHttpStatusCode === 200 ? sResponse + " (Upload Success)" : sResponse + " (Upload Error)";
            //         MessageToast.show(sMessage);
            //     }
            // },

            // handleUploadPress: function() {
            //     var oFileUploader = this.byId("fileUploader");
            //     oFileUploader.checkFileReadable().then(function() {
            //         oFileUploader.upload();
            //     }, function(error) {
            //         MessageToast.show("The file cannot be read. It may have changed.");
            //     }).then(function() {
            //         oFileUploader.clear();
            //     });
            // },

            handleUploadPress: function (evt) {
                // try {
                // var oFileUploader = this.byId("fileUploader");
                var oFileUploader = this.getView().byId("fileUploader"), returnData = "";
                oFileUploader.upload();
                var file = jQuery.sap.domById(oFileUploader.getId() + "-fu").files[0];
                if (file.name && file.name.length > 100) {
                    sap.m.MessageToast.show("File name with extension shuld not exceel 100 characters.")
                    return;
                }
                var fileName = file.name.replace(",", ""),
                    fileType = file.type,
                    fileSize = file.size / 1024;
                debugger;
                // var type=sap.ui.getCore().byId("Sel").getSelectedItem().mProperties.text;
                this.previewFile(fileType, fileSize, fileName, file);
                var oFileUploader = this.getView().byId("fileUploader");
                oFileUploader.clear();

                // } catch (e) {
                //     // sap.m.MessageBox.warning("Please select the File");
                // }
                // var t = this;
                // t.getView().getDependents()[0].close();
                // t.getView().getDependents()[0].destroy();
            },
            previewFile: function (fileType, fileSize, fileName, file) {
                var t = this;
                debugger;
                const preview = document.querySelector('img');
                var file = file;// document.querySelector('input[type=file]').files[0];
                var reader = new FileReader();
                debugger;
                reader.addEventListener("load", function () {
                    // convert image file to base64 string

                    t.data = {
                        // ReqNo: t.ts,
                        "Filename": fileName,
                        "Mimetype": fileType,
                        "Value": reader.result,// file,
                        "size": fileSize,
                        "isCreated": true,
                        "Datestamp": new Date()

                    }
                    //   var dataToPush=[];
                    t.dataToPush.push(t.data);
                    // t.UploadedAttachmentindex.push(dataToPush);
                    // t.UploadedAttachment.push(dataToPush);

                    // if (t.getView().getModel("dashboard").getProperty("/UploadedAttachment") == undefined) {
                    //     t.getView().getModel("dashboard").setProperty("/UploadedAttachment", t.UploadedAttachment);
                    // } else if (dataToPush.ReqNo == "0000000000") {
                    //     t.getView().getModel("dashboard").setProperty("/UploadedAttachment", t.UploadedAttachment);
                    // } else {
                    //     t.getView().getModel("dashboard").getProperty("/UploadedAttachment").push(t.UploadedAttachmentindex.pop());
                    //     t.getView().getModel("dashboard").refresh(true);
                    // }

                    var oModel = new sap.ui.model.json.JSONModel();
                    oModel.setData(t.dataToPush);
                    t.getView().setModel(oModel, "Data3");

                    sap.m.MessageToast.show("Attachment Uploaded Successfully");

                }, false);

                if (file) {
                    reader.readAsDataURL(file);
                }
            },
            onPressrow: function (evt) {
                debugger;
                var oModel = this.getView().getModel("Data3").getData();
                var path = evt.oSource.oPropagatedProperties.oBindingContexts.Data3.sPath;
                var sPath = path.slice(1);
                oModel.splice(sPath, 1);
                this.getView().getModel("Data3").setData(oModel);

            },
            onFiledataDownload: function (evt) {
                debugger;
                var path = parseInt(evt.getSource().getBindingContext("Data3").getPath().slice(1));
                if (this.dataToPush.length !== 0) {
                    this.onFiledownload(path);
                }
                else if (this.dataToPush.length == 0) {
                    this.aftersubmission(path);
                }

            },


            onFiledownload: function (path) {
                debugger;
                var filecontent = this.getView().byId("idSalesTable").getModel("Data3").getData()[path].Value;
                var fileType = this.getView().byId("idSalesTable").getModel("Data3").getData()[path].Filename;
                var ftype = fileType.split('.').pop();
                const downloadlink = document.createElement("a");
                const filename = fileType;
                downloadlink.href = filecontent;
                downloadlink.download = filename;
                downloadlink.click();
            }

        });
    });

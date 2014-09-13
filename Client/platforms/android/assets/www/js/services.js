/// <reference path="services.js" />
/// <reference path="services.js" />
var services = angular.module('solvy.services', [])
     .constant("IP", "54.72.160.154")
    //.constant("IP", "localhost")
     .service("Utils", function ($q, $http) {

         this.uploadToS3 = function (imageURI, fileName) {

             var deferred = $q.defer();
             ft = new FileTransfer(),
             options = new FileUploadOptions();

             options.fileKey = "file";
             options.fileName = fileName;
             options.mimeType = "image/jpeg";
             options.chunkedMode = false;

             $http({
                 url: "http://" + IP + "/SignImage",
                 method: "POST",
                 data: "data=" + JSON.stringify({ fileName: fileName }),
                 headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
             })
                 .then(function (data) {
                     options.params = {
                         "key": fileName,
                         "AWSAccessKeyId": data.awsKey,
                         "acl": "public-read",
                         "policy": data.policy,
                         "signature": data.signature,
                         "Content-Type": "image/jpeg"
                     };

                     ft.upload(imageURI, "https://" + data.bucket + ".s3.amazonaws.com/",
                         function (e) {
                             deferred.resolve(e);
                         },
                         function (e) {
                             console.log("Upload failed " + JSON.stringify(e));
                             deferred.reject(e);
                         }, options);

                 })
                 .fail(function (error) {
                     console.log(JSON.stringify(error));
                 });

             return deferred.promise();
         }
     });
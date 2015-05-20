(function(){
    'use strict';
    angular.module('angular-guillotine-demo')
        .controller('MainCtrl', function () {
            var self = this;

            this.image = null;
            this.croppedImage = null;
            this.onFileSelect = function($files) {
                var file = $files[0];
                var reader = new FileReader();
                reader.onload = function (evt) {
                    //self.imageAdjust(evt.target.result,file);
                    self.image = evt.target.result;
                };
                reader.readAsDataURL($files[0]);
            };
        });
})();
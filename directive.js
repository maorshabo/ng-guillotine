(function (angular, undefined) {
    'use strict';

    var module = angular.module('guillotine', []);
    module.directive('ngGuillotine', ['$parse',function ($parse) {
        var supportsCanvas = document.createElement('canvas');
        supportsCanvas = !!(supportsCanvas.getContext && supportsCanvas.getContext('2d'));
        var TO_RADIANS = Math.PI/180;
        var canvas,ctx;
        var sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight;

        return {
            restrict: 'EA',
            replace: true,
            scope: {
                image: '=',
                resultImage: '='
            },
            templateUrl: 'components/angular-guillotine/template.html',
            link: function ($scope, elem, attrs) {
                var $ = jQuery;
                var element = $(elem).find('.gulliotineCropImage');

                var defaultOptions = {
                    width: 250,
                    height: 250,
                    init: { scale: 1  },
                    onChange: imageChange
                };
                var options = angular.extend({}, defaultOptions, $scope.$eval(attrs.ngGuillotine));
                var croppedData;
                $scope.rotateLeft = function() {
                    element.guillotine('rotateLeft');
                };
                $scope.rotateRight = function() {
                    element.guillotine('rotateRight');
                };
                $scope.fitImage = function() {
                    element.guillotine('fit');
                };
                $scope.zoomIn = function() {
                    element.guillotine('zoomIn');
                };
                $scope.zoomOut = function() {
                    element.guillotine('zoomOut');
                };

                // set frame size
                $(elem).find('.frame').css('width',options.width);

                $scope.$watch('image',function(newSource) {
                    if (newSource) {
                        element.attr("src",newSource);
                        // first remove the guillotine instance
                        element.guillotine('remove');
                        // then init it
                        element.guillotine(options);
                        $scope.fitImage();
                    }
                });

                function imageChange(data,action) {
                    // put in the result-image the cropped image
                    $scope.resultImage = getCropImage(data);
                }

                function getCropImage(data) {
                    if(!supportsCanvas) {
                        // return an empty string for browsers that don't support canvas.
                        // this allows it to fail gracefully.
                        return false;
                    }
                    canvas = document.createElement('canvas');
                    ctx = canvas.getContext('2d');
                    canvas.width = options.width;
                    canvas.height = options.height;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    sx = data.x / data.scale;
                    sy = data.y / data.scale;
                    sWidth = data.w / data.scale;
                    sHeight = data.h  / data.scale;
                    dx = -canvas.width/2;
                    dy = -canvas.height/2;
                    dWidth = data.w;
                    dHeight = data.h;
                    drawRotated(data);
                    return canvas.toDataURL();
                }

                function drawRotated(data){
                    ctx.clearRect(0,0,canvas.width,canvas.height);

                    // save the unrotated context of the canvas so we can restore it later
                    // the alternative is to untranslate & unrotate after drawing
                    ctx.save();

                    // move to the center of the canvas
                    ctx.translate(canvas.width/2,canvas.height/2);

                    // rotate the canvas to the specified degrees
                    ctx.rotate(data.angle*Math.PI/180);

                    // draw the image
                    // since the context is rotated, the image will be rotated also
                    ctx.drawImage(element[0],sx,sy,sWidth, sHeight,dx,dy, dWidth, dHeight);

                    // we’re done with the rotating so restore the unrotated context
                    ctx.restore();
                }
            }
        };
    }]);
})(angular);

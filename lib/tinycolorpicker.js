;(function(window, undefined)
{
    "use strict";

    function extend()
    {
        for(var i=1; i < arguments.length; i++)
        {
            for(var key in arguments[i])
            {
                if(arguments[i].hasOwnProperty(key))
                {
                    arguments[0][key] = arguments[i][key];
                }
            }
        }
        return arguments[0];
    }

    var pluginName = "tinycolorpicker"
    ,   defaults   =
        {
            backgroundUrl : null
        }
    ;

    function Plugin($container, options)
    {
        this.options   = extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;

        var self          = this
        ,   $track        = $container.querySelectorAll(".track")[0]
        ,   $color        = $container.querySelectorAll(".color")[0]
        ,   $colorInner   = $container.querySelectorAll(".colorInner")[0]
        ,   $canvas       = null
        ,   $colorInput   = $container.querySelectorAll(".colorInput")[0]

        ,   context      = null
        ,   mouseIsDown  = false
        ,   hasCanvas    = !!document.createElement("canvas").getContext
        ,   touchEvents  = "ontouchstart" in document.documentElement
        ,   changeEvent  = document.createEvent("HTMLEvents")
        ;

        changeEvent.initEvent("change", true, true);

        this.colorHex = "";
        this.colorRGB = "";

        function initialize()
        {
            if(hasCanvas)
            {
                $canvas = document.createElement( "canvas" );
                $track.appendChild( $canvas );

                context = $canvas.getContext( "2d" );

                setImage();
            }

            setEvents();

            return self;
        }

        function setImage()
        {
            var colorPicker   = new Image()
            ,   style         = $track.currentStyle || window.getComputedStyle($track, false)
            ,   backgroundUrl = style.backgroundImage.replace(/"/g, "").replace(/url\(|\)$/ig, "")
            ;

            $track.style.backgroundImage = "none";

            colorPicker.onload = function()
            {
                $canvas.width = this.width;
                $canvas.height = this.height;

                context.drawImage(colorPicker, 0, 0, this.width, this.height);
            };

            colorPicker.src = self.options.backgroundUrl || backgroundUrl;
        }

        function setEvents()
        {
            var eventType   = touchEvents ? "touchstart" : "mousedown"
            ;

            if(hasCanvas)
            {
                $color["on" + eventType] = function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    $track.style.display = 'block';

                    document.onmousedown = function(event)
                    {
                        document.onmousedown = null;

                        $track.style.display = 'none';
                    };
                };

                if(!touchEvents)
                {
                    $canvas.onmousedown = function(event)
                    {
                        event.preventDefault();
                        event.stopPropagation();

                        mouseIsDown = true;

                        getColorCanvas(event);

                        document.onmouseup = function(event)
                        {
                            mouseIsDown = false;

                            document.onmouseup = null;

                            $track.style.display = 'none';

                            return false;
                        };
                    };

                    $canvas.onmousemove = getColorCanvas;
                }
                else
                {
                    $canvas.ontouchstart = function(event)
                    {
                        mouseIsDown = true;

                        getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    };

                    $canvas.ontouchmove = function(event)
                    {
                        getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    };

                    $canvas.ontouchend = function(event)
                    {
                        mouseIsDown = false;

                        $track.style.display = 'none';

                        return false;
                    };
                }
            }
        }

        function getColorCanvas(event)
        {
            if(mouseIsDown)
            {
                var offset    = event.target.getBoundingClientRect()
                ,   colorData = context.getImageData(event.clientX - offset.left, event.clientY - offset.top, 1, 1).data
                ;

                self.setColor("rgb(" + colorData[0] + "," + colorData[1] + "," + colorData[2] + ")");

                $container.dispatchEvent(changeEvent, [self.colorHex, self.colorRGB]);
            }
        }

        this.setColor = function(color)
        {
            if(color.indexOf("#") >= 0)
            {
                self.colorHex = color;
                self.colorRGB = self.hexToRgb(self.colorHex);
            }
            else
            {
                self.colorRGB = color;
                self.colorHex = self.rgbToHex(self.colorRGB);
            }

            $colorInner.style.backgroundColor = self.colorHex;
            $colorInput.value = self.colorHex;
        };

        this.hexToRgb = function(hex)
        {
            var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

            return "rgb(" + parseInt(result[1], 16) + "," + parseInt(result[2], 16) + "," + parseInt(result[3], 16) + ")";
        };

        this.rgbToHex = function(rgb)
        {
            var result = rgb.match(/\d+/g);

            function hex(x)
            {
                var digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
                return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
            }

            return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
        };

       return initialize();
    }

    var tinycolorpicker = function($container, options)
    {
        return new Plugin($container, options);
    };

    if(typeof define == 'function' && define.amd)
    {
        define(function(){ return tinycolorpicker; });
    }
    else if(typeof module === 'object' && module.exports)
    {
        module.exports = tinycolorpicker;
    }
    else
    {
        window.tinycolorpicker = tinycolorpicker;
    }
})(window);
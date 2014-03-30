;(function (factory)
{
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object')
    {
        // Node/CommonJS
        factory(require('jquery'));
    } else
    {
        // Browser globals
        factory(jQuery);
    }
}(function ($)
{
    var pluginName = "tinycolorpicker"
    ,   defaults   =
        {
            colors : ["#ffffff", "#A7194B","#FE2712","#FB9902","#FABC02","#FEFE33","#D0EA2B","#66B032","#0391CE","#0247FE","#3D01A5","#8601AF"]
        ,   backgroundUrl : null
        }
    ;

    function Plugin($container, options)
    {
        this.options   = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name     = pluginName;

        var self          = this
        ,   $track        = $container.find(".track")
        ,   $color        = $container.find(".color")
        ,   $canvas       = null
        ,   $colorInput   = $container.find(".colorInput")
        ,   $dropdown     = $container.find(".dropdown")
        ,   $dropdownItem = $dropdown.find("li").remove()

        ,   context      = null
        ,   mouseIsDown  = false
        ,   hasCanvas    = !!document.createElement("canvas").getContext
        ,   touchEvents  = "ontouchstart" in document.documentElement
        ;

        this.colorHex = "";
        this.colorRGB = "";

        function initialize()
        {
            if(hasCanvas)
            {
                $canvas = $("<canvas></canvas>");
                $track.append($canvas);

                context = $canvas[0].getContext( "2d" );

                setImage();
            }
            else
            {
                $.each(self.options.colors, function(index, color)
                {
                    var $clone = $dropdownItem.clone();

                    $clone.css("backgroundColor", color);
                    $clone.attr("data-color", color);

                    $dropdown.append($clone);
                });
            }

            setEvents();

            return self;
        }

        function setImage()
        {
            var colorPicker   = new Image()
            ,   backgroundUrl = $track.css("background-image").replace(/"/g, "").replace(/url\(|\)$/ig, "")
            ;

            $track.css("background-image", "none");

            $(colorPicker).load(function()
            {
                $canvas.attr("width", this.width);
                $canvas.attr("height", this.height);

                context.drawImage(colorPicker, 0, 0, this.width, this.height);
            });

            colorPicker.src = self.options.backgroundUrl || backgroundUrl;
        }

        function setEvents()
        {
            var _self       = this
            ,   eventType   = touchEvents ? "touchstart" : "mousedown"
            ;

            if(hasCanvas)
            {
                $color.bind(eventType, function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    $track.toggle();

                    $(document).bind("mousedown.colorpicker", function(event)
                    {
                        $(document).unbind(".colorpicker");

                        $track.hide();
                    });
                });

                if(!touchEvents)
                {
                    $canvas.mousedown(function(event)
                    {
                        mouseIsDown = true;

                        getColorCanvas(event);

                        $(document).bind("mouseup.colorpicker", function(event)
                        {
                            mouseIsDown = false;

                            $(document).unbind(".colorpicker");

                            $track.hide();

                            return false;
                        });

                        return false;
                    });

                    $canvas.mousemove(getColorCanvas);
                }
                else
                {
                    $canvas.bind("touchstart", function(event)
                    {
                        mouseIsDown = true;

                        getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchmove", function(event)
                    {
                        getColorCanvas(event.originalEvent.touches[0]);

                        return false;
                    });

                    $canvas.bind("touchend", function(event)
                    {
                        mouseIsDown = false;

                        $track.hide();

                        return false;
                    });
                }
            }
            else
            {
                $color.bind("mousedown", function(event)
                {
                    event.preventDefault();
                    event.stopPropagation();

                    $dropdown.toggle();
                });

                $dropdown.delegate("li", "mousedown", function(event)
                {
                    event.preventDefault();
                    event.stopImmediatePropagation();

                    var color = $(this).attr("data-color");

                    self.setColor(color);

                    $dropdown.hide();
                });
            }
        }

        function getColorCanvas(event)
        {
            if(mouseIsDown)
            {
                var $target   = $(event.target)
                ,   offset    = $target.offset()
                ,   colorData = context.getImageData(event.pageX - offset.left, event.pageY - offset.top, 1, 1).data
                ;

                self.setColor("rgb(" + colorData[0] + "," + colorData[1] + "," + colorData[2] + ")");

                $container.trigger("change", [self.colorHex, self.colorRGB]);
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

            $color.find(".colorInner").css("backgroundColor", self.colorHex);
            $colorInput.val(self.colorHex);
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
                digits = new Array("0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F");
                return isNaN(x) ? "00" : digits[(x - x % 16 ) / 16] + digits[x % 16];
            }

            return "#" + hex(result[0]) + hex(result[1]) + hex(result[2]);
        };

       return initialize();
    }

    $.fn[pluginName] = function(options)
    {
        return this.each(function()
        {
            if(!$.data(this, "plugin_" + pluginName))
            {
                $.data(this, "plugin_" + pluginName, new Plugin($(this), options));
            }
        });
    };
}));
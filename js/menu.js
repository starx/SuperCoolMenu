/**
 * Menu Plugin
 * 
 * COPYRIGHT RESERVED TO Nabin Nepal (Starx) http://mrnepal.com
 * 
 * Once the full payment is made, then ONLY the buyer will have the copyright.
 */


;jQuery(function($) {
    
    //Library Function of the menu
    menuLib = {
        'animEnd': 'webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend',
        'hasAnimation': null,
        /*
         * Detects if CSS animations is possible using Modernizr Libraries
         * @returns {Boolean}
         */
        'detectAnimation' : function() {
            if(!window.Modernizr) return false; // Fail Safe return
            if(menuLib.hasAnimation === null) {
                modernizr = window.Modernizr;
                menuLib.hasAnimation = modernizr.cssanimations && modernizr.csstransitions;
            }
            return menuLib.hasAnimation;
        },
        /*
         * Set of jQuery Based animations
         */
        'animations': {
            'slideFadeDown': function(el, down, callback) {
                callback = callback || function() { };                
                el.animate({
                   'opacity': '0',
                   'marginTop': down+'px'
                }, 400, callback);                
            },
            'slideFadeinUp' : function(el, callback) {
                callback = callback || function() { };                
                el.animate({
                   'opacity': '1',
                   'marginTop': '0px'
                }, 400, callback);                
            },
            'slideFadeLeft' : function(el, opacity, left, callback) {
                callback = callback || function() { };
                el.animate({
                   'opacity': opacity,
                   'left': left+'px'
                }, 400, callback);
            },
            'slideFadeinLeft' : function(el, left, callback) {
                menuLib.animations.slideFadeLeft(el, 1, left, callback);
            },
            'slideFadeoutLeft' : function(el, left, callback) {
                menuLib.animations.slideFadeLeft(el, 0, left, callback);
            }
                    
        },
        /*
         * Generates a random ID to assign to a menuItem
         * 
         * @returns {integer}
         */
        'genId': function() {
            return 10000 + Math.floor( Math.random() * 90001 );
        },
        /*
         * Initializes the submenus for the first time. Set their position and place them in the outer structure
         * @param {type} menuContainer
         * @param {type} transition
         */
        'initSubList': function(menuContainer, transition) {
            
            menuLib.resetSubListPosition(menuContainer, transition);
            $("ul.sub", menuContainer).appendTo(menuContainer); //Move the sublists to the outer Layer
        },
        /*
         * Places the sub menus in appropriate position for each effect
         * 
         * @param {jQuery Selector} menuContainer
         * @param {string} transition
         */
        'resetSubListPosition': function(menuContainer, transition) {
            sublists = $("ul.sub", menuContainer);
            sublists.removeAttr('style');
            switch(transition) {
                case "slide-fade-left": case "inside-slide-fade-left":
                    sublists.css({ 
                        'marginTop': '0',
                        'left' : menuContainer.width(),
                        'opacity': '0',
                        'display': 'none'
                    })
                break; 
                case "set3": case "set4": case "set5":
                    sublists.css({ 
                        'marginTop': '0',
                        'left' : '0',
                        'display': 'none'
                    })    
                break;
            }            
        },
        /*
         * Reset the Menu Position
         * 
         * @param {jQuery Selector} menuContainer
         * @param {string} transition
         */
        'resetMenu': function(menuContainer, transition) {
            $("ul:first", menuContainer).css({
                'left': '0',
                'marginTop': '20px',
                'opacity': '0',
                'display': 'none',
                'color': '#000'
            });
            menuLib.resetSubListPosition(menuContainer, transition);
            
        },
        'menu' : {
            /**
             * Open the menu
             * 
             * @param {jQuery Selector} menu
             * @param {JS Object} settings
             */
            'open': function(menu, settings) {
                icon = menu.find('.icon');
                main_ul = icon.siblings('ul:first');
                menuLib.animations.slideFadeinUp(main_ul.show().addClass('active'));
                menu.animate({ 'height' : main_ul.height() + icon.outerHeight() }); //Animate the menu to the new height
                
                //Set the Menu's status to opened
                settings.status = 'opened';                
            },
            /**
             * Close the menu
             * 
             * @param {jQuery Selector} menu
             * @param {JS Object} settings
             */
            'close': function(menu, settings) {
                icon = menu.find('.icon');  
                menuLib.animations.slideFadeDown($("ul.active", menu).removeClass('active'), 20, function() {
                    menuLib.resetMenu($('.'+ settings.menuClass), settings.transition);
                });
                menu.animate({'height': icon.outerHeight() });
                
                //Set the Menu's status to closed
                settings.status = 'closed';
            }
        },
        /**
         * Go to the sub menu
         * 
         * @param {jQuery Selector} subElement
         * @param {jQuery Selector} mainElement
         * @param {jQuery Selector} container
         * @param {string} transition
         */
        'goToSub': function(subElement, mainElement, container, transition) {
            $('.active').removeClass('active');
            $menu = mainElement.closest(container);
            if(!menuLib.detectAnimation()) {
                //Fallback Animation for all demos in unsupporting browser
                switch(transition) {
                  case "slide-fade-left": case "inside-slide-fade-left": case "set3": case "set4": case "set5":
                        menuLib.animations.slideFadeoutLeft(mainElement, "-"+$menu.width());
                        menuLib.animations.slideFadeinLeft(subElement.show().addClass('active'), '0');
                  break;
                }
            } else {
                //Animations Supported
                switch(transition) {
                    case "slide-fade-left":                    
                        menuLib.animations.slideFadeoutLeft(mainElement, "-"+$menu.width());
                        menuLib.animations.slideFadeinLeft(subElement.show().addClass('active'), '0');
                    break;
                    case "inside-slide-fade-left":
                        mainElement.show().addClass('inside-slide-fade-left-animation');
                        menuLib.animations.slideFadeinLeft(subElement.show().addClass('active'), '0', function() {
                            mainElement.removeClass('inside-slide-fade-left-animation').hide();
                        });
                    break;
                    case "set3":
                        mainElement.addClass('fade-out-scale-down-animation');
                        menuLib.hideAfterTransition(mainElement);
                        subElement.show().addClass('fade-in-rise-up-animation active');
                    break;
                    case "set4":
                        mainElement.addClass('fade-out-rising-up-animation');
                        menuLib.hideAfterTransition(mainElement);
                        subElement.show().addClass('fade-in-rising-up-animation active');
                    break;
                    case "set5":
                        mainElement.addClass('fade-out-fall-down-animation');
                        menuLib.hideAfterTransition(mainElement);
                        subElement.show().addClass('fade-in-falling-down-animation active');                    
                    break;
                }
            }
            
            //Animate the menu to the new height of the menu
            $menu.animate({
                'height' : subElement.height() + $('.icon', $menu).outerHeight()
            });			
            
        },
        'goToMain': function (subElement, mainElement, container, transition) {
            $('.active').removeClass('active');
            $menu = subElement.closest(container);
            if(!menuLib.detectAnimation()) {
                //Fallback animation for those who dont support animation
                switch(transition) {
                    case "slide-fade-left": case "inside-slide-fade-left": case "set3": case "set4": case "set5":
                        menuLib.animations.slideFadeinLeft(mainElement.show().addClass('active'), "0");
                        menuLib.animations.slideFadeoutLeft(subElement, $menu.width());
                    break;
                }
            } else {
                //Animations Supported
                switch(transition) {
                    case "slide-fade-left":
                        menuLib.animations.slideFadeinLeft(mainElement.show().addClass('active'), "0");
                        menuLib.animations.slideFadeoutLeft(subElement, $menu.width());
                    break;
                    case "inside-slide-fade-left":
                        mainElement.show().addClass('inside-slide-fade-left-out-animation active');
                        menuLib.animations.slideFadeoutLeft(subElement, $menu.width(), function() {
                            mainElement.removeClass('inside-slide-fade-left-out-animation');
                        });
                    break;
                    case "set3":
                        mainElement.show().addClass('fade-in-scale-up-animation active');                    
                        subElement.addClass('fade-out-fall-down-animation');
                        menuLib.hideAfterTransition(subElement);              
                    break;
                    case "set4":
                        mainElement.show().addClass('fade-in-falling-down-animation active');                    
                        subElement.addClass('fade-out-fall-down2-animation');
                        menuLib.hideAfterTransition(subElement);              
                    break;
                    case "set5":
                        mainElement.show().addClass('fade-in-rising-up-animation active');                    
                        subElement.addClass('fade-out-rising-up-animation');
                        menuLib.hideAfterTransition(subElement);  
                    break; 
                }
            }
            
            //Animate the menu to the new height of the menu
            $menu.animate({
                'height' : mainElement.height() + $('.icon', $menu).outerHeight()
            });
        },
        /*
         * Helper function to hide a element once animation finishes
         * @param {jQuery Selector} element
         */
        'hideAfterTransition': function(element) {
            element.on(menuLib.animEnd, function() {
                $(this).hide().off(menuLib.animEnd);
            });
        }
    };
    
    $.fn.menu = function(options){
        
        //Extend the options provided with default options
        var settings = $.extend({
            'mode' : 'icon',
            'menuClass' : 'menu',
            'theme': 'default',
            'transition': 'slide-fade-left',
            'status': 'closed'
        }, options);

        // Event Handlers        -
        
        //Resize Handler
        $(window).on('resize', function() {
            $('.'+settings.menuClass).each(function() {
                $(this).width($(this).parent().innerWidth());
            });
        });
        
        /**
         * Click hanndler when the icon is clicked
         * 
         * @param {Event Object} e
         */
        $('body').on('click', '.'+settings.menuClass + ' .icon', function(e) {
            e.stopPropagation();            
            $menu = $(this).closest('.' + settings.menuClass);
            
            if(settings.status === 'closed') {
                menuLib.menu.open($menu, settings);       
            } else {
                menuLib.menu.close($menu, settings);
            }
        });
        
        $('body').on('click', function() {
            menuLib.menu.close($('.'+ settings.menuClass), settings);
        });
       
        /**
         * Sub Menu on click Handler
         * 
         * @param {Event Object} e
         */
        $('body').on('click', '.'+settings.menuClass + ' ul > li', function(e) {
            e.stopPropagation();
            if($(this).data('sub')) {
                menuLib.goToSub($("#s"+$(this).data('sub')), $(this).parent('ul'), "."+settings.menuClass, settings.transition);                
            }
        });
        
        /**
         * Previous Button on click handler
         * 
         * @param {Event Object} e
         */
        $('body').on('click', '.'+settings.menuClass + ' .previous', function(e) {
             
           if($('a', $(this)).data('main')) {                
                menuLib.goToMain($(this).parent('ul'), $("#m"+$('a', $(this)).data('main')).parent('ul'), "."+settings.menuClass, settings.transition);
            }
        });
        
        /**
         * Global event handler for animation end
         */
        $('body').on(menuLib.animEnd, '.'+settings.menuClass + ' ul', function() {
            c = ''; //Temp class Variable
            if($(this).hasClass('active')) c = 'active';
            if($(this).hasClass('sub')) c = c.length > 1 ? c + ' sub' : 'sub';
            $(this).attr('class', c);
        });
        
        /**
         * Menu Processing
         */
        return $(this).each(function() {
            var menu = this; //Helper variable if needed [Not needed till now]
            var $m = $(this);
            
            $m
                // Add the Menu Class and Theme
                .attr({ 'class': settings.menuClass + " theme-" + settings.theme }) 
                //Auto adjust to the Container's space 
                .css({ 'width': $m.parent().innerWidth() }); 
            
            /*
             * Takes out all the submenu and places them in the outside container
             */
            $("ul > li", $m).each(function() {
               if($("li", $(this)).size() > 0) {
                    $("<span class=\"sub\"></span>").insertAfter($(this).children("a"));
                   
                    divId = menuLib.genId(); //Generate a unique id for the menu
                    subList = $(this).children('ul');
                    subList.attr({ 'class' : 'sub', 'id': 's'+divId})
                        .prepend("<li class='previous'><a data-main=\""+ divId +"\" href=\"#\">Previous</a></li>"); //Add a link to previous Element
                    /**
                     * Give the current list an Unique ID and define its sub list as data attribute
                     */
                    $(this).attr({ 'id' : 'm'+divId, 'data-sub':  divId});
                    
                   
               } 
            });
            
            //Initialize the Sub Lists
            menuLib.initSubList($m, settings.transition);
            
            // Place the Main list a little below
            $m.children('ul:first').css({
                'marginTop': '20px',
                'display': 'none'
            });
            
        });        
        
    };
    
});
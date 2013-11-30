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
        'menuClass': '',
        'resizeHander' : function(menuClass) {
            // In case of static width neesd to be provided
            
            $('.'+menuClass).each(function() {
                $(this).width($(this).parent().innerWidth());
            });
        },
        'genId': function() {
            return 10000 + Math.floor( Math.random() * 90001 );
        },
        'initSubList': function(menuContainer, transition) {
            
            menuLib.resetSubListPosition(menuContainer, transition);
            sublists
                .appendTo(menuContainer); //Move the element to the outer Layer
        },
        'resetSubListPosition': function(menuContainer, transition) {
            sublists = $("ul.sub", menuContainer);
            switch(transition) {
                case "slide-fade-left": case "inside-slide-fade-left":
                    sublists.css({ 
                        'marginTop': '0',
                        'left' : menuContainer.width(),
                        'opacity': '0'
                    })
                break; 
                case "set3": 
                    sublists.css({ 
                        'marginTop': '0',
                        'left' : '0',
                        'opacity': '0'
                    })    
                break;
            }            
        },
        'resetMenu': function(menuContainer, transition) {
            $("ul:first", menuContainer).css({
                'left': '0',
                'marginTop': '20px',
                'opacity': '0'
            });
            menuLib.resetSubListPosition(menuContainer, transition);
            
        },
        'goToSub': function(subElement, mainElement, container, transition) {
            $('.active').removeClass('active');
            $menu = mainElement.closest(container);
            switch(transition) {
                case "slide-fade-left":
                    mainElement.animate({
                        'left': '-' + $menu.width()+'px',
                        'opacity': 0
                    });
                    subElement.show().animate({
                        'left' : '0px',
                        'opacity': 1
                    }).addClass('active');
					
                break;
                case "inside-slide-fade-left":
                    mainElement.show().addClass('inside-slide-fade-left-animation');
                    subElement.show().animate({
                        'left' : '0px',
                        'opacity': 1
                    }, function() { mainElement.removeClass('inside-slide-fade-left-animation').hide(); }).addClass('active');
                break;
                case "set3":
                    mainElement.addClass('fade-out-scale-down-animation').css('opacity', 0);
                    subElement.show().addClass('fade-in-rise-up-animation active').css('opacity', 1);
                break;
            }
            $menu.animate({
                'height' : subElement.height() + $('.icon', $menu).outerHeight()
            });			
            
        },
        'goToMain': function (subElement, mainElement, container, transition) {
            $('.active').removeClass('active');
            $menu = subElement.closest(container);
            switch(transition) {
                case "slide-fade-left":
                    subElement.animate({
                        'left': $menu.width()+'px',
                        'opacity': 0
                    });  
                    mainElement.animate({
                        'left' : 0,
                        'opacity': 1
                    }).addClass('active');
                break;
                case "inside-slide-fade-left":
                    mainElement.show().addClass('inside-slide-fade-left-out-animation active');
                    subElement.show().animate({
                        'left': $menu.width()+'px',
                        'opacity': 0
                    }); //, function() { mainElement.removeClass('inside-slide-fade-left-out-animation'); });
					
                break;
                case "set3":
                    mainElement.addClass('fade-in-scale-up-animation active'); //.css('opacity', 1);
                    mainElement.on('webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend', function() {
                        $(this).css('display', 'hone');
                        
                    })
                    subElement.addClass('fade-out-fall-down-animation'); //.css('opacity', 0);
                    
                break;
            }
            $menu.animate({
                'height' : mainElement.height() + $('.icon', $menu).outerHeight()
            });
        }
    }
    
    $.fn.menu = function(options){
        //Extend the options provided with default options
        var settings = $.extend({
            'mode' : 'icon',
            'menuClass' : 'menu',
            'theme': 'default',
            'transition': 'slide-fade-left',
            'status': 'closed'
        }, options);
        
        // Event Handlers        
        $(window).on('resize', function() {
            menuLib.resizeHander(settings.menuClass);        
        });
        
        $('body').on('click', '.'+settings.menuClass + ' .icon', function() {
            
            main_ul = $(this).siblings('ul:first');
            $menu = $(this).closest('.' + settings.menuClass);
            iconHeight = $(this).outerHeight();
            
            if(settings.status === 'closed') {
                main_ul.css({ 'opacity' : 0}).show();
                main_ul.animate({
                   'opacity': '1',
                   'marginTop': '0'
                }, 200).addClass('active');
				
                $menu.animate({
                    'height' : main_ul.height() + iconHeight
                });
                //Set the Menu's status to opened
                settings.status = 'opened';
            } else {
				
                $("ul.active", $menu).removeClass('active').animate({
                   'opacity': '0',
                   'marginTop': '20px'
                }, 200, function() {
                    menuLib.resetMenu($('.'+ settings.menuClass), settings.transition);
                });
                $menu.animate({
                    'height' : iconHeight
                });
                //Set the menu's status to closed
                settings.status = 'closed';
            }
        });
        
        $('body').on('click', '.'+settings.menuClass + ' ul > li', function() {
            if($(this).data('sub')) {
                menuLib.goToSub($("#s"+$(this).data('sub')), $(this).parent('ul'), "."+settings.menuClass, settings.transition);                
            }
        });
        
        $('body').on('click', '.'+settings.menuClass + ' .previous', function() {
            if($('a', $(this)).data('main')) {                
                menuLib.goToMain($(this).parent('ul'), $("#m"+$('a', $(this)).data('main')).parent('ul'), "."+settings.menuClass, settings.transition);
            }
        });
        
        $('body').on('webkitAnimationEnd oAnimationEnd MSAnimationEnd animationend', '.'+settings.menuClass + ' ul', function() {
            c = '';
            if($(this).hasClass('active')) c = 'active';
            if($(this).hasClass('sub')) c = c.length > 1 ? c + ' sub' : 'sub';
            $(this).attr('class', c);
        });
        
        // Menu Processing
        return $(this).each(function() {
            var menu = this;
            var $m = $(this);
			
            $m.attr({
                'class': settings.menuClass + " theme-" + settings.theme
            });
            $m.css({
                'width': $m.parent().innerWidth() //Auto adjust to the Container's space 
            });
            
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
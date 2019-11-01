$(document).ready(function () {
    "use strict";

    var window_width = $(window).width(),
        window_height = $(window).height(),
        header_height = $(".default-header").height(),
        header_height_static = $(".site-header.static").outerHeight(),
        fitscreen = window_height - header_height;


    $(".fullscreen").css("height", window_height);
    $(".fitscreen").css("height", fitscreen);

    var mouseStartX,mouseStartY;
    var mouseX, mouseY;
    var dragStamp = 0;

    $(document).on("dragover", function(event){
        mouseX = event.originalEvent.clientX;
        mouseY = event.originalEvent.clientY;
    });

    var $banner=$("#banner-logo");
    $banner.on('dragstart',function(event){
        var img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';

        mouseStartX=event.originalEvent.clientX;
        mouseStartY=event.originalEvent.clientY;

        event.originalEvent.dataTransfer.setDragImage(img, 0, 0);
        dragStamp=event.originalEvent.timeStamp;

        $banner.append('<div id="logo-filler"><img src="/img/nyancat.gif"></img><audio src="/nyan.mp3" autoplay></audio></div>');
    }).on('drag',function(event){
        $banner.css({ 'transform': 'translate(-' + (mouseStartX - mouseX) + 'px)' });
        dragStamp=event.originalEvent.timeStamp;
    }).on('dragend',function(event){
        $banner.css({'transform':'translate(0px)'});
        $banner.find('#logo-filler').remove();
    });

    new WOW({
        boxClass:     'wow',    
        animateClass: 'animated',
        offset:       5,        
        mobile:       false,
        live:         false
    }).init();

    $('.img-pop-up').magnificPopup({
        type: 'image',
        gallery: {
            enabled: true
        }
    });

    $('.play-btn').magnificPopup({
        type: 'iframe',
        mainClass: 'mfp-fade',
        removalDelay: 160,
        preloader: false,
        fixedContentPos: false
    });


    // Initiate superfish on nav menu
    $('.nav-menu').superfish({
        animation: {
            opacity: 'show'
        },
        speed: 400
    });

    // Mobile Navigation
    if ($('.nav-menu-container').length) {
        $('#header .container').append('<div id="mobile-nav"></div>');
        $('.nav-menu-container').each(function(){
            $(this).children().each(function(){
                $(this).clone().appendTo('#mobile-nav');
            });
        });
        var $mobile_nav=$("#mobile-nav");
        $mobile_nav.find('> ul').attr({
            'class': '',
            'id': ''
        });
        $('body').append($mobile_nav);
        $('body').prepend('<button type="button" id="mobile-nav-toggle"><i class="lnr lnr-menu"></i></button>');
        $('body').append('<div id="mobile-body-overly"></div>');
        $('#mobile-nav').find('.menu-has-children').prepend('<i class="lnr lnr-chevron-down"></i>');

        $(document).on('click', '.menu-has-children i', function (e) {
            $(this).next().toggleClass('menu-item-active');
            $(this).nextAll('ul').eq(0).slideToggle();
            $(this).toggleClass("lnr-chevron-up lnr-chevron-down");
        });

        $(document).on('click', '#mobile-nav-toggle', function (e) {
            $('body').toggleClass('mobile-nav-active');
            $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
            $('#mobile-body-overly').toggle();
        });

        $(document).click(function (e) {
            var container = $("#mobile-nav, #mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-cross lnr-menu');
                    $('#mobile-body-overly').fadeOut();
                }
            }
        });
    } else if ($("#mobile-nav, #mobile-nav-toggle").length) {
        $("#mobile-nav, #mobile-nav-toggle").hide();
    }

    // Smooth scroll for the menu and links with .scrollto classes
    $('.nav-menu a, #mobile-nav a, .scrollto').on('click', function () {
        if ( (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') || ((location.pathname.replace(/^\//, '') == 'index.html')&&(this.pathname=='/')))&& location.hostname == this.hostname) {
            var target = $(this.hash);
            if (target.length) {
                var top_space = 0;

                if ($('#header').length) {
                    top_space = $('#header').outerHeight();

                    if (!$('#header').hasClass('header-fixed')) {
                        top_space = top_space;
                    }
                }

                $('html, body').animate({
                    scrollTop: target.offset().top - top_space
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu').length) {
                    $('.nav-menu .menu-active').removeClass('menu-active');
                    $(this).closest('li').addClass('menu-active');
                }

                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('#mobile-nav-toggle i').toggleClass('lnr-times lnr-bars');
                    $('#mobile-body-overly').fadeOut();
                }
                return false;
            }
        }
    });


    $('html, body').hide();
    if (window.location.hash) {
        setTimeout(function () {
            $('html, body').scrollTop(0).show();
            $('html, body').animate({
                scrollTop: $(window.location.hash).offset().top - 62
            }, 1000)
        }, 0);
    } else {
        $('html, body').show();
    }

    // Header scroll class
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
        }
    });
});

$(document).on('change', ':file', function() {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);

    $(this).parent().find('.custom-file-label').html(label);
});
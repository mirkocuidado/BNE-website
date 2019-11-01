---

---

(function ($) {
	$.fn.owlCounter=function(data,owlopts){
		var $el = this;
		this.html(); //clear html contents
		$.each(data,function(index){
            $el.append('<div class="text-white item"></div>');
            data[index].date=new Date(data[index].date).getTime();
		});

		//start the carusel
        this.owlCarousel(owlopts || {
            items:1,
            loop:false,
            dots:false,
            autoplay:true,
            navRewind: true
        });

		(function onTick(){
            // Get todays date and time
            var now = new Date().getTime();

			// Find the distance between now an the count down date and calculate for days, hours, minutes and seconds
            $.each(data,function(index,obj){
            	obj.distance = obj.distance || {};
            	var distance = obj.distance.time = obj.date - now;

            	distance = (distance > 0 ? distance : 0);

                obj.distance.days = Math.floor(distance / (1000 * 60 * 60 * 24));
                obj.distance.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                obj.distance.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                obj.distance.seconds = Math.floor((distance % (1000 * 60)) / 1000);
            });

            //after owl is initialized we are searching for its items
            $el.find('.owl-item').each(function(i){
                i = (i>=data.length ?  0 : i); //safe-fix
				var name = data[i].name;
                var days = data[i].distance.days;
                var hours = data[i].distance.hours;
                var minutes = data[i].distance.minutes;
                var seconds = data[i].distance.seconds;

                $(this).html(
                    '<div class="timer-title"><table><tr><td>'+name+'</td></tr><tr><td>po\u010Dinje za</td></tr></table></div><div class="timer-data">' +
                    days +
                    "<span>" +
                    (days % 10 === 1 && days !== 11 ? "dan" : "dana") +
                    "</span><i>:</i>" +
                    hours +
                    "<span>" +
                    (hours.isIn([1, 21]) ? "sat" : hours.isIn([2, 3, 4, 22, 23, 24]) ? "sata" : "sati") +
                    "</span><i>:</i>" +
                    minutes +
                    "<span>minuta</span><i>:</i>" +
                    seconds +
                    "<span>" +
                    "sekundi" +
                    "</span></div>"
                );
            });

            // Update every second
            setTimeout(onTick, 1000);
		})();

		return this;
	};
})(jQuery);

$(window).load(function(){
	$('.animated-onload').addClass('animated').removeClass('animated-onload');
	setTimeout(function(){ //very hacky stuff, but works for this case..
        $("#loading-blackness").remove();
	},1000);
});
$(document).ready(function(){
    // Set the date we're counting down to, and add to carusel
    $("#timer-carousel").owlCounter({{site.data.events | jsonify}});

    //Power-up dem carusels
    $('.active-speaker-carusel').owlCarousel({
        items: 2,
        loop: true,
        dots: true,
        autoplay: true,
        responsive: {
            0: {
                items: 1
            },
            1280: {
                items: 2
            }
        }
    });
    $('#novosti-carusel').owlCarousel({
        items: 1,
        margin: 30,
        responsive: {
            0:{
                items: 1
            },
            600:{
                items: 2
            },
            900: {
                items: 3
            },
            1280: {
                items: 4
            }
        }
    });
    $('#seminar-carusel').owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        autoplay: true
    });
    $('#hakaton-carusel').owlCarousel({
        items: 1,
        loop: true,
        dots: true,
        autoplay: true
    });

	//add particles
	particlesJS('particles-js', {
	    "particles": {
	        "number": {
	            "value": 70,
	            "density": {
	                "enable": true,
	                "value_area": 800
	            }
	        },
	        "color": {
	            "value": "#ffffff"
	        },
	        "shape": {
	            "type": "circle",
	            "stroke": {
	                "width": 0,
	                "color": "#000000"
	            },
	            "polygon": {
	                "nb_sides": 5
	            }
	        },
	        "opacity": {
	            "value": 0.5,
	            "random": false,
	            "anim": {
	                "enable": false,
	                "speed": 1,
	                "opacity_min": 0.1,
	                "sync": false
	            }
	        },
	        "size": {
	            "value": 3,
	            "random": true,
	            "anim": {
	                "enable": false,
	                "speed": 40,
	                "size_min": 0.1,
	                "sync": false
	            }
	        },
	        "line_linked": {
	            "enable": true,
	            "distance": 150,
	            "color": "#ffffff",
	            "opacity": 0.4,
	            "width": 1
	        },
	        "move": {
	            "enable": true,
	            "speed":2,
	            "direction": "none",
	            "random": false,
	            "straight": false,
	            "out_mode": "out",
	            "bounce": false,
	            "attract": {
	                "enable": false,
	                "rotateX": 600,
	                "rotateY": 1200
	            }
	        }
	    },
	    "interactivity": {
	        "detect_on": "canvas",
	        "events": {
	            "onhover": {
	                "enable": true,
	                "mode": "repulse"
	            },
	            "onclick": {
	                "enable": true,
	                "mode": "push"
	            },
	            "resize": true
	        },
	        "modes": {
	            "grab": {
	                "distance": 400,
	                "line_linked": {
	                    "opacity": 1
	                }
	            },
	            "bubble": {
	                "distance": 400,
	                "size": 40,
	                "duration": 2,
	                "opacity": 8,
	                "speed": 3
	            },
	            "repulse": {
	                "distance": 200,
	                "duration": 0.4
	            },
	            "push": {
	                "particles_nb": 4
	            },
	            "remove": {
	                "particles_nb": 2
	            }
	        }
	    },
	    "retina_detect": true
	});
});

Number.prototype.isIn=function(arr){
	for(var i=0;i<arr.length;i++){
		if(this==arr[i])
			return true;
	}
	return false;
};
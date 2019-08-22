jQuery(function() {
	jQuery(window).on('load', function() {
		jQuery('#loading').fadeOut();
		jQuery('#Load').delay(500).fadeOut('slow');
		jQuery('body').delay(500).css({'overflow':'visible'});
		setTimeout(function(){new WOW().init();}, 500);

	jQuery('a[href="' + this.location.href + '"]').addClass('active');
	
	jQuery(".lazy-img").recliner({
		attrib: "data-src", 
		throttle: 100,      
		threshold:300,
});
	jQuery('.lazy').Lazy({
			visibleOnly: true,
			effect: 'fadeIn',
			threshold:400,
		});
		jQuery(function() {
			jQuery("iframe[data-src]").Lazy();
	});


	if( jQuery('.sn_form_submit') !== null){
		jQuery('.sn_form_submit').on( "click", validation );
	
		function validation(e) {
			if (jQuery('#test1:checked').length === 1){
			if(jQuery('input[type=radio]')){

			jQuery('#request-form input[type=radio]').each(function(){
					jQuery(this).removeClass("sn_form_information");
			});
			jQuery('#request-form input[type=radio]:checked').each(function(){
					jQuery(this).addClass("sn_form_information");
			});
			}
				sn_form_submit('request-form','config_email_1');
				return
				}
			else{
				jQuery('.alert').show()
				return
			}
		}
	}
});
$(document).ready(function(){
    $('#logistics_booking_form').on('submit', function(e){
        e.preventDefault(); // Stop default submission

        var error = false;

        // Grab all form values
        var formData = {
            shipper_name: $('#shipper_name').val().trim(),
            shipper_email: $('#shipper_email').val().trim(),
            shipper_phone: $('#shipper_phone').val().trim(),
            shipper_address: $('#shipper_address').val().trim(),
            shipper_city: $('#shipper_city').val().trim(),
            shipper_country: $('#shipper_country').val().trim(),
            receiver_name: $('#receiver_name').val().trim(),
            receiver_address: $('#receiver_address').val().trim(),
            receiver_city: $('#receiver_city').val().trim(),
            receiver_country: $('#receiver_country').val().trim(),
            shipment_type: $('#shipment_type').val(),
            origin_airport: $('#origin_airport').val(),
            destination_airport: $('#destination_airport').val(),
            pieces: $('#pieces').val(),
            weight: $('#weight').val(),
            dimensions: $('#dimensions').val(),
            cargo_description: $('#cargo_description').val(),
            transport_mode: $('#transport_mode').val(),
            incoterms: $('#incoterms').val(),
            delivery_speed: $('#delivery_speed').val(),
            insurance: $('#insurance').val(),
            special: $('#special').val(),
            pickup_date: $('#pickup_date').val(),
            pickup_time: $('#pickup_time').val(),
            delivery_deadline: $('#delivery_deadline').val(),
            payment_method: $('#payment_method').val(),
            billing_address: $('#billing_address').val(),
            notes: $('#notes').val(),
            agree_terms: $('#agree_terms').is(':checked')
        };

        // Reset errors on click
        $('#shipper_name,#shipper_email,#shipper_phone').on('click', function(){
            $(this).removeClass("error_input");
        });

        // Validation
        if(formData.shipper_name.length === 0){
            error = true;
            $('#shipper_name').addClass("error_input");
        }

        if(formData.shipper_email.length === 0 || formData.shipper_email.indexOf('@') === -1){
            error = true;
            $('#shipper_email').addClass("error_input");
        }

        if(formData.shipper_phone.length === 0){
            error = true;
            $('#shipper_phone').addClass("error_input");
        }

        // Terms validation
        if(!formData.agree_terms){
            error = true;
            $('#agree_terms').addClass("error_input");
        }

        // If no error, submit via API
        if(error === false){
            var submitBtn = $(this).find('button[type="submit"]');
            submitBtn.attr({'disabled' : true}).text('Sending...');

            // Use BookingAPI to submit
            const bookingAPI = new BookingAPI();
            
            bookingAPI.submitBooking(formData).then(function(result) {
                if(result.success) {
                    submitBtn.text('Success ✓');
                    $('#success_message').fadeIn(500);
                    
                    // Show booking ID to user
                    if(result.booking_id) {
                        $('#success_message').html(
                            '<strong>✅ Booking Submitted Successfully!</strong><br>' +
                            'Booking ID: <strong>' + result.booking_id + '</strong><br>' +
                            'We will contact you within 24 hours with your quote.'
                        );
                    }
                    
                    // Reset form after 3 seconds
                    setTimeout(function() {
                        $('#logistics_booking_form')[0].reset();
                        submitBtn.removeAttr('disabled').text('Request Quote');
                    }, 3000);
                    
                } else {
                    $('#error_message').html(
                        '<strong>❌ Submission Failed</strong><br>' +
                        result.message + '<br>' +
                        'Please try again or contact us directly at ops@emexexpress.de'
                    ).fadeIn(500);
                    submitBtn.removeAttr('disabled').text('Request Quote');
                }
            }).catch(function(error) {
                $('#error_message').html(
                    '<strong>❌ Network Error</strong><br>' +
                    'Unable to connect to our servers. Please check your connection and try again.'
                ).fadeIn(500);
                submitBtn.removeAttr('disabled').text('Request Quote');
            });
        }
    });
});

// Simple Booking Form Handler - Formspree Alternative
// Works with Coolify Static Deployment

class SimpleBookingAPI {
    constructor() {
        // Formspree endpoint (create account at formspree.io)
        this.formspreeEndpoint = 'https://formspree.io/f/xjvnpzkw';
    }

    async submitBooking(formData) {
        try {
            // Prepare email-friendly data
            const emailData = {
                ...formData,
                _subject: `[Chicago Airfreight Inquiry] ${formData.shipper_name} to ${formData.receiver_city}`,
                _replyto: formData.shipper_email,
                _template: 'table'
            };

            const response = await fetch(this.formspreeEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Your inquiry has been submitted successfully. We will contact you shortly.',
                    booking_id: this.generateBookingId()
                };
            } else {
                throw new Error('Form submission failed');
            }

        } catch (error) {
            return {
                success: false,
                message: 'Failed to submit inquiry. Please try again or contact us directly at ops@emexexpress.de.',
                error: error.message
            };
        }
    }

    generateBookingId() {
        return 'CHI' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + 
               Math.random().toString(36).substr(2, 6).toUpperCase();
    }
}

// Replace the complex API with simple version
window.BookingAPI = SimpleBookingAPI;

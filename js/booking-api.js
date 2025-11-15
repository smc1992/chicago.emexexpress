// Airfreight Booking API Handler
// Sends form data to external API for email processing

class BookingAPI {
    constructor() {
        this.apiEndpoint = 'https://api.emexexpress.de/booking'; // Externe API
        this.fallbackEndpoint = 'https://formspree.io/f/your-form-id'; // Backup
    }

    async submitBooking(formData) {
        try {
            // Prepare data for API
            const bookingData = {
                ...formData,
                source: 'chicago-landing',
                timestamp: new Date().toISOString(),
                booking_id: this.generateBookingId()
            };

            // Try primary API first
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': 'your-api-key' // API Key für Sicherheit
                },
                body: JSON.stringify(bookingData)
            });

            if (response.ok) {
                return await response.json();
            } else {
                throw new Error('API request failed');
            }

        } catch (error) {
            console.log('Primary API failed, trying fallback...');
            
            // Fallback to Formspree or similar service
            return await this.submitFallback(bookingData);
        }
    }

    async submitFallback(data) {
        try {
            const response = await fetch(this.fallbackEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    ...data,
                    _subject: `[Chicago Airfreight Inquiry] ${data.shipper_name} to ${data.receiver_city}`
                })
            });

            if (response.ok) {
                return {
                    success: true,
                    message: 'Your inquiry has been submitted successfully. We will contact you shortly.',
                    booking_id: data.booking_id
                };
            } else {
                throw new Error('Fallback also failed');
            }

        } catch (fallbackError) {
            return {
                success: false,
                message: 'Failed to submit inquiry. Please try again or contact us directly.',
                error: fallbackError.message
            };
        }
    }

    generateBookingId() {
        return 'CHI' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + 
               Math.random().toString(36).substr(2, 6).toUpperCase();
    }
}

// Export for use in main script
window.BookingAPI = BookingAPI;

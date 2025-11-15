// IONOS Webmail API Integration
// Sends emails directly through IONOS webmail interface

class IONOSBookingAPI {
    constructor() {
        // IONOS Webmail API endpoint
        this.ionosAPI = 'https://webmail.ionos.de/api/send';
        // Alternative: Direct SMTP via CORS proxy
        this.smtpProxy = 'https://cors-anywhere.herokuapp.com/https://mail.ionos.de';
    }

    async submitBooking(formData) {
        try {
            // Method 1: Try IONOS Webmail API first
            const result = await this.sendViaIONOSAPI(formData);
            return result;
            
        } catch (error) {
            console.log('IONOS API failed, trying SMTP proxy...');
            
            // Method 2: Fallback to SMTP via CORS proxy
            return await this.sendViaSMTPProxy(formData);
        }
    }

    async sendViaIONOSAPI(formData) {
        const emailData = {
            to: 'ops@emexexpress.de',
            from: 'noreply@emexexpress.de',
            replyTo: formData.shipper_email,
            subject: `[Chicago Airfreight Inquiry] ${formData.shipper_name} to ${formData.receiver_city}`,
            html: this.generateHTMLEmail(formData),
            text: this.generateTextEmail(formData)
        };

        const response = await fetch(this.ionosAPI, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_IONOS_API_KEY', // IONOS API Key needed
                'X-API-User': 'ops@emexexpress.de'
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
            throw new Error('IONOS API request failed');
        }
    }

    async sendViaSMTPProxy(formData) {
        // This would use a CORS proxy to connect to IONOS SMTP
        // More complex but possible
        
        const emailData = {
            host: 'mail.ionos.de',
            port: 587,
            username: 'ops@emexexpress.de',
            password: 'Emex2024!Secure', // This should be secured!
            to: 'ops@emexexpress.de',
            from: formData.shipper_email,
            subject: `[Chicago Airfreight Inquiry] ${formData.shipper_name} to ${formData.receiver_city}`,
            html: this.generateHTMLEmail(formData)
        };

        const response = await fetch(this.smtpProxy + '/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
            throw new Error('SMTP proxy failed');
        }
    }

    generateHTMLEmail(formData) {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <title>Chicago Airfreight Inquiry</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .section { margin-bottom: 25px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 5px; }
        .section h3 { color: #1e40af; margin-top: 0; border-bottom: 2px solid #1e40af; padding-bottom: 5px; }
        .field { margin-bottom: 8px; }
        .field strong { color: #374151; }
        .urgent { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 10px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class='header'>
        <h1>🚁 NEW AIRFREIGHT BOOKING INQUIRY - CHICAGO</h1>
        <p>Submitted: ${new Date().toLocaleString()}</p>
        <p>Source: Chicago Landing Page</p>
    </div>
    
    <div class='content'>
        <div class='urgent'>
            <strong>📋 URGENT: New airfreight inquiry received</strong><br>
            Please process this booking request promptly.
        </div>

        <div class='section'>
            <h3>🏢 SHIPPER INFORMATION</h3>
            <div class='field'><strong>Name:</strong> ${formData.shipper_name}</div>
            <div class='field'><strong>Email:</strong> ${formData.shipper_email}</div>
            <div class='field'><strong>Phone:</strong> ${formData.shipper_phone}</div>
            <div class='field'><strong>Address:</strong> ${formData.shipper_address}</div>
            <div class='field'><strong>City:</strong> ${formData.shipper_city}</div>
            <div class='field'><strong>Country:</strong> ${formData.shipper_country}</div>
        </div>

        <div class='section'>
            <h3>📍 RECEIVER INFORMATION</h3>
            <div class='field'><strong>Name:</strong> ${formData.receiver_name}</div>
            <div class='field'><strong>Address:</strong> ${formData.receiver_address}</div>
            <div class='field'><strong>City:</strong> ${formData.receiver_city}</div>
            <div class='field'><strong>Country:</strong> ${formData.receiver_country}</div>
        </div>

        <div class='section'>
            <h3>📦 SHIPMENT DETAILS</h3>
            <div class='field'><strong>Origin:</strong> ${formData.origin_airport || 'N/A'}</div>
            <div class='field'><strong>Destination:</strong> ${formData.destination_airport || 'N/A'}</div>
            <div class='field'><strong>Weight:</strong> ${formData.weight || 'N/A'}</div>
            <div class='field'><strong>Pieces:</strong> ${formData.pieces || 'N/A'}</div>
            <div class='field'><strong>Cargo:</strong> ${formData.cargo_description || 'N/A'}</div>
        </div>
    </div>
</body>
</html>`;
    }

    generateTextEmail(formData) {
        return `NEW AIRFREIGHT BOOKING INQUIRY - CHICAGO
========================================

Submitted: ${new Date().toLocaleString()}
Source: Chicago Landing Page

Shipper: ${formData.shipper_name} (${formData.shipper_email})
Receiver: ${formData.receiver_name} in ${formData.receiver_city}
Route: ${formData.origin_airport || 'N/A'} → ${formData.destination_airport || 'N/A'}
Cargo: ${formData.cargo_description || 'N/A'}
Weight: ${formData.weight || 'N/A'} | Pieces: ${formData.pieces || 'N/A'}

Contact: ${formData.shipper_phone}
Address: ${formData.shipper_address}, ${formData.shipper_city}`;
    }

    generateBookingId() {
        return 'CHI' + new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14) + 
               Math.random().toString(36).substr(2, 6).toUpperCase();
    }
}

// Use IONOS API instead of generic API
window.BookingAPI = IONOSBookingAPI;

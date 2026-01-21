// Email Notification System for Winner Submissions
// Sends submission data to furlowjadon@gmail.com and admin dashboard

class EmailNotificationSystem {
    constructor() {
        this.adminEmail = 'furlowjadon@gmail.com';
        this.emailServiceUrl = 'https://formspree.io/f/YOUR_FORM_ID'; // You'll need to set this up
        this.backupEmailService = 'https://api.emailjs.com/api/v1.0/email/send'; // Alternative service
    }

    // Send winner submission notification email
    async sendWinnerSubmissionEmail(submissionData) {
        const emailData = {
            to: this.adminEmail,
            subject: `🏆 New Winner Submission - ${submissionData.fullName}`,
            html: this.generateSubmissionEmailHTML(submissionData),
            from: 'noreply@lyfeshift.com'
        };

        try {
            // Try primary email service first
            await this.sendViaFormspree(emailData, submissionData);
            console.log('Email sent successfully via Formspree');
            return { success: true, service: 'formspree' };
        } catch (error) {
            console.log('Formspree failed, trying EmailJS...', error);
            
            try {
                // Fallback to EmailJS
                await this.sendViaEmailJS(emailData, submissionData);
                console.log('Email sent successfully via EmailJS');
                return { success: true, service: 'emailjs' };
            } catch (emailError) {
                console.error('All email services failed:', emailError);
                
                // Store for manual review
                this.storeFailedEmail(submissionData);
                return { success: false, error: emailError.message };
            }
        }
    }

    // Send via Formspree (recommended - free and reliable)
    async sendViaFormspree(emailData, submissionData) {
        const formData = new FormData();
        
        // Add all submission data to form
        formData.append('_replyto', this.adminEmail);
        formData.append('_subject', emailData.subject);
        formData.append('winner_name', submissionData.fullName);
        formData.append('ranking', submissionData.ranking);
        formData.append('email', submissionData.email);
        formData.append('phone', submissionData.phone);
        formData.append('address', submissionData.address);
        formData.append('city', submissionData.city);
        formData.append('state', submissionData.state);
        formData.append('zip', submissionData.zip);
        formData.append('country', submissionData.country);
        formData.append('size', submissionData.size);
        formData.append('instructions', submissionData.instructions);
        formData.append('submission_date', new Date().toLocaleString());
        
        const response = await fetch(this.emailServiceUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Formspree error: ${response.status}`);
        }

        return response.json();
    }

    // Send via EmailJS (alternative service)
    async sendViaEmailJS(emailData, submissionData) {
        const emailJSData = {
            service_id: 'YOUR_SERVICE_ID',
            template_id: 'YOUR_TEMPLATE_ID',
            user_id: 'YOUR_USER_ID',
            template_params: {
                to_email: this.adminEmail,
                subject: emailData.subject,
                winner_name: submissionData.fullName,
                ranking: submissionData.ranking,
                email: submissionData.email,
                phone: submissionData.phone,
                full_address: `${submissionData.address}, ${submissionData.city}, ${submissionData.state} ${submissionData.zip}, ${submissionData.country}`,
                size: submissionData.size,
                instructions: submissionData.instructions,
                submission_date: new Date().toLocaleString()
            }
        };

        const response = await fetch(this.backupEmailService, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailJSData)
        });

        if (!response.ok) {
            throw new Error(`EmailJS error: ${response.status}`);
        }

        return response.json();
    }

    // Generate HTML email template
    generateSubmissionEmailHTML(data) {
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                    .section { margin-bottom: 25px; }
                    .section h3 { color: #667eea; margin-bottom: 10px; border-bottom: 2px solid #667eea; padding-bottom: 5px; }
                    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                    .info-item { background: white; padding: 15px; border-radius: 8px; border-left: 4px solid #667eea; }
                    .label { font-weight: bold; color: #555; }
                    .value { margin-top: 5px; }
                    .highlight { background: #e8f4fd; padding: 15px; border-radius: 8px; border-left: 4px solid #007bff; }
                    .footer { text-align: center; margin-top: 30px; color: #666; font-size: 0.9rem; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🏆 New Winner Submission</h1>
                        <p>Lyfe Shift Competition - Prize Fulfillment</p>
                    </div>
                    
                    <div class="content">
                        <div class="highlight">
                            <h2>${data.fullName} - ${this.getPositionText(data.ranking)}</h2>
                            <p><strong>Submission Date:</strong> ${new Date().toLocaleString()}</p>
                        </div>
                        
                        <div class="section">
                            <h3>📞 Contact Information</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <div class="label">Email Address</div>
                                    <div class="value">${data.email}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Phone Number</div>
                                    <div class="value">${data.phone}</div>
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>📦 Shipping Address</h3>
                            <div class="info-item">
                                <div class="label">Complete Address</div>
                                <div class="value">
                                    ${data.address}<br>
                                    ${data.city}, ${data.state} ${data.zip}<br>
                                    ${data.country}
                                </div>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>🎁 Prize Information</h3>
                            <div class="info-grid">
                                <div class="info-item">
                                    <div class="label">Prize</div>
                                    <div class="value">${this.getPrizeByRanking(data.ranking)}</div>
                                </div>
                                <div class="info-item">
                                    <div class="label">Size</div>
                                    <div class="value">${data.size || 'Not specified'}</div>
                                </div>
                            </div>
                        </div>
                        
                        ${data.instructions ? `
                        <div class="section">
                            <h3>📝 Special Instructions</h3>
                            <div class="info-item">
                                <div class="value">${data.instructions}</div>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="section">
                            <h3>⚡ Next Steps</h3>
                            <div class="info-item">
                                <ul>
                                    <li>Review submission in admin dashboard</li>
                                    <li>Verify shipping address accuracy</li>
                                    <li>Process prize fulfillment</li>
                                    <li>Update order status</li>
                                    <li>Send tracking information to winner</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    
                    <div class="footer">
                        <p>This email was automatically generated by the Lyfe Shift Competition System</p>
                        <p>Admin Dashboard: <a href="your-admin-dashboard-url">Access Dashboard</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Helper functions
    getPositionText(ranking) {
        const positions = {
            '1': '🥇 1st Place',
            '2': '🥈 2nd Place', 
            '3': '🥉 3rd Place',
            '4': '🏅 4th Place',
            '5': '🏅 5th Place'
        };
        return positions[ranking] || `${ranking} Place`;
    }

    getPrizeByRanking(ranking) {
        const prizes = {
            '1': '🥇 Premium Gym Bag',
            '2': '🥈 Massage Gun',
            '3': '🥉 Recovery Set',
            '4': '🏅 Stretch Bands',
            '5': '🏅 Premium Water Bottle'
        };
        return prizes[ranking] || 'Competition Prize';
    }

    // Store failed emails for manual review
    storeFailedEmail(submissionData) {
        const failedEmails = JSON.parse(localStorage.getItem('lyfeshift_failed_emails') || '[]');
        failedEmails.push({
            ...submissionData,
            failedAt: new Date().toISOString(),
            reason: 'Email service unavailable'
        });
        localStorage.setItem('lyfeshift_failed_emails', JSON.stringify(failedEmails));
    }

    // Send test email
    async sendTestEmail() {
        const testData = {
            fullName: 'Test Winner',
            ranking: '1',
            email: 'test@example.com',
            phone: '+1-555-123-4567',
            address: '123 Test Street',
            city: 'Test City',
            state: 'TS',
            zip: '12345',
            country: 'United States',
            size: 'L',
            instructions: 'This is a test submission'
        };

        return await this.sendWinnerSubmissionEmail(testData);
    }
}

// Initialize email notification system
const emailNotificationSystem = new EmailNotificationSystem();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailNotificationSystem;
}
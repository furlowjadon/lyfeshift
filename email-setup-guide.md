# 📧 Email Notification Setup Guide

## 🎯 Overview
This guide will help you set up automatic email notifications to **furlowjadon@gmail.com** whenever a winner submits their shipping and contact information.

## 🚀 Quick Setup with Formspree (Recommended - Free)

### Step 1: Create Formspree Account
1. Go to [https://formspree.io](https://formspree.io)
2. Sign up with your email (furlowjadon@gmail.com)
3. Create a new form
4. Copy your form endpoint URL (looks like: `https://formspree.io/f/xyzabc123`)

### Step 2: Update the Code
Replace `YOUR_FORM_ID` in the email notification system with your Formspree form ID.

**In `email-notification-system.js`, line 7:**
```javascript
this.emailServiceUrl = 'https://formspree.io/f/YOUR_ACTUAL_FORM_ID';
```

### Step 3: Test the System
The system will automatically send emails when winners submit their information.

## 📧 What You'll Receive

### Email Subject
```
🏆 New Winner Submission - [Winner Name]
```

### Email Content
- **Winner Information**: Name, ranking, submission date
- **Contact Details**: Email address and phone number
- **Complete Shipping Address**: Street, city, state, ZIP, country
- **Prize Information**: Assigned prize based on ranking
- **Size Preferences**: If applicable
- **Special Instructions**: Any delivery notes
- **Next Steps**: Action items for fulfillment

### Sample Email
```
🏆 New Winner Submission
Lyfe Shift Competition - Prize Fulfillment

John Smith - 🥇 1st Place
Submission Date: January 9, 2026, 2:30 PM

📞 Contact Information
Email: john.smith@email.com
Phone: +1-555-123-4567

📦 Shipping Address
123 Fitness Street
New York, NY 10001
United States

🎁 Prize Information
Prize: 🥇 Premium Gym Bag
Size: Large

📝 Special Instructions
Please leave at front door

⚡ Next Steps
• Review submission in admin dashboard
• Verify shipping address accuracy
• Process prize fulfillment
• Update order status
• Send tracking information to winner
```

## 🔄 How It Works

### Automatic Process
1. **Winner submits** shipping info on your website
2. **System validates** all required information
3. **Email sent instantly** to furlowjadon@gmail.com
4. **Data stored** in admin dashboard
5. **Backup created** in case of email failure

### Dual Storage System
- **Email**: Immediate notification to your inbox
- **Admin Dashboard**: Permanent storage and management
- **Backup**: Local storage if email services fail

## 🛡️ Reliability Features

### Multiple Email Services
1. **Primary**: Formspree (free, reliable)
2. **Backup**: EmailJS (if Formspree fails)
3. **Fallback**: Local storage for manual review

### Error Handling
- Automatic retry on failure
- Failed email storage for manual sending
- Admin dashboard always updated regardless of email status

## 📱 Mobile Compatibility
- Works on all devices
- Responsive email templates
- Mobile-friendly admin dashboard

## 🔧 Advanced Setup (Optional)

### Custom Email Template
You can customize the email template in `email-notification-system.js` by modifying the `generateSubmissionEmailHTML()` function.

### Additional Recipients
To send emails to multiple people, update the `adminEmail` property:
```javascript
this.adminEmail = 'furlowjadon@gmail.com,assistant@lyfeshift.com';
```

### Email Filters
Set up Gmail filters to:
- Automatically label winner submission emails
- Forward to team members
- Create calendar events for fulfillment

## 📊 Testing

### Test Email Function
The system includes a test email feature:
```javascript
emailNotificationSystem.sendTestEmail();
```

### What to Test
- Email delivery to furlowjadon@gmail.com
- Email formatting and content
- Admin dashboard updates
- Mobile compatibility

## 🎯 Benefits

### Immediate Notifications
- Get notified instantly when winners submit info
- No need to check admin dashboard constantly
- Mobile notifications via Gmail app

### Complete Information
- All shipping details in one email
- Ready-to-use format for fulfillment
- Automatic prize assignment

### Professional Appearance
- Branded email template
- Clean, organized layout
- Easy to read on mobile devices

## 🚀 Ready to Deploy

Once you set up your Formspree account and update the form ID, the email notification system will be fully functional and will automatically send you detailed emails every time a winner submits their shipping information!

---

**Next Step**: Update your Formspree form ID in the code and test with a sample submission.
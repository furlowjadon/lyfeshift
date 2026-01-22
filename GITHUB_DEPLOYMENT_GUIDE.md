# 🚀 GitHub Deployment Guide - Lyfe Shift Complete Platform

## 📁 File Structure for GitHub Upload

When uploading to GitHub, organize your files as follows:

```
your-repo/
├── index.html                          # Main website homepage
├── signup.html                         # User registration
├── login.html                          # User authentication  
├── user-dashboard.html                 # User dashboard
├── collect-reward.html                 # Winner submission form
├── vercel.json                         # Vercel deployment config
├── nutrition-section/                 # Complete nutrition system
│   ├── nutrition-home.html             # Nutrition landing page
│   ├── macronutrients-101.html         # Macro education
│   ├── how-food-affects-body.html      # Science-based content
│   ├── healthy-eating-basics.html      # Practical guidance
│   ├── hydration-recovery.html         # Hydration tools
│   ├── meal-plan-builder.html          # Meal planning tool
│   └── nutrition-survey.html           # Comprehensive survey
├── admin-dashboard/                    # Admin management (optional)
│   ├── index.html                      # Admin interface
│   ├── admin-dashboard.js              # Dashboard functionality
│   └── data-connector.js               # Data management
└── email-system/                      # Email notifications (optional)
    ├── email-notification-system.js   # Email functionality
    └── email-setup-guide.md            # Setup instructions
```

## 🔧 GitHub Upload Steps

### **Option 1: Replace All Files (Recommended)**
1. **Delete old files** from your GitHub repository
2. **Upload all files** from this package maintaining the folder structure
3. **Commit changes** with message: "Complete platform update with nutrition section"

### **Option 2: Update Individual Files**
1. **Main website files**: Replace existing HTML files in root directory
2. **Add nutrition-section folder**: Upload entire nutrition-section folder
3. **Update admin-dashboard**: Replace admin files if using admin features
4. **Add email-system**: Upload email-system folder if using email notifications

## 🌐 Vercel Deployment

After uploading to GitHub:

1. **Vercel will auto-deploy** from your GitHub repository
2. **Main website** will be accessible at your domain root
3. **Nutrition section** will be at `/nutrition-section/nutrition-home.html`
4. **Admin dashboard** will be at `/admin-dashboard/index.html`

## 🔗 Navigation Structure

### **Main Website Navigation:**
- Home → Your domain root
- Nutrition → `/nutrition-section/nutrition-home.html`
- Challenge → Scroll to challenge section
- Rewards → Scroll to rewards section
- Sign Up → `/signup.html`
- Login → `/login.html`

### **Nutrition Section Navigation:**
- All nutrition pages link to each other
- "Back to Home" returns to main website
- Survey submissions go to admin dashboard

## ✅ Post-Deployment Checklist

After uploading to GitHub and Vercel deployment:

1. **✅ Test main website** - Verify homepage loads correctly
2. **✅ Test nutrition navigation** - Click "Nutrition" tab from main site
3. **✅ Test all nutrition pages** - Navigate through all 7 nutrition pages
4. **✅ Test cross-navigation** - "Back to Home" from nutrition section
5. **✅ Test user registration** - Sign up and login functionality
6. **✅ Test admin dashboard** - Admin interface (if using)
7. **✅ Test email notifications** - Winner submission emails (if configured)

## 🎯 Key Features Included

### **✅ Main Competition Website**
- Updated navigation with Nutrition tab
- User registration and authentication
- Competition information and prizes
- Winner submission with email notifications

### **✅ Complete Nutrition Section**
- 7 comprehensive educational pages
- Interactive meal plan builder
- Comprehensive nutrition survey
- Hydration calculator and tools

### **✅ Admin Dashboard**
- User management and tracking
- Nutrition survey submissions
- Email notification monitoring
- Data export capabilities

### **✅ Email Notification System**
- Automatic alerts to furlowjadon@gmail.com
- Professional HTML email formatting
- Winner submission data capture

## 🚨 Important Notes

1. **File Paths**: All internal links use relative paths for proper navigation
2. **Mobile Responsive**: All pages work on desktop, tablet, and mobile
3. **Email Setup**: Configure Formspree for email notifications to work
4. **Admin Access**: Username: `admin`, Password: `lyfeshift2024`

## 📞 Support

If you encounter any issues during deployment:
1. Check that all files maintain their folder structure
2. Verify Vercel deployment logs for any errors
3. Test navigation between main site and nutrition section
4. Ensure email configuration is properly set up

Your complete Lyfe Shift platform is ready for deployment! 🎉
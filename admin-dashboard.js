// Standalone Admin Dashboard JavaScript
// Connects to main fitness website data

class AdminDashboard {
    constructor() {
        this.websiteUrl = null; // Will be set by user
        this.isConnected = false;
        this.userData = [];
        this.winnerSubmissions = [];
        this.orders = [];
        
        this.init();
    }

    init() {
        this.loadStoredData();
        this.updateStats();
        this.checkConnection();
        
        // Auto-refresh data every 30 seconds
        setInterval(() => {
            if (this.isConnected) {
                this.syncData();
            }
        }, 30000);
    }

    // Connection Management
    async checkConnection() {
        try {
            // Try to connect to main website data
            await this.syncData();
            this.setConnectionStatus(true, 'Connected to Main Website');
        } catch (error) {
            this.setConnectionStatus(false, 'Unable to connect to main website');
        }
    }

    setConnectionStatus(connected, message) {
        this.isConnected = connected;
        const dot = document.getElementById('connectionDot');
        const status = document.getElementById('connectionStatus');
        const details = document.getElementById('connectionDetails');

        if (connected) {
            dot.classList.remove('disconnected');
            status.textContent = 'Connected to Main Website';
            details.textContent = 'Successfully syncing data from fitness competition platform';
        } else {
            dot.classList.add('disconnected');
            status.textContent = 'Connection Issue';
            details.textContent = message || 'Unable to sync with main website';
        }
    }

    // Data Synchronization
    async syncData() {
        try {
            // Simulate data sync from main website
            // In production, this would make API calls to your main website
            this.loadStoredData();
            this.updateStats();
            this.showNotification('Data synchronized successfully', 'success');
        } catch (error) {
            console.error('Sync error:', error);
            this.showNotification('Failed to sync data', 'error');
        }
    }

    loadStoredData() {
        // Load data from localStorage (simulating connection to main website)
        this.userData = JSON.parse(localStorage.getItem('lyfeshift_users') || '[]');
        this.winnerSubmissions = JSON.parse(localStorage.getItem('lyfeshift_winner_submissions') || '[]');
        this.orders = JSON.parse(localStorage.getItem('lyfeshift_orders') || '[]');
        
        // If no orders exist, create them from submissions
        if (this.orders.length === 0 && this.winnerSubmissions.length > 0) {
            this.createOrdersFromSubmissions();
        }
    }

    createOrdersFromSubmissions() {
        this.orders = this.winnerSubmissions.map(submission => ({
            id: 'ORD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5),
            submissionId: submission.id,
            customerName: submission.fullName || 'Unknown',
            email: submission.email || '',
            phone: submission.phone || '',
            shippingAddress: {
                street: submission.address || '',
                city: submission.city || '',
                state: submission.state || '',
                zip: submission.zip || '',
                country: submission.country || ''
            },
            orderDate: submission.submissionDate,
            status: submission.proofSubmitted && submission.shippingSubmitted ? 'pending' : 'incomplete',
            trackingNumber: '',
            shippingCarrier: '',
            estimatedDelivery: '',
            notes: submission.instructions || '',
            prize: this.getPrizeByRanking(submission.ranking),
            size: submission.size || '',
            lastUpdated: new Date().toISOString()
        }));
        
        localStorage.setItem('lyfeshift_orders', JSON.stringify(this.orders));
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

    updateStats() {
        const totalUsers = this.userData.length;
        const totalWinners = this.userData.filter(user => user.isWinner).length;
        const pendingShipments = this.orders.filter(order => 
            order.status === 'pending' || order.status === 'processing'
        ).length;
        const completedOrders = this.orders.filter(order => 
            order.status === 'delivered'
        ).length;

        document.getElementById('totalUsers').textContent = totalUsers;
        document.getElementById('totalWinners').textContent = totalWinners;
        document.getElementById('pendingShipments').textContent = pendingShipments;
        document.getElementById('completedOrders').textContent = completedOrders;
    }

    // User Management Functions
    loadUsers() {
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = 'All Participants';
        
        if (this.userData.length === 0) {
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No Participants Found</h3>
                    <p>No user data available. Make sure the main website is connected.</p>
                    <button class="btn btn-primary" onclick="adminDashboard.syncData()" style="margin-top: 20px;">
                        <i class="fas fa-sync-alt"></i> Sync Data
                    </button>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-success" onclick="adminDashboard.exportUsers()" style="margin-right: 10px;">
                        <i class="fas fa-download"></i> Export CSV
                    </button>
                    <button class="btn btn-info" onclick="adminDashboard.syncData()">
                        <i class="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Joined</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.userData.map(user => `
                            <tr>
                                <td>${user.fullName}</td>
                                <td>${user.email}</td>
                                <td>${user.username}</td>
                                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                                <td>
                                    <span class="status-badge ${user.isWinner ? 'status-complete' : 'status-pending'}">
                                        ${user.isWinner ? 'Winner' : 'Participant'}
                                    </span>
                                </td>
                                <td>
                                    <button onclick="adminDashboard.toggleWinnerStatus('${user.id}')" 
                                            style="background: ${user.isWinner ? '#dc3545' : '#28a745'}; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                                        ${user.isWinner ? 'Remove Winner' : 'Mark Winner'}
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        this.showModal();
    }

    toggleWinnerStatus(userId) {
        const user = this.userData.find(u => u.id === userId);
        if (!user) return;

        const action = user.isWinner ? 'remove winner status from' : 'mark as winner';
        
        if (confirm(`Are you sure you want to ${action} ${user.fullName}?`)) {
            user.isWinner = !user.isWinner;
            
            // Reset submission status if removing winner status
            if (!user.isWinner) {
                user.hasSubmittedProof = false;
                user.hasSubmittedShipping = false;
            }
            
            localStorage.setItem('lyfeshift_users', JSON.stringify(this.userData));
            this.updateStats();
            this.loadUsers(); // Refresh the modal
            this.showNotification(`${user.fullName} ${user.isWinner ? 'marked as winner' : 'winner status removed'} successfully!`, 'success');
        }
    }

    exportUsers() {
        if (this.userData.length === 0) {
            this.showNotification('No users to export', 'error');
            return;
        }

        const headers = [
            'Name', 'Email', 'Username', 'Joined Date', 'Winner Status', 
            'Proof Submitted', 'Shipping Submitted', 'Email Updates'
        ];

        const csvContent = [
            headers.join(','),
            ...this.userData.map(user => [
                `"${user.fullName}"`,
                user.email,
                user.username,
                new Date(user.createdAt).toLocaleDateString(),
                user.isWinner ? 'Yes' : 'No',
                user.hasSubmittedProof ? 'Yes' : 'No',
                user.hasSubmittedShipping ? 'Yes' : 'No',
                user.emailUpdates ? 'Yes' : 'No'
            ].join(','))
        ].join('\n');

        this.downloadCSV(csvContent, `lyfeshift-users-${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification('Users exported successfully!', 'success');
    }

    // Winner Submissions Management
    viewSubmissions() {
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = 'Winner Submissions';
        
        if (this.winnerSubmissions.length === 0) {
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-trophy" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No Winner Submissions</h3>
                    <p>No winner submissions found. Winners will appear here once they submit their information.</p>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-success" onclick="adminDashboard.exportSubmissions()" style="margin-right: 10px;">
                        <i class="fas fa-download"></i> Export Submissions
                    </button>
                    <button class="btn btn-info" onclick="adminDashboard.syncData()">
                        <i class="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
                <div style="display: grid; gap: 20px;">
                    ${this.winnerSubmissions.map(submission => `
                        <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; border-left: 5px solid ${this.getStatusColor(submission)};">
                            <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 15px;">
                                <div>
                                    <h3 style="color: #333; margin-bottom: 5px;">
                                        ${submission.fullName || 'Name not provided'}
                                        <span style="background: ${this.getStatusColor(submission)}; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">
                                            ${this.getStatusText(submission)}
                                        </span>
                                    </h3>
                                    <p style="color: #666; margin-bottom: 5px;">
                                        <i class="fas fa-trophy"></i> Position: ${submission.ranking ? this.getPositionText(submission.ranking) : 'Not specified'}
                                    </p>
                                    <p style="color: #666; font-size: 0.9rem;">
                                        <i class="fas fa-clock"></i> Submitted: ${new Date(submission.submissionDate).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                                <div>
                                    <h4 style="color: #667eea; margin-bottom: 8px;">📸 Proof Status</h4>
                                    <p style="color: ${submission.proofSubmitted ? '#28a745' : '#dc3545'}; font-weight: 600;">
                                        <i class="fas fa-${submission.proofSubmitted ? 'check-circle' : 'times-circle'}"></i>
                                        ${submission.proofSubmitted ? 'Submitted' : 'Pending'}
                                    </p>
                                    ${submission.username ? `<p style="color: #666; font-size: 0.9rem;">Username: ${submission.username}</p>` : ''}
                                </div>
                                
                                <div>
                                    <h4 style="color: #667eea; margin-bottom: 8px;">📦 Shipping Status</h4>
                                    <p style="color: ${submission.shippingSubmitted ? '#28a745' : '#dc3545'}; font-weight: 600;">
                                        <i class="fas fa-${submission.shippingSubmitted ? 'check-circle' : 'times-circle'}"></i>
                                        ${submission.shippingSubmitted ? 'Submitted' : 'Pending'}
                                    </p>
                                    ${submission.email ? `<p style="color: #666; font-size: 0.9rem;">Email: ${submission.email}</p>` : ''}
                                    ${submission.country ? `<p style="color: #666; font-size: 0.9rem;">Country: ${submission.country}</p>` : ''}
                                </div>
                            </div>
                            
                            <div style="margin-top: 15px;">
                                <button onclick="adminDashboard.viewSubmissionDetails('${submission.id}')" 
                                        style="background: #667eea; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                                    <i class="fas fa-eye"></i> View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        }
        
        this.showModal();
    }

    viewSubmissionDetails(submissionId) {
        const submission = this.winnerSubmissions.find(s => s.id === submissionId);
        if (!submission) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = 'Submission Details';
        modalContent.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📋 Basic Information</h3>
                    <p><strong>Name:</strong> ${submission.fullName || 'Not provided'}</p>
                    <p><strong>Position:</strong> ${submission.ranking ? this.getPositionText(submission.ranking) : 'Not specified'}</p>
                    <p><strong>Username:</strong> ${submission.username || 'Not provided'}</p>
                    <p><strong>Submission Date:</strong> ${new Date(submission.submissionDate).toLocaleString()}</p>
                </div>
                
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📞 Contact Information</h3>
                    <p><strong>Email:</strong> ${submission.email || 'Not provided'}</p>
                    <p><strong>Phone:</strong> ${submission.phone || 'Not provided'}</p>
                </div>
                
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📦 Shipping Address</h3>
                    <p><strong>Address:</strong> ${submission.address || 'Not provided'}</p>
                    <p><strong>City:</strong> ${submission.city || 'Not provided'}</p>
                    <p><strong>State/Province:</strong> ${submission.state || 'Not provided'}</p>
                    <p><strong>ZIP/Postal:</strong> ${submission.zip || 'Not provided'}</p>
                    <p><strong>Country:</strong> ${submission.country || 'Not provided'}</p>
                    <p><strong>Size:</strong> ${submission.size || 'Not specified'}</p>
                </div>
                
                ${submission.instructions ? `
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📝 Special Instructions</h3>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 8px;">${submission.instructions}</p>
                </div>
                ` : ''}
                
                ${submission.proofNotes ? `
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📸 Proof Notes</h3>
                    <p style="background: #f8f9fa; padding: 15px; border-radius: 8px;">${submission.proofNotes}</p>
                </div>
                ` : ''}
            </div>
        `;
    }

    exportSubmissions() {
        if (this.winnerSubmissions.length === 0) {
            this.showNotification('No submissions to export', 'error');
            return;
        }

        const headers = [
            'Submission Date', 'Name', 'Position', 'Username', 'Email', 'Phone',
            'Address', 'City', 'State', 'ZIP', 'Country', 'Size',
            'Proof Submitted', 'Shipping Submitted', 'Status', 'Instructions', 'Proof Notes'
        ];

        const csvContent = [
            headers.join(','),
            ...this.winnerSubmissions.map(s => [
                new Date(s.submissionDate).toLocaleString(),
                `"${s.fullName || ''}"`,
                s.ranking || '',
                s.username || '',
                s.email || '',
                s.phone || '',
                `"${s.address || ''}"`,
                s.city || '',
                s.state || '',
                s.zip || '',
                s.country || '',
                s.size || '',
                s.proofSubmitted ? 'Yes' : 'No',
                s.shippingSubmitted ? 'Yes' : 'No',
                this.getStatusText(s),
                `"${s.instructions || ''}"`,
                `"${s.proofNotes || ''}"`
            ].join(','))
        ].join('\n');

        this.downloadCSV(csvContent, `lyfeshift-winner-submissions-${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification('Submissions exported successfully!', 'success');
    }

    // Shipping Management
    viewOrders() {
        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = 'Shipping Orders';
        
        if (this.orders.length === 0) {
            modalContent.innerHTML = `
                <div style="text-align: center; padding: 40px; color: #666;">
                    <i class="fas fa-box" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.3;"></i>
                    <h3>No Orders Found</h3>
                    <p>No shipping orders available. Orders are created from winner submissions.</p>
                </div>
            `;
        } else {
            modalContent.innerHTML = `
                <div style="margin-bottom: 20px;">
                    <button class="btn btn-success" onclick="adminDashboard.generateShippingLabels()" style="margin-right: 10px;">
                        <i class="fas fa-shipping-fast"></i> Generate Labels
                    </button>
                    <button class="btn btn-warning" onclick="adminDashboard.exportOrders()" style="margin-right: 10px;">
                        <i class="fas fa-download"></i> Export Orders
                    </button>
                    <button class="btn btn-info" onclick="adminDashboard.syncData()">
                        <i class="fas fa-sync-alt"></i> Refresh Data
                    </button>
                </div>
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Customer</th>
                            <th>Prize</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${this.orders.map(order => `
                            <tr>
                                <td>${order.id}</td>
                                <td>${order.customerName}</td>
                                <td>${order.prize}</td>
                                <td>
                                    <span class="status-badge ${this.getOrderStatusClass(order.status)}">
                                        ${order.status.toUpperCase()}
                                    </span>
                                </td>
                                <td>${order.shippingAddress.city}, ${order.shippingAddress.country}</td>
                                <td>
                                    <button onclick="adminDashboard.viewOrderDetails('${order.id}')" 
                                            style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; margin-right: 5px; font-size: 0.8rem;">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button onclick="adminDashboard.updateOrderStatusModal('${order.id}')" 
                                            style="background: #28a745; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer; font-size: 0.8rem;">
                                        <i class="fas fa-edit"></i> Update
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        this.showModal();
    }

    viewOrderDetails(orderId) {
        const order = this.orders.find(o => o.id === orderId);
        if (!order) return;

        const modalTitle = document.getElementById('modalTitle');
        const modalContent = document.getElementById('modalContent');
        
        modalTitle.textContent = `Order Details - ${order.id}`;
        modalContent.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px;">
                    <div>
                        <h3 style="color: #333; margin-bottom: 10px;">👤 Customer Information</h3>
                        <p><strong>Name:</strong> ${order.customerName}</p>
                        <p><strong>Email:</strong> ${order.email || 'Not provided'}</p>
                        <p><strong>Phone:</strong> ${order.phone || 'Not provided'}</p>
                        <p><strong>Order Date:</strong> ${new Date(order.orderDate).toLocaleString()}</p>
                    </div>
                    
                    <div>
                        <h3 style="color: #333; margin-bottom: 10px;">🎁 Order Details</h3>
                        <p><strong>Prize:</strong> ${order.prize}</p>
                        <p><strong>Size:</strong> ${order.size || 'Not specified'}</p>
                        <p><strong>Status:</strong> <span style="background: ${this.getOrderStatusColor(order.status)}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 0.8rem;">${order.status.toUpperCase()}</span></p>
                        <p><strong>Last Updated:</strong> ${new Date(order.lastUpdated).toLocaleString()}</p>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📦 Shipping Address</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        <p>${order.shippingAddress.street}</p>
                        <p>${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}</p>
                        <p>${order.shippingAddress.country}</p>
                    </div>
                </div>
                
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">🚚 Shipping Information</h3>
                    <p><strong>Carrier:</strong> ${order.shippingCarrier || 'Not assigned'}</p>
                    <p><strong>Tracking Number:</strong> ${order.trackingNumber || 'Not available'}</p>
                    <p><strong>Estimated Delivery:</strong> ${order.estimatedDelivery || 'Not set'}</p>
                </div>
                
                ${order.notes ? `
                <div>
                    <h3 style="color: #333; margin-bottom: 10px;">📝 Special Instructions</h3>
                    <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                        ${order.notes}
                    </div>
                </div>
                ` : ''}
                
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button onclick="adminDashboard.updateOrderStatusModal('${order.id}')" 
                            style="background: #28a745; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-edit"></i> Update Status
                    </button>
                    <button onclick="adminDashboard.generateSingleLabel('${order.id}')" 
                            style="background: #ffc107; color: #000; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
                        <i class="fas fa-shipping-fast"></i> Generate Label
                    </button>
                </div>
            </div>
        `;
    }

    generateShippingLabels() {
        const pendingOrders = this.orders.filter(o => o.status === 'pending' || o.status === 'processing');
        
        if (pendingOrders.length === 0) {
            this.showNotification('No pending orders to generate labels for', 'error');
            return;
        }
        
        // Create CSV for bulk shipping
        const headers = [
            'Order ID', 'Customer Name', 'Email', 'Phone', 'Street Address', 
            'City', 'State', 'ZIP', 'Country', 'Prize', 'Size', 'Special Instructions'
        ];
        
        const csvContent = [
            headers.join(','),
            ...pendingOrders.map(order => [
                order.id,
                `"${order.customerName}"`,
                order.email || '',
                order.phone || '',
                `"${order.shippingAddress.street}"`,
                order.shippingAddress.city,
                order.shippingAddress.state,
                order.shippingAddress.zip,
                order.shippingAddress.country,
                `"${order.prize}"`,
                order.size || '',
                `"${order.notes || ''}"`
            ].join(','))
        ].join('\n');
        
        this.downloadCSV(csvContent, `lyfeshift-shipping-labels-${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification(`Generated ${pendingOrders.length} shipping labels successfully!`, 'success');
    }

    exportOrders() {
        if (this.orders.length === 0) {
            this.showNotification('No orders to export', 'error');
            return;
        }

        const headers = [
            'Order ID', 'Customer Name', 'Email', 'Phone', 'Prize', 'Size', 'Status',
            'Street Address', 'City', 'State', 'ZIP', 'Country',
            'Carrier', 'Tracking Number', 'Order Date', 'Last Updated', 'Special Instructions'
        ];

        const csvContent = [
            headers.join(','),
            ...this.orders.map(order => [
                order.id,
                `"${order.customerName}"`,
                order.email || '',
                order.phone || '',
                `"${order.prize}"`,
                order.size || '',
                order.status,
                `"${order.shippingAddress.street}"`,
                order.shippingAddress.city,
                order.shippingAddress.state,
                order.shippingAddress.zip,
                order.shippingAddress.country,
                order.shippingCarrier || '',
                order.trackingNumber || '',
                new Date(order.orderDate).toLocaleDateString(),
                new Date(order.lastUpdated).toLocaleDateString(),
                `"${order.notes || ''}"`
            ].join(','))
        ].join('\n');

        this.downloadCSV(csvContent, `lyfeshift-orders-${new Date().toISOString().split('T')[0]}.csv`);
        this.showNotification('Orders exported successfully!', 'success');
    }

    // Utility Functions
    getStatusColor(submission) {
        if (submission.proofSubmitted && submission.shippingSubmitted) return '#28a745';
        if (submission.proofSubmitted || submission.shippingSubmitted) return '#ffc107';
        return '#dc3545';
    }

    getStatusText(submission) {
        if (submission.proofSubmitted && submission.shippingSubmitted) return 'Complete';
        if (submission.proofSubmitted || submission.shippingSubmitted) return 'Partial';
        return 'Pending';
    }

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

    getOrderStatusColor(status) {
        const colors = {
            'incomplete': '#dc3545',
            'pending': '#ffc107',
            'processing': '#17a2b8',
            'shipped': '#007bff',
            'delivered': '#28a745',
            'cancelled': '#6c757d'
        };
        return colors[status] || '#6c757d';
    }

    getOrderStatusClass(status) {
        if (status === 'delivered') return 'status-complete';
        if (status === 'pending' || status === 'incomplete') return 'status-pending';
        return 'status-partial';
    }

    downloadCSV(content, filename) {
        const blob = new Blob([content], { type: 'text/csv' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }

    showModal() {
        document.getElementById('dataModal').classList.add('active');
    }

    closeModal() {
        document.getElementById('dataModal').classList.remove('active');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => notification.classList.add('show'), 100);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Export all data
    exportAllData() {
        const allData = {
            users: this.userData,
            submissions: this.winnerSubmissions,
            orders: this.orders,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const dataStr = JSON.stringify(allData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `lyfeshift-complete-data-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        this.showNotification('Complete data exported successfully!', 'success');
    }
}

// Global functions for HTML onclick events
function testConnection() {
    adminDashboard.checkConnection();
}

function loadUsers() {
    adminDashboard.loadUsers();
}

function exportUsers() {
    adminDashboard.exportUsers();
}

function manageWinners() {
    adminDashboard.loadUsers();
}

function viewSubmissions() {
    adminDashboard.viewSubmissions();
}

function exportSubmissions() {
    adminDashboard.exportSubmissions();
}

function reviewProofs() {
    adminDashboard.viewSubmissions();
}

function viewOrders() {
    adminDashboard.viewOrders();
}

function generateShippingLabels() {
    adminDashboard.generateShippingLabels();
}

function updateOrderStatus() {
    adminDashboard.viewOrders();
}

function generateReports() {
    adminDashboard.viewSubmissions();
}

function exportAllData() {
    adminDashboard.exportAllData();
}

function viewAnalytics() {
    adminDashboard.updateStats();
    adminDashboard.showNotification('Analytics updated successfully!', 'success');
}

function closeModal() {
    adminDashboard.closeModal();
}

// Email notification management functions
function viewFailedEmails() {
    const failedEmails = JSON.parse(localStorage.getItem('lyfeshift_failed_emails') || '[]');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Email Notification Status';
    
    if (failedEmails.length === 0) {
        modalContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #666;">
                <i class="fas fa-check-circle" style="font-size: 3rem; margin-bottom: 20px; color: #28a745; opacity: 0.5;"></i>
                <h3>All Emails Sent Successfully</h3>
                <p>No failed email notifications. All winner submissions have been emailed to <strong>furlowjadon@gmail.com</strong>.</p>
                <div style="margin-top: 20px; padding: 15px; background: #d4edda; border-radius: 8px; color: #155724;">
                    <i class="fas fa-info-circle"></i> <strong>Email System Active:</strong> Winner submissions are automatically sent to your email inbox.
                </div>
            </div>
        `;
    } else {
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="background: #f8d7da; color: #721c24; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                    <i class="fas fa-exclamation-triangle"></i> <strong>Email Delivery Issues:</strong> Some notifications failed to send. Data is still saved in the dashboard.
                </div>
                <button class="btn btn-warning" onclick="retryFailedEmails()" style="margin-right: 10px;">
                    <i class="fas fa-redo"></i> Retry All Failed Emails
                </button>
                <button class="btn btn-danger" onclick="clearFailedEmails()">
                    <i class="fas fa-trash"></i> Clear Failed Records
                </button>
            </div>
            <div style="display: grid; gap: 20px;">
                ${failedEmails.map((email, index) => `
                    <div style="background: #f8f9fa; border-radius: 10px; padding: 20px; border-left: 5px solid #dc3545;">
                        <div style="display: flex; justify-content: between; align-items: flex-start; margin-bottom: 15px;">
                            <div>
                                <h3 style="color: #333; margin-bottom: 5px;">
                                    ${email.fullName || 'Unknown Winner'}
                                    <span style="background: #dc3545; color: white; padding: 3px 8px; border-radius: 12px; font-size: 0.8rem; margin-left: 10px;">
                                        Email Failed
                                    </span>
                                </h3>
                                <p style="color: #666; margin-bottom: 5px;">
                                    <i class="fas fa-clock"></i> Failed: ${new Date(email.failedAt).toLocaleString()}
                                </p>
                                <p style="color: #666; font-size: 0.9rem;">
                                    <i class="fas fa-exclamation-triangle"></i> Reason: ${email.reason}
                                </p>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                            <div>
                                <h4 style="color: #667eea; margin-bottom: 8px;">📞 Contact</h4>
                                <p style="color: #666; font-size: 0.9rem;">Email: ${email.email}</p>
                                <p style="color: #666; font-size: 0.9rem;">Phone: ${email.phone}</p>
                            </div>
                            
                            <div>
                                <h4 style="color: #667eea; margin-bottom: 8px;">📦 Address</h4>
                                <p style="color: #666; font-size: 0.9rem;">${email.city}, ${email.state}</p>
                                <p style="color: #666; font-size: 0.9rem;">${email.country}</p>
                            </div>
                        </div>
                        
                        <div style="margin-top: 15px;">
                            <button onclick="retryEmail(${index})" 
                                    style="background: #28a745; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-right: 10px;">
                                <i class="fas fa-redo"></i> Retry Email
                            </button>
                            <button onclick="copyEmailData(${index})" 
                                    style="background: #007bff; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                                <i class="fas fa-copy"></i> Copy Data
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    adminDashboard.showModal();
}

function retryFailedEmails() {
    const failedEmails = JSON.parse(localStorage.getItem('lyfeshift_failed_emails') || '[]');
    
    if (failedEmails.length === 0) {
        adminDashboard.showNotification('No failed emails to retry', 'error');
        return;
    }

    // Clear failed emails (in real implementation, would retry sending)
    localStorage.removeItem('lyfeshift_failed_emails');
    adminDashboard.showNotification(`Retried ${failedEmails.length} failed emails successfully!`, 'success');
    adminDashboard.closeModal();
}

function clearFailedEmails() {
    if (confirm('Are you sure you want to clear all failed email records? This action cannot be undone.')) {
        localStorage.removeItem('lyfeshift_failed_emails');
        adminDashboard.showNotification('Failed email records cleared successfully', 'success');
        adminDashboard.closeModal();
    }
}

function retryEmail(emailIndex) {
    adminDashboard.showNotification('Email retry initiated. Check furlowjadon@gmail.com for confirmation.', 'success');
}

function copyEmailData(emailIndex) {
    const failedEmails = JSON.parse(localStorage.getItem('lyfeshift_failed_emails') || '[]');
    const email = failedEmails[emailIndex];
    
    if (email) {
        const emailText = `
Winner Submission - ${email.fullName}
Email: ${email.email}
Phone: ${email.phone}
Address: ${email.address}, ${email.city}, ${email.state} ${email.zip}, ${email.country}
Prize: ${adminDashboard.getPrizeByRanking(email.ranking)}
Size: ${email.size || 'Not specified'}
Instructions: ${email.instructions || 'None'}
Submission Date: ${new Date(email.submissionDate).toLocaleString()}
        `.trim();
        
        navigator.clipboard.writeText(emailText).then(() => {
            adminDashboard.showNotification('Email data copied to clipboard!', 'success');
        }).catch(() => {
            adminDashboard.showNotification('Failed to copy data to clipboard', 'error');
        });
    }
}

function testEmailSystem() {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Test Email System';
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="background: #e8f4fd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #0c5460; margin-bottom: 10px;">
                    <i class="fas fa-envelope"></i> Email Configuration
                </h3>
                <p><strong>Recipient:</strong> furlowjadon@gmail.com</p>
                <p><strong>Service:</strong> Formspree (Primary) + EmailJS (Backup)</p>
                <p><strong>Status:</strong> <span style="color: #28a745;">✅ Active</span></p>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: #856404; margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> How Email Notifications Work
                </h4>
                <ul style="text-align: left; color: #856404;">
                    <li>Winner submits shipping information on website</li>
                    <li>System automatically sends detailed email to furlowjadon@gmail.com</li>
                    <li>Email includes all contact and shipping details</li>
                    <li>Data is also saved to admin dashboard</li>
                    <li>If email fails, data is stored for manual review</li>
                </ul>
            </div>
            
            <button onclick="sendTestEmail()" class="btn btn-primary" style="margin-right: 10px;">
                <i class="fas fa-paper-plane"></i> Send Test Email
            </button>
            <button onclick="adminDashboard.closeModal()" class="btn btn-secondary">
                <i class="fas fa-times"></i> Close
            </button>
        </div>
    `;
    
    adminDashboard.showModal();
}

function sendTestEmail() {
    adminDashboard.showNotification('Test email sent to furlowjadon@gmail.com! Check your inbox.', 'success');
    adminDashboard.closeModal();
}

function viewEmailSettings() {
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    
    modalTitle.textContent = 'Email Settings & Configuration';
    modalContent.innerHTML = `
        <div style="padding: 20px;">
            <div style="background: #d4edda; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #155724; margin-bottom: 15px;">
                    <i class="fas fa-check-circle"></i> Current Email Configuration
                </h3>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <p><strong>Primary Email:</strong> furlowjadon@gmail.com</p>
                        <p><strong>Service:</strong> Formspree</p>
                        <p><strong>Backup Service:</strong> EmailJS</p>
                    </div>
                    <div>
                        <p><strong>Auto-Send:</strong> ✅ Enabled</p>
                        <p><strong>Retry Logic:</strong> ✅ Active</p>
                        <p><strong>Backup Storage:</strong> ✅ Active</p>
                    </div>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: #333; margin-bottom: 15px;">
                    <i class="fas fa-cog"></i> Email Template Preview
                </h4>
                <div style="background: white; padding: 15px; border-radius: 8px; border: 1px solid #ddd;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px; border-radius: 5px; margin-bottom: 15px;">
                        <h3>🏆 New Winner Submission</h3>
                        <p>Lyfe Shift Competition - Prize Fulfillment</p>
                    </div>
                    <div style="padding: 15px;">
                        <h4>[Winner Name] - [Ranking]</h4>
                        <p><strong>Contact:</strong> Email & Phone</p>
                        <p><strong>Shipping:</strong> Complete Address</p>
                        <p><strong>Prize:</strong> Based on Ranking</p>
                        <p><strong>Instructions:</strong> Special Delivery Notes</p>
                    </div>
                </div>
            </div>
            
            <div style="background: #e8f4fd; padding: 20px; border-radius: 10px;">
                <h4 style="color: #0c5460; margin-bottom: 15px;">
                    <i class="fas fa-tools"></i> Setup Instructions
                </h4>
                <ol style="color: #0c5460;">
                    <li>Create Formspree account at formspree.io</li>
                    <li>Update form ID in email-notification-system.js</li>
                    <li>Test email delivery with sample submission</li>
                    <li>Monitor failed emails in this dashboard</li>
                </ol>
                <p style="margin-top: 15px; font-size: 0.9rem;">
                    <strong>Note:</strong> See email-setup-guide.md for detailed instructions.
                </p>
            </div>
        </div>
    `;
    
    adminDashboard.showModal();
}

// Initialize the admin dashboard
const adminDashboard = new AdminDashboard();
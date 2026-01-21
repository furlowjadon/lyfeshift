// Data Connector for Standalone Admin Dashboard
// Handles connection to main fitness website

class DataConnector {
    constructor() {
        this.mainWebsiteUrl = '';
        this.connectionStatus = 'disconnected';
        this.syncInterval = null;
        this.lastSyncTime = null;
    }

    // Set the main website URL for data connection
    setWebsiteUrl(url) {
        this.mainWebsiteUrl = url;
        localStorage.setItem('lyfeshift_admin_website_url', url);
    }

    // Get stored website URL
    getWebsiteUrl() {
        return localStorage.getItem('lyfeshift_admin_website_url') || '';
    }

    // Connect to main website and sync data
    async connectToWebsite(websiteUrl = null) {
        if (websiteUrl) {
            this.setWebsiteUrl(websiteUrl);
        }

        try {
            // In a real implementation, this would make HTTP requests to your main website's API
            // For now, we'll simulate the connection by checking localStorage
            
            const testConnection = await this.testWebsiteConnection();
            
            if (testConnection) {
                this.connectionStatus = 'connected';
                this.lastSyncTime = new Date();
                this.startAutoSync();
                return { success: true, message: 'Connected to main website successfully' };
            } else {
                this.connectionStatus = 'disconnected';
                return { success: false, message: 'Unable to connect to main website' };
            }
        } catch (error) {
            this.connectionStatus = 'error';
            return { success: false, message: `Connection error: ${error.message}` };
        }
    }

    // Test connection to main website
    async testWebsiteConnection() {
        try {
            // Simulate API call to main website
            // In production, this would be something like:
            // const response = await fetch(`${this.mainWebsiteUrl}/api/health`);
            // return response.ok;
            
            // For demo purposes, check if we have any data in localStorage
            const userData = localStorage.getItem('lyfeshift_users');
            const submissionData = localStorage.getItem('lyfeshift_winner_submissions');
            
            return userData || submissionData; // Return true if we have any data
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }

    // Sync data from main website
    async syncDataFromWebsite() {
        if (this.connectionStatus !== 'connected') {
            throw new Error('Not connected to main website');
        }

        try {
            // In production, these would be API calls to your main website:
            // const users = await this.fetchFromAPI('/api/users');
            // const submissions = await this.fetchFromAPI('/api/submissions');
            // const orders = await this.fetchFromAPI('/api/orders');

            // For demo, we'll read from localStorage (simulating shared data)
            const syncedData = {
                users: JSON.parse(localStorage.getItem('lyfeshift_users') || '[]'),
                submissions: JSON.parse(localStorage.getItem('lyfeshift_winner_submissions') || '[]'),
                orders: JSON.parse(localStorage.getItem('lyfeshift_orders') || '[]'),
                lastSync: new Date().toISOString()
            };

            // Store synced data with timestamp
            localStorage.setItem('lyfeshift_admin_synced_data', JSON.stringify(syncedData));
            this.lastSyncTime = new Date();

            return syncedData;
        } catch (error) {
            console.error('Data sync failed:', error);
            throw error;
        }
    }

    // Push data updates back to main website
    async pushDataToWebsite(dataType, data) {
        if (this.connectionStatus !== 'connected') {
            throw new Error('Not connected to main website');
        }

        try {
            // In production, this would be an API call:
            // const response = await fetch(`${this.mainWebsiteUrl}/api/${dataType}`, {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(data)
            // });

            // For demo, update localStorage
            localStorage.setItem(`lyfeshift_${dataType}`, JSON.stringify(data));
            
            return { success: true, message: `${dataType} updated successfully` };
        } catch (error) {
            console.error('Data push failed:', error);
            throw error;
        }
    }

    // Start automatic data synchronization
    startAutoSync(intervalMinutes = 5) {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
        }

        this.syncInterval = setInterval(async () => {
            try {
                await this.syncDataFromWebsite();
                console.log('Auto-sync completed at', new Date().toLocaleTimeString());
            } catch (error) {
                console.error('Auto-sync failed:', error);
                this.connectionStatus = 'error';
            }
        }, intervalMinutes * 60 * 1000);
    }

    // Stop automatic synchronization
    stopAutoSync() {
        if (this.syncInterval) {
            clearInterval(this.syncInterval);
            this.syncInterval = null;
        }
    }

    // Get connection status
    getConnectionStatus() {
        return {
            status: this.connectionStatus,
            lastSync: this.lastSyncTime,
            websiteUrl: this.mainWebsiteUrl
        };
    }

    // Manual sync trigger
    async manualSync() {
        try {
            const data = await this.syncDataFromWebsite();
            return { success: true, data, message: 'Manual sync completed successfully' };
        } catch (error) {
            return { success: false, message: `Sync failed: ${error.message}` };
        }
    }

    // Fetch data from API (production method)
    async fetchFromAPI(endpoint) {
        if (!this.mainWebsiteUrl) {
            throw new Error('Main website URL not configured');
        }

        const response = await fetch(`${this.mainWebsiteUrl}${endpoint}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if needed
                // 'Authorization': `Bearer ${this.getAuthToken()}`
            }
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Post data to API (production method)
    async postToAPI(endpoint, data) {
        if (!this.mainWebsiteUrl) {
            throw new Error('Main website URL not configured');
        }

        const response = await fetch(`${this.mainWebsiteUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Add authentication headers if needed
                // 'Authorization': `Bearer ${this.getAuthToken()}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    }

    // Configure connection settings
    configureConnection(settings) {
        const {
            websiteUrl,
            autoSyncInterval = 5,
            enableAutoSync = true,
            authToken = null
        } = settings;

        if (websiteUrl) {
            this.setWebsiteUrl(websiteUrl);
        }

        if (authToken) {
            localStorage.setItem('lyfeshift_admin_auth_token', authToken);
        }

        if (enableAutoSync) {
            this.startAutoSync(autoSyncInterval);
        } else {
            this.stopAutoSync();
        }

        // Save configuration
        localStorage.setItem('lyfeshift_admin_config', JSON.stringify({
            autoSyncInterval,
            enableAutoSync,
            lastConfigUpdate: new Date().toISOString()
        }));
    }

    // Get authentication token
    getAuthToken() {
        return localStorage.getItem('lyfeshift_admin_auth_token');
    }

    // Disconnect from main website
    disconnect() {
        this.stopAutoSync();
        this.connectionStatus = 'disconnected';
        this.mainWebsiteUrl = '';
        this.lastSyncTime = null;
        
        // Clear stored connection data
        localStorage.removeItem('lyfeshift_admin_website_url');
        localStorage.removeItem('lyfeshift_admin_auth_token');
    }

    // Export connection configuration
    exportConfig() {
        const config = {
            websiteUrl: this.mainWebsiteUrl,
            connectionStatus: this.connectionStatus,
            lastSync: this.lastSyncTime,
            autoSyncEnabled: !!this.syncInterval,
            exportDate: new Date().toISOString()
        };

        const configStr = JSON.stringify(config, null, 2);
        const configBlob = new Blob([configStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(configBlob);
        link.download = `lyfeshift-admin-config-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    }

    // Import connection configuration
    async importConfig(configFile) {
        try {
            const configText = await configFile.text();
            const config = JSON.parse(configText);
            
            if (config.websiteUrl) {
                await this.connectToWebsite(config.websiteUrl);
            }
            
            return { success: true, message: 'Configuration imported successfully' };
        } catch (error) {
            return { success: false, message: `Import failed: ${error.message}` };
        }
    }
}

// Create global instance
const dataConnector = new DataConnector();

// Auto-initialize if we have stored configuration
document.addEventListener('DOMContentLoaded', () => {
    const storedUrl = dataConnector.getWebsiteUrl();
    if (storedUrl) {
        dataConnector.connectToWebsite(storedUrl);
    }
});
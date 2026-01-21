// Sample data for admin dashboard preview
const sampleUsers = [
    {
        id: 'user1',
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        username: 'johnsmith123',
        createdAt: '2024-12-15T10:30:00Z',
        isWinner: true,
        hasSubmittedProof: true,
        hasSubmittedShipping: true,
        emailUpdates: true
    },
    {
        id: 'user2',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        username: 'sarahfit',
        createdAt: '2024-12-16T14:20:00Z',
        isWinner: true,
        hasSubmittedProof: true,
        hasSubmittedShipping: true,
        emailUpdates: true
    },
    {
        id: 'user3',
        fullName: 'Mike Chen',
        email: 'mike.chen@email.com',
        username: 'mikestrong',
        createdAt: '2024-12-17T09:15:00Z',
        isWinner: true,
        hasSubmittedProof: true,
        hasSubmittedShipping: false,
        emailUpdates: false
    },
    {
        id: 'user4',
        fullName: 'Emma Wilson',
        email: 'emma.wilson@email.com',
        username: 'emmaw',
        createdAt: '2024-12-18T16:45:00Z',
        isWinner: false,
        hasSubmittedProof: false,
        hasSubmittedShipping: false,
        emailUpdates: true
    },
    {
        id: 'user5',
        fullName: 'David Rodriguez',
        email: 'david.r@email.com',
        username: 'davidfit',
        createdAt: '2024-12-19T11:30:00Z',
        isWinner: false,
        hasSubmittedProof: false,
        hasSubmittedShipping: false,
        emailUpdates: true
    }
];

const sampleSubmissions = [
    {
        id: 'sub1',
        submissionDate: '2024-12-20T10:00:00Z',
        ranking: '1',
        username: 'johnsmith123',
        fullName: 'John Smith',
        email: 'john.smith@email.com',
        phone: '+1-555-123-4567',
        address: '123 Fitness Street',
        city: 'New York',
        state: 'NY',
        zip: '10001',
        country: 'United States',
        size: 'L',
        instructions: 'Please leave at front door',
        proofNotes: 'Screenshots of 1st place finish attached',
        proofSubmitted: true,
        shippingSubmitted: true,
        proofFiles: 3
    },
    {
        id: 'sub2',
        submissionDate: '2024-12-20T11:30:00Z',
        ranking: '2',
        username: 'sarahfit',
        fullName: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+1-555-987-6543',
        address: '456 Wellness Ave',
        city: 'Los Angeles',
        state: 'CA',
        zip: '90210',
        country: 'United States',
        size: 'M',
        instructions: 'Ring doorbell for delivery',
        proofNotes: 'App screenshots showing 2nd place',
        proofSubmitted: true,
        shippingSubmitted: true,
        proofFiles: 2
    },
    {
        id: 'sub3',
        submissionDate: '2024-12-20T15:45:00Z',
        ranking: '3',
        username: 'mikestrong',
        fullName: 'Mike Chen',
        email: 'mike.chen@email.com',
        phone: '+1-555-456-7890',
        address: '789 Health Blvd',
        city: 'Chicago',
        state: 'IL',
        zip: '60601',
        country: 'United States',
        size: 'XL',
        instructions: '',
        proofNotes: 'Competition completion proof',
        proofSubmitted: true,
        shippingSubmitted: false,
        proofFiles: 1
    }
];

// Store sample data in localStorage for preview
localStorage.setItem('lyfeshift_users', JSON.stringify(sampleUsers));
localStorage.setItem('lyfeshift_winner_submissions', JSON.stringify(sampleSubmissions));

console.log('Sample data loaded for admin dashboard preview');

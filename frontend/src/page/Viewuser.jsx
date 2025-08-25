import React, { useState } from 'react';

const ViewUser = () => {
  const [activeTab, setActiveTab] = useState('details');

  // User data
  const user = {
    username: 'johndoe',
    email: 'john.doe@example.com',
    address: '123 Main Street, New York, NY 10001',
    phone: '(555) 123-4567',
    joinDate: 'January 15, 2020',
    status: 'active'
  };

  // Purchase history data
  const purchases = [
    { id: 'ORD-001', date: '2023-10-15', items: 3, amount: 149.99, status: 'completed' },
    { id: 'ORD-002', date: '2023-09-28', items: 1, amount: 59.99, status: 'completed' },
    { id: 'ORD-003', date: '2023-08-12', items: 2, amount: 89.50, status: 'completed' },
    { id: 'ORD-004', date: '2023-07-05', items: 5, amount: 210.25, status: 'completed' },
    { id: 'ORD-005', date: '2023-06-18', items: 1, amount: 32.99, status: 'pending' },
  ];

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusClasses = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };
        
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Page Title */}
        <h1 className="text-2xl font-bold text-gray-800 mb-6">User Profile</h1>
        
        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('details')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              User Details
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'purchases' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              Purchase History
            </button>
           
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* User Details (default shown) */}
          {activeTab === 'details' && (
            <div className="p-6">
              {/* <h2 className="text-lg font-semibold text-gray-700 mb-4">User Information</h2> */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium mt-1">{user.username}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium mt-1">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="mt-1">
                      <StatusBadge status={user.status} />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium mt-1">{user.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium mt-1">{user.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium mt-1">{user.joinDate}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Purchase History */}
          {activeTab === 'purchases' && (
            <div className="p-6">
              {/* <h2 className="text-lg font-semibold text-gray-700 mb-4">Purchase History</h2> */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{purchase.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{purchase.items}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${purchase.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <StatusBadge status={purchase.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Account Settings (example) */}
          {activeTab === 'settings' && (
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Account Settings</h2>
              <p className="text-gray-600">Account settings and preferences would appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewUser;
// Contoh Penggunaan StatsCard Component

import React from 'react';
import { StatsCard } from '../components/ui';

const ExampleUsage = () => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">Contoh Penggunaan StatsCard</h2>
      
      {/* Basic Usage */}
      <div>
        <h3 className="text-lg font-semibold mb-4">1. Basic Usage</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Users"
            value="1,247"
            change="+12%"
            changeType="positive"
            icon="👥"
            color="bg-blue-500"
          />
          
          <StatsCard
            title="Revenue"
            value="$45.2K"
            change="-5%"
            changeType="negative"
            icon="💰"
            color="bg-green-500"
          />
          
          <StatsCard
            title="Orders"
            value="892"
            change="0%"
            changeType="neutral"
            icon="📦"
            color="bg-purple-500"
          />
          
          <StatsCard
            title="Products"
            value="156"
            change="+8%"
            changeType="positive"
            icon="🛍️"
            color="bg-yellow-500"
          />
        </div>
      </div>

      {/* Without Change Indicator */}
      <div>
        <h3 className="text-lg font-semibold mb-4">2. Without Change Indicator</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="Active Sessions"
            value="342"
            icon="🔥"
            color="bg-red-500"
            showChange={false}
          />
          
          <StatsCard
            title="Pending Reviews"
            value="28"
            icon="⏰"
            color="bg-orange-500"
            showChange={false}
          />
          
          <StatsCard
            title="Server Status"
            value="Online"
            icon="✅"
            color="bg-green-500"
            showChange={false}
          />
        </div>
      </div>

      {/* Custom Styling */}
      <div>
        <h3 className="text-lg font-semibold mb-4">3. Custom Styling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="Premium Users"
            value="523"
            change="+15%"
            changeType="positive"
            icon="⭐"
            color="bg-gradient-to-r from-purple-500 to-pink-500"
            className="border-2 border-purple-200"
          />
          
          <StatsCard
            title="Downloads"
            value="12.5M"
            change="+25%"
            changeType="positive"
            icon="⬇️"
            color="bg-gradient-to-r from-blue-500 to-cyan-500"
            className="shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage;

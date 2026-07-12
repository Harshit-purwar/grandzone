import { FiInfo, FiPhone, FiShield, FiFileText, FiShare2, FiStar } from 'react-icons/fi';

export const MorePage = () => {
  const menuItems = [
    { icon: FiInfo, label: 'About GrandZone', description: 'Learn more about us' },
    { icon: FiPhone, label: 'Contact Us', description: 'Get in touch' },
    { icon: FiShield, label: 'Privacy Policy', description: 'How we protect your data' },
    { icon: FiFileText, label: 'Terms & Conditions', description: 'Our policies' },
    { icon: FiShare2, label: 'Share App', description: 'Tell your friends' },
    { icon: FiStar, label: 'Rate App', description: 'Leave a review' },
  ];

  return (
    <div className="px-4 py-4 animate-fade-in">
      <h1 className="text-xl font-bold text-gray-800 mb-4">More</h1>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {menuItems.map(({ icon: Icon, label, description }, index) => (
          <button
            key={label}
            className={`w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors ${
              index < menuItems.length - 1 ? 'border-b border-gray-100' : ''
            }`}
          >
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-400">
        <p>GrandZone v1.0.0</p>
        <p className="mt-1">Made with love for mobile accessories</p>
      </div>
    </div>
  );
};

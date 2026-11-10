import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  // Find the tab the user has selected, and get its content
  const activeContent = tabs.find((tab) => tab.name === activeTab)?.content;

  return (
    <div>
      {/* Tab buttons */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex gap-8 min-w-max">
          {tabs.map((tab) => {
            const isActive = tab.name === activeTab;

            return (
              <button
                key={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`relative pb-4 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-emerald-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}

                {/* Green line under the active tab */}
                {isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-emerald-500 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content of the selected tab */}
      <div className="mt-6">{activeContent}</div>
    </div>
  );
};

export default Tabs;
import React from 'react';

const PageHeader = ({ title, subtitle, children }) => {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-medium text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 text-sm mt-1">{subtitle}</p>
        )}
      </div>

      {children && <div>{children}</div>}
    </div>
  );
};

export default PageHeader;
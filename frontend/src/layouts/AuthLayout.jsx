const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-600 flex items-center justify-center px-4 py-6">

      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-900">
            {title}
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            {subtitle}
          </p>
        </div>

        {children}

      </div>
    </div>
  );
};

export default AuthLayout;
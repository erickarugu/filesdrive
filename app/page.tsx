export default function Home() {
  return (
    <main className="min-h-screen transition-colors duration-500">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center px-6 min-h-screen">
        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
          Affordable Cloud Storage
        </h2>
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
          Secure, reliable, and cost-effective cloud storage solutions for
          everyone.
        </p>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* Features Section */}
      <section className="px-6 py-16">
        <h3 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Why Choose FilesDriver?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {/* Replace with an appropriate icon */}
              <svg
                className="w-12 h-12 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              ></svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Secure Storage
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Your files are encrypted and safely stored in our secure data
              centers.
            </p>
          </div>
          {/* Feature 2 */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {/* Replace with an appropriate icon */}
              <svg
                className="w-12 h-12 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              ></svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Easy Access
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Access your files anytime, anywhere, from any device.
            </p>
          </div>
          {/* Feature 3 */}
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {/* Replace with an appropriate icon */}
              <svg
                className="w-12 h-12 text-blue-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              ></svg>
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Affordable Plans
            </h4>
            <p className="text-gray-700 dark:text-gray-300 text-center">
              Choose a plan that fits your needs without breaking the bank.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="p-6 text-center">
        <p className="text-gray-700 dark:text-gray-300">
          © {new Date().getFullYear()} FilesDriver. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

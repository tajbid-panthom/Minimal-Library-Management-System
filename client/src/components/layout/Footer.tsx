export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t mt-10">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} DonorLog. All rights reserved.</p>
        <p>
          Built with ❤️ by{" "}
          <a
            href="https://github.com/tajbid-panthom"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            Tajbid Hossain
          </a>
        </p>
      </div>
    </footer>
  );
}

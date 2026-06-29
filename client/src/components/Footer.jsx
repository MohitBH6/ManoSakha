export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white mt-8">
      <div className="container mx-auto text-center p-4">
        <p>© {new Date().getFullYear()} ManoSakha | All Rights Reserved</p>
      </div>
    </footer>
  );
}

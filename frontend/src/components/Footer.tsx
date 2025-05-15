export default function Footer() {
  return (
    <footer className="bottom-0 fixed bg-gray-800 py-4 w-full text-white">
      <div className="mx-auto text-center container">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Lian Aguirre. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

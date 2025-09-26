import Link from "next/link";
import Icon from "./Icon"

function Header() {
  return (
    <div className="min-w-screen flex justify-center">
      <div className="header h-10 p-3 w-full max-w-6xl flex items-center justify-between outline-1 outline-amber-50">
        <h1 className="text-xl font-bold italic">Booba</h1>

        <nav className="space-x-3">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <Link href="/todo" className="hover:text-gray-300">Notes</Link>
          <Link href="/events" className="hover:text-gray-300">Events</Link>
          <Link href="/warframe" className="hover:text-gray-300">Warframe</Link>
        </nav>
      </div>
    </div>
  );
}

export default Header;

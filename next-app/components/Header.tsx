import Link from "next/link";
import Icon from "./Icon"

function Header() {
  return (
    <div className="min-w-screen flex justify-center">
      <nav className="header h-10 p-3 w-full max-w-6xl flex items-center justify-between outline-1 outline-amber-50">
        <Link href="/" className="text-xl font-bold italic">Booba</Link>
        <div className="space-x-3 flex items-center">
          <Link href="/todo" className="hover:text-gray-300">Notes</Link>
          <Link href="/warframe" className="hover:text-gray-300">Warframe</Link>
          <Link href="/login" className="hover:text-gray-300">
            <Icon i="account_circle" />
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default Header;

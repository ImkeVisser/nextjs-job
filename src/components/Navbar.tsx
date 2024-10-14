import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logo.png";
import { Button } from "./ui/button";

export function Navbar() {
    return <header className="shadow-sm">
        <nav className="max-w-5xl m-auto px-3 py-5 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
                <Image src={logo} alt="Next Job logo" width={40} height={40} />
                <span className="text-xl font-bold tracking-tight">Next Jobs</span>
            </Link>
            <Button asChild>
                <Link href="/jobs/new">Post a Job</Link>
            </Button>
        </nav>
    </header>
}
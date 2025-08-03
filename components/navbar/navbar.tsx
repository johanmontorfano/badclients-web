import { createClient } from "@/utils/supabase/server";
import { BsPersonCircle } from "react-icons/bs";
import { NavbarOverlay } from "./navbar_overlay";
import { links, RenderDesktopLinks } from "./navbar_db";

export async function Navbar() {
    const supabase = await createClient();
    const profile = await supabase.auth.getUser();
    const isLoggedIn =
        profile.data.user !== null && !profile.data.user.is_anonymous;

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <NavbarOverlay isLoggedIn={isLoggedIn} />
                <a className="btn btn-ghost text-xl" href="/">
                    BadClients
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <RenderDesktopLinks links={links} />
            </div>
            <div className="navbar-end">
                <a
                    className="btn btn-ghost"
                    href="https://github.com/johanmontorfano/badclients"
                >
                    Star on Github
                </a>
                <a
                    className="btn"
                    href={`/auth/${isLoggedIn ? "profile" : "login"}`}
                >
                    {isLoggedIn ? <BsPersonCircle size={20} /> : "Log In"}
                </a>
            </div>
        </div>
    );
}

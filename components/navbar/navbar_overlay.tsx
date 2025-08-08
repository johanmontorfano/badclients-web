"use client";

import { useState } from "react";
import { links, RenderNavbarLinks } from "./navbar_db";
import { BsPersonCircle, BsX } from "react-icons/bs";
import { Logo } from "../logo";

export function NavbarOverlay(props: { isLoggedIn: boolean }) {
    const [opened, setOpen] = useState(false);

    return (
        <>
            <button
                className="btn btn-square btn-ghost lg:hidden"
                onClick={() => setOpen(true)}
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                    />
                </svg>
            </button>
            <div
                className={`inset-0 z-50 h-full w-full bg-[#000000AA] absolute ${opened ? "block" : "hidden"}`}
            >
                <div className="h-full w-full max-w-[300px] p-4 bg-base-100 flex flex-col justify-between">
                    <div>
                        <div className="w-full flex justify-end">
                            <button
                                className="btn btn-ghost btn-circle"
                                onClick={() => setOpen(false)}
                            >
                                <BsX size={20} />
                            </button>
                        </div>
                        <Logo />
                        <RenderNavbarLinks links={links} />
                    </div>
                    <div>
                        <a
                            className="btn w-full p-2 mb-2"
                            href="https://github.com/johanmontorfano/badclients-web"
                        >
                            Star on Github
                        </a>
                        <a
                            className="btn btn-primary w-full p-2"
                            href={`/auth/${props.isLoggedIn ? "profile" : "login"}`}
                        >
                            {props.isLoggedIn ? (
                                <BsPersonCircle size={20} />
                            ) : (
                                "Log In"
                            )}
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

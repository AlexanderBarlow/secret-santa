"use client";

import { Home, Gift, User } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function BottomNavBar() {
    return (
        <motion.nav
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex justify-around items-center w-[90%] max-w-sm h-16 
      rounded-full backdrop-blur-2xl bg-white/40 border border-white/30 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            <Link href="/user/profile" className="flex flex-col items-center text-[#3e2f1c]">
                <User className="w-6 h-6" />
                <span className="text-xs mt-1">Profile</span>
            </Link>

            <Link
                href="/user/dashboard"
                className="flex flex-col items-center justify-center bg-[#bfa48b] text-white rounded-full w-16 h-16 -mt-8 shadow-lg"
            >
                <Home className="w-7 h-7" />
                <span className="text-xs mt-1">Home</span>
            </Link>

            <Link href="/user/santa" className="flex flex-col items-center text-[#3e2f1c]">
                <Gift className="w-6 h-6" />
                <span className="text-xs mt-1">Santa</span>
            </Link>
        </motion.nav>
    );
}

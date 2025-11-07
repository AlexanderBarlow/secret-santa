import axios from "axios";
import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

export default function ClearDataButton({ user }) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleClearData = async () => {
        if (!confirm("⚠️ This will delete all user and wishlist data! Continue?")) return;
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.delete("/api/admin/clearData", {
                data: { isAdmin: user?.isAdmin },
            });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || "Error clearing database.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClearData}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-4 py-2 
                 bg-gradient-to-r from-red-500/30 to-rose-600/30 
                 border border-red-300/30 rounded-xl text-white font-semibold 
                 backdrop-blur-md shadow-md hover:from-red-500/50 hover:to-rose-600/50 
                 transition-all"
        >
            <Trash2 className="w-4 h-4" />
            {loading ? "Clearing..." : "Clear All Data"}
        </motion.button>
    );
}

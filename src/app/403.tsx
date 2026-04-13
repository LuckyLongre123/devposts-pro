import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-slate-950">
      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        {/* Error Code */}
        <div>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-2">
            403
          </h1>
          <p className="text-xl font-semibold text-gray-700 dark:text-gray-300">
            Access Denied
          </p>
        </div>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400">
          You don't have permission to access this resource. If you believe this
          is a mistake, please contact the administrator.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Go to Home
          </Link>
          <Link
            href="/signin"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            Sign In Again
          </Link>
        </div>
      </div>
    </div>
  );
}

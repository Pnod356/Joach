export default function GuestLayout({ children }) {
    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#60c7c1] px-4 py-8 sm:px-6 lg:px-8">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-teal-700/25 blur-3xl" />
            <div className="pointer-events-none absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-300/10 blur-3xl" />

            <div className="relative z-10 w-full max-w-6xl overflow-hidden rounded-3xl border border-white/40 bg-white/20 p-2 shadow-2xl shadow-teal-900/25 backdrop-blur-md sm:p-3">
                {children}
            </div>
        </div>
    );
}

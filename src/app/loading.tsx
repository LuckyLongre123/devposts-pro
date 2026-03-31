export default function GlobalLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
      {/* Modern, clean spinner using your blue theme */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/20" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium tracking-widest text-foreground/40 uppercase">
        Syncing Application...
      </p>
    </div>
  );
}

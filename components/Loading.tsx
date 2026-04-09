export default function Loading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 gap-5">
      {/* Spinner using site blue */}
      <div className="relative h-14 w-14">
        <div className="absolute inset-0 rounded-full border-4 border-blue-500/15" />
        <div className="absolute inset-0 rounded-full border-4 border-t-blue-500 animate-spin" />
      </div>
      <p className="mt-4 text-sm font-medium tracking-widest text-foreground/40 uppercase">
        Please Wait...
      </p>
    </div>
  );
}

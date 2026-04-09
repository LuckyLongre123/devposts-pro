interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
}

export default function FeatureCard({
  title,
  description,
  icon = "",
}: FeatureCardProps) {
  return (
    <div className="group flex flex-col rounded-2xl border border-foreground/5 bg-foreground/2 p-8 transition-colors hover:border-blue-500/30 hover:bg-foreground/4">
      {/* Icon Wrapper */}
      <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-xl">
        {icon}
      </div>

      {/* Text Content */}
      <h3 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-foreground/50 group-hover:text-foreground/70">
        {description}
      </p>
    </div>
  );
}

export function Article({
  kicker,
  title,
  children,
  className,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article className={className ? `wrap prose ${className}` : "wrap prose"}>
      <div className="page-title">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1>{title}</h1>
      </div>
      {children}
    </article>
  );
}

export function Question({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div className="qtitle">{title}</div>
      <div className="qtext">{text}</div>
      {children}
    </div>
  );
}

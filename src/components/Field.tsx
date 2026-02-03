export function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div className="label">{label}</div>
      {children}
    </div>
  );
}

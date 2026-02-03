export function TabButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button type="button" className={"tabbtn" + (active ? " active" : "")} onClick={onClick}>
      {children}
    </button>
  );
}

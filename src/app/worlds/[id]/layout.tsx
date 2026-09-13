export default function WorldPlayLayout({
  children,
}: LayoutProps<"/worlds/[id]">) {
  return (
    <main className="flex h-[calc(100dvh-theme(spacing.14))] min-h-0 flex-1 flex-col overflow-hidden">
      {children}
    </main>
  );
}

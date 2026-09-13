export default function WorldPlayLayout({
  children,
}: LayoutProps<"/worlds/[id]">) {
  return (
    <main className="flex min-h-0 flex-1 flex-col lg:h-[calc(100dvh-theme(spacing.14))] lg:overflow-hidden">
      {children}
    </main>
  );
}

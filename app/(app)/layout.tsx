import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen" style={{ flexDirection: 'row', display: 'flex', height: '100vh', width: '100%' }}>
      <Sidebar />
      <div className="main flex-1 flex flex-col h-screen overflow-hidden" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </div>
    </div>
  );
}

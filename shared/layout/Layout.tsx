import ClientLayoutExtras from './ClientLayoutExtras';
import { ClientLayoutWrapper } from './ClientLayoutWrapper';
import { GlobalLoadingWrapper } from './GlobalLoadingWrapper';
import InitialFixedOverlay from './InitialFixedOverlay';
import { Content } from './content/Content';
import { Sidebar } from './sidebar/Sidebar';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GlobalLoadingWrapper>
      <InitialFixedOverlay />
      <ClientLayoutWrapper>
        <Sidebar />

        <Content>{children}</Content>

        <ClientLayoutExtras />
      </ClientLayoutWrapper>
    </GlobalLoadingWrapper>
  );
}

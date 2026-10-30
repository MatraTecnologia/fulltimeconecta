import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";

const SiteLayout = ({ children }: LayoutProps<"/">) => (
  <>
    <SiteHeader />
    <main className="flex-1">{children}</main>
    <SiteFooter />
  </>
);

export default SiteLayout;

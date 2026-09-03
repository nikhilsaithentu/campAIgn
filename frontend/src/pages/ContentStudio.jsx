import PageHeader from "../components/layout/PageHeader";
import ContentWorkspace from "../components/content/ContentWorkspace";

export default function ContentStudio() {
  return (
    <div className="space-y-6">

      <PageHeader
        title="AI Content Studio"
        subtitle="Generate, preview and launch AI-powered marketing campaigns."
      />

      <ContentWorkspace />

    </div>
  );
}
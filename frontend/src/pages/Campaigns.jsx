import PageHeader from "../components/layout/PageHeader";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignTable from "../components/campaigns/CampaignTable";

import useCampaigns from "../hooks/useCampaigns";

export default function Campaigns() {
  const {
    loading,
    campaigns,
    totalCampaigns,
    search,
    setSearch,
    status,
    setStatus,
    type,
    setType,
  } = useCampaigns();

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Campaign Management"
        subtitle="Manage, monitor and optimize all your marketing campaigns."
      />

      <CampaignFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        type={type}
        setType={setType}
        total={totalCampaigns}
      />

      <CampaignTable campaigns={campaigns} />
    </div>
  );
}
import { useState } from "react";
import { toast } from "sonner";
import { api } from "../api/api";

import PageHeader from "../components/layout/PageHeader";
import CampaignFilters from "../components/campaigns/CampaignFilters";
import CampaignTable from "../components/campaigns/CampaignTable";
import CampaignModal from "../components/campaigns/CampaignModal";
import DeleteConfirmation from "../components/common/DeleteConfirmation";
import CampaignIntelligenceModal from "../components/campaigns/CampaignIntelligenceModal";
import useCampaigns from "../hooks/useCampaigns";

export default function Campaigns() {
  const [openModal, setOpenModal] = useState(false);
  const [mode, setMode] = useState("create");
  const [selectedCampaign, setSelectedCampaign] = useState(null);

  const [openDelete, setOpenDelete] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  

const [intelligence, setIntelligence] = useState(null);
const [openIntelligence, setOpenIntelligence] = useState(false);
const [intelligenceLoading, setIntelligenceLoading] = useState(false);

  const {
    loading,
    campaigns,

    search,
    setSearch,

    status,
    setStatus,

    type,
    setType,

    createCampaign,
    updateCampaign,
    updateCampaignStatus,
    deleteCampaign,
  } = useCampaigns();

  // ==========================
  // Create
  // ==========================

  async function handleCreate(data) {
    const success = await createCampaign(data);

    if (success) {
      toast.success("Campaign created successfully");
      setOpenModal(false);
      return true;
    }

    toast.error("Failed to create campaign");
    return false;
  }

  // ==========================
  // Edit
  // ==========================

  function handleEdit(campaign) {
    setSelectedCampaign(campaign);
    setMode("edit");
    setOpenModal(true);
  }

  async function handleUpdate(data) {
    const success = await updateCampaign(
      selectedCampaign.id,
      data
    );

    if (success) {
      toast.success("Campaign updated");
      setOpenModal(false);
      setSelectedCampaign(null);
      return true;
    }

    toast.error("Failed to update campaign");
    return false;
  }

  // ==========================
  // Status
  // ==========================

  async function handleStatusChange(id, status) {
    const success = await updateCampaignStatus(id, status);

    if (success) {
      toast.success(`Campaign marked ${status}`);
    } else {
      toast.error("Unable to update campaign");
    }
  }

  // ==========================
  // Delete
  // ==========================

  function handleDeleteClick(campaign) {
    setSelectedCampaign(campaign);
    setOpenDelete(true);
  }

  async function confirmDelete() {
    try {
      setDeleteLoading(true);

      const success = await deleteCampaign(selectedCampaign.id);

      if (success) {
        toast.success("Campaign deleted");

        setOpenDelete(false);
        setSelectedCampaign(null);
      } else {
        toast.error("Delete failed");
      }
    } finally {
      setDeleteLoading(false);
    }
  }

  async function handleIntelligence(campaignId) {
  try {
    setIntelligenceLoading(true);
    setOpenIntelligence(true);

    const res = await api.getCampaignIntelligence(campaignId);

    setIntelligence(res.data);
  } catch (err) {
    console.error(err);
    toast.error("Unable to generate campaign insight");
    setOpenIntelligence(false);
  } finally {
    setIntelligenceLoading(false);
  }
}

  // ==========================
  // Loading
  // ==========================

  if (loading) {
    return (
      <div className="py-20 text-center text-brand-slate">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">

        <PageHeader
          title="Campaign Management"
          subtitle="Create, manage and monitor all campaigns."
        />

        <button
          onClick={() => {
            setMode("create");
            setSelectedCampaign(null);
            setOpenModal(true);
          }}
          className="
            rounded-xl
            bg-brand-coral
            px-5
            py-3
            text-white
            font-semibold
            hover:opacity-90
            transition"
        >
          + New Campaign
        </button>

      </div>

      <CampaignFilters
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        type={type}
        setType={setType}
      />

      <CampaignTable
        campaigns={campaigns}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onStatusChange={handleStatusChange}
        onIntelligence={handleIntelligence}
      />

      <CampaignModal
        open={openModal}
        mode={mode}
        campaign={selectedCampaign}
        onClose={() => {
          setOpenModal(false);
          setSelectedCampaign(null);
        }}
        onSubmit={
          mode === "create"
            ? handleCreate
            : handleUpdate
        }
      />
      <CampaignIntelligenceModal
        open={openIntelligence}
        onClose={() => setOpenIntelligence(false)}
        intelligence={intelligence}
        loading={intelligenceLoading}
      />

      <DeleteConfirmation
        open={openDelete}
        loading={deleteLoading}
        title="Delete Campaign"
        description={`Delete "${selectedCampaign?.name}"? This action cannot be undone.`}
        onCancel={() => {
          setOpenDelete(false);
          setSelectedCampaign(null);
        }}
        onConfirm={confirmDelete}
      />

    </div>
  );
}
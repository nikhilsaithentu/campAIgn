import { useEffect, useState } from "react";

import {
  Bell,
  Search,
  Moon,
  Sun,
  ChevronDown,
  Megaphone,
  Users,
} from "lucide-react";

import { api } from "../../api/api";

export default function Topbar() {
  const [darkMode, setDarkMode] = useState(false);

  const [search, setSearch] = useState("");
  const [campaigns, setCampaigns] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchOpen, setSearchOpen] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // --------------------------------
  // DARK MODE
  // --------------------------------

  function toggleDarkMode() {
    setDarkMode((prev) => {
      const newMode = !prev;

      document.documentElement.classList.toggle(
        "dark",
        newMode
      );

      return newMode;
    });
  }

  // --------------------------------
  // LOAD SEARCH DATA
  // --------------------------------

  useEffect(() => {
    async function loadSearchData() {
      try {
        setLoadingSearch(true);

        const [campaignResponse, customerResponse] =
          await Promise.all([
            api.getCampaigns(),
            api.getCustomers(),
          ]);

        setCampaigns(
          campaignResponse.data?.campaigns ||
          campaignResponse.data ||
          []
        );

        setCustomers(
          customerResponse.data?.customers ||
          customerResponse.data ||
          []
        );
      } catch (error) {
        console.error("Failed to load search data:", error);
      } finally {
        setLoadingSearch(false);
      }
    }

    loadSearchData();
  }, []);

  // --------------------------------
  // SEARCH
  // --------------------------------

  const searchTerm = search.trim().toLowerCase();

  const filteredCampaigns = searchTerm
    ? campaigns
        .filter((campaign) => {
          return (
            campaign.name
              ?.toLowerCase()
              .includes(searchTerm) ||
            campaign.id
              ?.toLowerCase()
              .includes(searchTerm) ||
            campaign.type
              ?.toLowerCase()
              .includes(searchTerm)
          );
        })
        .slice(0, 5)
    : [];

  const filteredCustomers = searchTerm
    ? customers
        .filter((customer) => {
          return (
            customer.name
              ?.toLowerCase()
              .includes(searchTerm) ||
            customer.id
              ?.toLowerCase()
              .includes(searchTerm) ||
            customer.email
              ?.toLowerCase()
              .includes(searchTerm)
          );
        })
        .slice(0, 5)
    : [];

  const hasResults =
    filteredCampaigns.length > 0 ||
    filteredCustomers.length > 0;

  // --------------------------------
  // RESULT CLICK
  // --------------------------------

  function handleResultClick(item, type) {
    console.log(`${type} selected:`, item);

    // For now we simply close the search.
    // Later we can navigate to the corresponding page.
    setSearch("");
    setSearchOpen(false);
  }

  return (
    <header
      className="
        sticky
        top-0
        z-30
        h-[72px]
        bg-white
        border-b
        border-slate-200
        dark:bg-slate-900
        dark:border-slate-700
        flex
        items-center
        justify-between
        px-8
        transition-colors
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-6">

        {/* SEARCH */}

        <div className="relative">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-slate-400
              dark:text-slate-500
              pointer-events-none
            "
          />

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => {
              if (search.trim()) {
                setSearchOpen(true);
              }
            }}
            placeholder="Search campaigns, customers..."
            className="
              w-[360px]
              rounded-xl
              border
              border-slate-200
              bg-slate-50
              py-3
              pl-11
              pr-4
              outline-none

              text-slate-800
              placeholder:text-slate-400

              focus:border-blue-500
              focus:bg-white

              dark:border-slate-700
              dark:bg-slate-800
              dark:text-slate-100
              dark:placeholder:text-slate-500
              dark:focus:border-blue-500
              dark:focus:bg-slate-800

              transition
            "
          />

          {/* SEARCH DROPDOWN */}

          {searchOpen && searchTerm && (
            <div
              className="
                absolute
                left-0
                top-[58px]
                w-[420px]
                max-h-[420px]
                overflow-y-auto
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-xl

                dark:border-slate-700
                dark:bg-slate-900

                transition-colors
              "
            >

              {/* Loading */}

              {loadingSearch && (
                <div
                  className="
                    px-5
                    py-6
                    text-center
                    text-sm
                    text-slate-500
                    dark:text-slate-400
                  "
                >
                  Searching...
                </div>
              )}

              {/* No results */}

              {!loadingSearch && !hasResults && (
                <div
                  className="
                    px-5
                    py-8
                    text-center
                  "
                >
                  <Search
                    size={24}
                    className="
                      mx-auto
                      mb-2
                      text-slate-300
                      dark:text-slate-600
                    "
                  />

                  <p
                    className="
                      text-sm
                      font-medium
                      text-slate-700
                      dark:text-slate-200
                    "
                  >
                    No results found
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-400
                    "
                  >
                    Try another campaign or customer name.
                  </p>
                </div>
              )}

              {/* CAMPAIGNS */}

              {!loadingSearch &&
                filteredCampaigns.length > 0 && (
                  <div className="p-2">

                    <p
                      className="
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      Campaigns
                    </p>

                    {filteredCampaigns.map((campaign) => (
                      <button
                        key={campaign.id}
                        onClick={() =>
                          handleResultClick(
                            campaign,
                            "campaign"
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left

                          hover:bg-slate-50

                          dark:hover:bg-slate-800

                          transition
                        "
                      >

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-brand-coralLight
                            text-brand-coral

                            dark:bg-brand-coral/10
                          "
                        >
                          <Megaphone size={17} />
                        </div>

                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-slate-800
                              dark:text-slate-100
                            "
                          >
                            {campaign.name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-slate-500
                              dark:text-slate-400
                            "
                          >
                            {campaign.id}
                            {campaign.type
                              ? ` • ${campaign.type}`
                              : ""}
                          </p>

                        </div>

                      </button>
                    ))}

                  </div>
                )}

              {/* DIVIDER */}

              {!loadingSearch &&
                filteredCampaigns.length > 0 &&
                filteredCustomers.length > 0 && (
                  <div
                    className="
                      mx-4
                      border-t
                      border-slate-100
                      dark:border-slate-800
                    "
                  />
                )}

              {/* CUSTOMERS */}

              {!loadingSearch &&
                filteredCustomers.length > 0 && (
                  <div className="p-2">

                    <p
                      className="
                        px-3
                        py-2
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-slate-400
                        dark:text-slate-500
                      "
                    >
                      Customers
                    </p>

                    {filteredCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        onClick={() =>
                          handleResultClick(
                            customer,
                            "customer"
                          )
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          rounded-xl
                          px-3
                          py-3
                          text-left

                          hover:bg-slate-50

                          dark:hover:bg-slate-800

                          transition
                        "
                      >

                        <div
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600

                            dark:bg-blue-500/10
                            dark:text-blue-400
                          "
                        >
                          <Users size={17} />
                        </div>

                        <div className="min-w-0">

                          <p
                            className="
                              truncate
                              text-sm
                              font-semibold
                              text-slate-800
                              dark:text-slate-100
                            "
                          >
                            {customer.name}
                          </p>

                          <p
                            className="
                              mt-0.5
                              truncate
                              text-xs
                              text-slate-500
                              dark:text-slate-400
                            "
                          >
                            {customer.email || customer.id}
                          </p>

                        </div>

                      </button>
                    ))}

                  </div>
                )}

            </div>
          )}

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-4">

        {/* DATE */}

        <div className="hidden lg:block text-right">

          <p
            className="
              text-sm
              font-semibold
              text-slate-700
              dark:text-slate-200
            "
          >
            {today}
          </p>

          <p
            className="
              text-xs
              text-slate-500
              dark:text-slate-400
            "
          >
            Welcome back 👋
          </p>

        </div>

        {/* DARK MODE */}

        <button
          onClick={toggleDarkMode}
          aria-label="Toggle dark mode"
          className="
            h-11
            w-11
            rounded-xl
            border
            border-slate-200
            hover:bg-slate-100

            dark:border-slate-700
            dark:hover:bg-slate-800

            transition
            flex
            items-center
            justify-center

            text-slate-700
            dark:text-slate-200
          "
        >
          {darkMode ? (
            <Sun size={18} />
          ) : (
            <Moon size={18} />
          )}
        </button>

        {/* NOTIFICATIONS

        <button
          className="
            relative
            h-11
            w-11
            rounded-xl
            border
            border-slate-200
            hover:bg-slate-100

            dark:border-slate-700
            dark:hover:bg-slate-800

            transition
            flex
            items-center
            justify-center

            text-slate-700
            dark:text-slate-200
          "
        >
          <Bell size={18} />

          <span
            className="
              absolute
              top-2
              right-2
              h-2
              w-2
              rounded-full
              bg-red-500
            "
          />
        </button> */}

        {/* PROFILE */}

        <button
          className="
            flex
            items-center
            gap-3
            rounded-xl
            border
            border-slate-200
            px-3
            py-2
            hover:bg-slate-50

            dark:border-slate-700
            dark:hover:bg-slate-800

            transition
          "
        >

          <div
            className="
              h-10
              w-10
              rounded-full
              bg-gradient-to-r
              from-blue-500
              to-indigo-600
              flex
              items-center
              justify-center
              text-white
              font-bold
            "
          >
            N
          </div>

          <div className="hidden md:block text-left">

            <p
              className="
                text-sm
                font-semibold
                text-slate-800
                dark:text-slate-100
              "
            >
              Nikhil Sai
            </p>

            <p
              className="
                text-xs
                text-slate-500
                dark:text-slate-400
              "
            >
              Marketing Manager
            </p>

          </div>

          <ChevronDown
            size={16}
            className="
              text-slate-500
              dark:text-slate-400
            "
          />

        </button>

      </div>

    </header>
  );
}
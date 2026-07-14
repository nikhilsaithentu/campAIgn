export default function ChannelBadges({
  channels = [],
}) {
  return (
    <div className="flex flex-wrap gap-2">

      {channels.map((channel) => (

        <span
          key={channel}
          className="
          rounded-full
          bg-brand-paper
          px-3
          py-1
          text-xs
          font-medium
          capitalize
          text-brand-ink"
        >
          {channel}
        </span>

      ))}

    </div>
  );
}
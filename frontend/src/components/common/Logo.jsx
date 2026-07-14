import logo from "../../assets/logo.jpg";

export default function Logo({ collapsed = false }) {
  return (
    <div
      className={`
        flex items-center
        ${collapsed ? "justify-center w-full" : "w-full"}
      `}
    >
      <img
        src={logo}
        alt="CampAIgn"
        className={`
          object-contain transition-all duration-300
          ${
            collapsed
              ? "h-11 w-11"
              : "h-22 w-full"
          }
        `}
      />
    </div>
  );
}
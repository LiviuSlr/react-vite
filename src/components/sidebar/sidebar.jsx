function Sidebar() {
  const items = [
    {
      link: "./home",
      name: "Home",
      icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    },
    {
      link: "./logbook",
      name: "Logbook",
      icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
    },
    {
      link: "./orders",
      name: "Orders",
      icon: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z",
    },
    {
      link: "./messages",
      name: "Messages",
      icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14ma2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z",
    },
    {
      link: "./statistics",
      name: "Statistics",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      link: "./settings",
      name: "Settings",
      icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z",
    },
    {
      link: "./account",
      name: "Account",
      icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    },
  ];

  return (
    <div className="group/sidebar h-full bg-blue-600 shadow-md transition-all duration-300 ease-in-out w-16 hover:w-64 overflow-hidden flex flex-col justify-between">
      {/* Sidebar links */}
      <div className="flex flex-col items-start py-4 space-y-2 px-2">
        {items.map((item) => (
          <a
            key={item.name.toLowerCase()}
            href={item.link}
            className="flex items-center w-full hover:bg-blue-500 p-2 transition-colors rounded-lg text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={item.icon}
              />
            </svg>

            <span className="ml-3 opacity-0 group-hover/sidebar:opacity-100 transition-opacity whitespace-nowrap">
              {item.name}
            </span>
          </a>
        ))}
      </div>

      {/* Footer – feedback / bug report */}
      <div className="w-full px-2 pb-4">
        <input
          type="email"
          placeholder="Feedback / raportare eroare"
          required
          title="Introdu un email valid (ex: nume@domeniu.com)"
          className="
            w-full
            px-2
            py-1
            rounded-md
            text-sm
            focus:outline-none
            focus:ring
            focus:ring-blue-300
            invalid:ring
            invalid:ring-red-400
            opacity-0
            group-hover/sidebar:opacity-100
            transition-opacity
            duration-300
          "
        />
        <p
          className="
            mt-1
            text-[10px]
            text-white/60
            opacity-0
            group-hover/sidebar:opacity-100
            transition-opacity
            duration-300
          "
        >
          Opțional • sugestii sau probleme
        </p>
      </div>
    </div>
  );
}

export default Sidebar;

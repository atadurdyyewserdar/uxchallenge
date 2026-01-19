import { type ReactNode } from "react";
import ProfileSmallIcon from "../assets/svg/profilesmall.svg";
import MuteIcon from "../assets/svg/mute.svg";

interface ContactListItemProps {
  name: string;
  phoneNumber: string;
  avatarSrc?: string;
  actions?: ReactNode;
  isMuted?: boolean;
}

export function ContactListItem({
  name,
  phoneNumber,
  avatarSrc,
  actions,
  isMuted,
}: ContactListItemProps) {
  return (
    // Single row for a contact
    <div className="group flex w-full items-center justify-between rounded-xl py-3 sm:py-4 transition-colors duration-200">
      {/* left block: avatar + text */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        {/* avatar: either user's image or a default */}
        <div className="relative flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-residential-60">
          {avatarSrc ? (
            <img
              src={avatarSrc}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            // show default avatar
            <img
              src={ProfileSmallIcon}
              alt="Default Avatar"
              className="h-10 w-10 sm:h-12 sm:w-12"
            />
          )}           {isMuted && (
            <div className={`absolute flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center overflow-hidden rounded-full ${isMuted ? "bg-red-500/50" : ""}`}>
              <img src={MuteIcon} alt="Muted" className={`h-4 w-4 sm:h-5 sm:w-5 m-auto`} />
            </div>
          )}
        </div>

        {/* name and phone number */}
        <div className="flex flex-col min-w-0">
          <span className="type-body dark:text-white font-medium truncate">{name}</span>
          <span className="type-message dark:text-white/56 truncate text-sm">{phoneNumber}</span>
        </div>
      </div>

      {/* actions - always visible on mobile for touch, hover on desktop */}
      <div
        className="flex items-center gap-1 sm:gap-2 opacity-100 sm:opacity-0 transition-opacity duration-200 
                      sm:group-hover:opacity-100 
                      has-[.menu-open]:opacity-100 shrink-0"
      >
        {actions}
      </div>
    </div>
  );
}

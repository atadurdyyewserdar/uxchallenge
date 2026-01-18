import { useState, useRef, useEffect } from "react";
import { IconButton } from "./IconButton";
import { Dropdown, DropdownItem } from "./Dropdown";

// Icons
import MoreIcon from "../assets/svg/more.svg";
import EditIcon from "../assets/svg/settings.svg";
import TrashIcon from "../assets/svg/delete.svg";

interface MoreMenuProps {
  onEdit: () => void; // The parent will define what happens
  onDelete?: () => void;
}

export function MoreMenu({ onEdit, onDelete }: MoreMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside or scroll
  useEffect(() => {
    function handleInteraction(event: Event) {
      if (!isOpen) return;
      const target = event.target as Node;
      const isInside =
        containerRef.current && containerRef.current.contains(target);

      // Close if scrolling OR clicking outside
      if (event.type === "scroll" || !isInside) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleInteraction);
    document.addEventListener("scroll", handleInteraction, true); // Capture scroll

    return () => {
      document.removeEventListener("mousedown", handleInteraction);
      document.removeEventListener("scroll", handleInteraction, true);
    };
  }, [isOpen]);

  return (
    //  allow parent component to detect if this menu is active
    <div className={`relative ${isOpen ? "menu-open" : ""}`} ref={containerRef}>
      <IconButton
        variation="secondary"
        icon={MoreIcon}
        onClick={() => setIsOpen((prev) => !prev)}
        className={isOpen ? "bg-residential-60 text-white opacity-100" : ""}
      />

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 z-50">
          <Dropdown>
            <DropdownItem
              onClick={() => {
                setIsOpen(false);
                onEdit();
              }}
              icon={<img src={EditIcon} />}
            >
              Edit
            </DropdownItem>
            {/* <DropdownSeparator /> */}
            <DropdownItem
              onClick={() => {
                setIsOpen(false);
                onDelete?.();
              }}
              icon={<img src={TrashIcon} />}
            >
              Remove
            </DropdownItem>
          </Dropdown>
        </div>
      )}
    </div>
  );
}
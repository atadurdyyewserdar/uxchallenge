import { useState } from "react";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";

// Components
import { Button } from "../components/Button";
import { ContactListItem } from "../components/ContactListItem";
import { IconButton } from "../components/IconButton";
import { MoreMenu } from "../components/MoreMenu";
import { ContactModalForm } from "../components/ContactModalForm";

// API & Types
import { useContacts, useUserProfile } from "../hooks/queryHooks";
import {
  useAddContact,
  useDeleteContact,
  useUpdateContact,
  useMuteContact,
  useUpdateUserProfile,
} from "../hooks/mutationHooks";
import { type ContactResponse, type UserProfile } from "../lib/contactsApi";

// Assets
import BackArrowIcon from "../assets/svg/blackarrow.svg";
import SettingsIcon from "../assets/svg/settings.svg";
import AddIcon from "../assets/svg/add.svg";
import LightModeIcon from "../assets/svg/lightmode.svg";
import MuteIcon from "../assets/svg/mute.svg";
import CallIcon from "../assets/svg/call.svg";
import { useTheme } from "../hooks/useTheme";
import { UserModalForm } from "../components/UserModalForm";

const Contacts = () => {
  // Theme
  const { toggleTheme } = useTheme();
  // Navigation
  const navigate = useNavigate();
  // State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactResponse | null>(
    null
  );

  const [isSettingsOpen, setSettingsIsOpen] = useState(false);

  // Queries & mutations
  const queryClient = useQueryClient();
  const contactsQuery = useContacts();

  // Helper to refresh list
  const invalidateContacts = () =>
    queryClient.invalidateQueries({ queryKey: ["contacts"] });

  const deleteMutation = useDeleteContact(invalidateContacts);

  const updateMutation = useUpdateContact(() => {
    setEditingContact(null);
    invalidateContacts();
  });

  const addMutation = useAddContact(() => {
    setIsAddModalOpen(false);
    invalidateContacts();
  });

  const muteMutation = useMuteContact(() => {
    invalidateContacts();
  });

  const handleAddSubmit = (formData: FormData) => {
    addMutation.mutate(formData);
  };

  const handleEditSubmit = (formData: FormData) => {
    if (editingContact) {
      updateMutation.mutate({ id: editingContact.id, formData });
    }
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleMute = (id: string) => {
    muteMutation.mutate(id);
  };
  const userQuery = useUserProfile();

  const userMutation = useUpdateUserProfile(() => {
    setSettingsIsOpen(false);
    queryClient.invalidateQueries({ queryKey: ["user"] });
  });

  const [editingUser, setEditingUser] = useState<UserProfile | null>(null);

  async function handleSettingsSubmit(data: FormData) {
    if (editingUser && editingUser.id) {
      userMutation.mutate({ formData: data });
    }
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row static bg-white dark:bg-residential-100 text-black dark:text-white">
      {/* LEFT SIDEBAR - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex flex-1 min-w-0 text-right border-y border-residential-20">
        <div className="h-30 flex items-center justify-end border-y border-r-0 border-residential-20 mt-20 p-5 w-full">
          <button
            onClick={() => navigate("/")}
            className="bg-residential-10 dark:bg-residential-100 cursor-pointer hover:bg-residential-60 h-11 w-11 rounded-full"
          >
            <img src={BackArrowIcon} alt="Back" className="h-4 w-4 m-auto" />
          </button>
        </div>
      </div>

      {/* CENTER CONTENT */}
      <div className="w-full lg:w-auto lg:min-w-180 flex flex-col flex-1 lg:flex-initial lg:shrink-0 border-x-0 lg:border border-residential-20">
        {/* Header */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 min-h-20 lg:min-h-30 w-full border-y border-residential-20 mt-0 lg:mt-20 p-4 sm:p-5">
          {/* Mobile back button */}
          <button
            onClick={() => navigate("/")}
            className="lg:hidden bg-residential-10 dark:bg-residential-100 cursor-pointer hover:bg-residential-60 h-10 w-10 sm:h-11 sm:w-11 rounded-full shrink-0"
          >
            <img src={BackArrowIcon} alt="Back" className="h-4 w-4 m-auto" />
          </button>
          
          <div className="flex-1 flex items-center min-w-0">
            <h2 className="type-h2 truncate">Contacts</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile theme toggle */}
            <button
              onClick={toggleTheme}
              className="lg:hidden bg-residential-10 dark:bg-residential-100 cursor-pointer hover:bg-residential-60 h-10 w-10 sm:h-11 sm:w-11 rounded-full shrink-0"
            >
              <img src={LightModeIcon} alt="Theme" className="h-5 w-5 sm:h-6 sm:w-6 m-auto" />
            </button>
            
            <button
              className="bg-residential-10 dark:bg-residential-100 cursor-pointer hover:bg-residential-60 h-10 w-10 sm:h-11 sm:w-11 rounded-full shrink-0"
              title="Settings"
              onClick={() => {
                setEditingUser(userQuery.data?.data || null);
                setSettingsIsOpen(true);
              }}
            >
              <img src={SettingsIcon} alt="Settings" className="h-5 w-5 sm:h-6 sm:w-6 m-auto" />
            </button>
            
            <Button
              variant="special"
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 sm:h-13 px-4 sm:w-45"
            >
              <img src={AddIcon} alt="Add new" className="h-4 w-4" />
              <span className="hidden sm:inline">Add new</span>
            </Button>
          </div>
        </div>

        <div className="p-3 sm:p-5 w-full overflow-auto no-scrollbar flex-1">
          <ul className="p-0 m-0">
            {contactsQuery.data?.data.map((contact: ContactResponse) => (
              <li
                key={contact.id}
                className="w-full max-w-2xl dark:bg-residential-100"
              >
                <ContactListItem
                  name={contact.fullName}
                  phoneNumber={contact.phoneNumber}
                  avatarSrc={contact.pictureUrl || undefined}
                  isMuted={contact.isMuted}
                  actions={
                    <>
                      <IconButton
                        variation="secondary"
                        icon={MuteIcon}
                        title="Mute"
                        onClick={() => handleMute(contact.id)}
                      />
                      <IconButton
                        variation="secondary"
                        icon={CallIcon}
                        title="Call"
                      />
                      <MoreMenu
                        onEdit={() => setEditingContact(contact)}
                        onDelete={() => handleDelete(contact.id)}
                      />
                    </>
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* RIGHT SIDEBAR - Hidden on mobile, shown on lg+ */}
      <div className="hidden lg:flex flex-1 min-w-0 border-y border-residential-20">       
       <div className="w-full h-30 flex items-center border-y border-r-0 border-residential-20 mt-20 p-5">
          <button
            onClick={toggleTheme}
            className="bg-residential-10 dark:bg-residential-100 cursor-pointer hover:bg-residential-60 h-11 w-11 rounded-full"
          >
            <img src={LightModeIcon} alt="Theme" className="h-6 w-6 m-auto" />
          </button>
        </div>
      </div>

      {/* Edit modal */}
      <ContactModalForm
        isOpen={!!editingContact}
        onClose={() => setEditingContact(null)}
        initialData={editingContact}
        onSubmit={handleEditSubmit}
        isPending={updateMutation.isPending}
      />

      {/* Add modal */}
      <ContactModalForm
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        initialData={null}
        onSubmit={handleAddSubmit}
        isPending={addMutation.isPending}
      />

      <UserModalForm
        isOpen={isSettingsOpen}
        onClose={() => setSettingsIsOpen(false)}
        initialData={editingUser}
        onSubmit={handleSettingsSubmit}
        isPending={userMutation.isPending}
      />
    </div>
  );
};

export default Contacts;

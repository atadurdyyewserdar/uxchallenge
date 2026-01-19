import { TextField } from "./TextField";
import SpinnerIcon from "../assets/svg/change.svg";

type Props = {
  value: string;
  isPending?: boolean;
  onChange: (val: string) => void;
};

export const SearchOptions = ({ value, isPending, onChange }: Props) => {
  return (
    <div>
      <TextField
        label="Phone number or Name"
        placeholder="Search contacts..."
        className="w-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {isPending && (
        <img
          src={SpinnerIcon}
          alt="Loading..."
          className="ml-1 h-5 w-5 mt-2 animate-spin"
        />
      )}
    </div>
  );
};

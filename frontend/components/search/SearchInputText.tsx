import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Input } from "../ui/input";

const SearchInputText = ({
  queryText,
  onTextChange,
}: {
  queryText: string | undefined;
  onTextChange: (text: string) => void;
}) => {
  return (
    <Input
      size="xl"
      icon={<MagnifyingGlassIcon className="w-6 h-6 stroke-dgray" />}
      placeholder={queryText !== "" ? "Search With Text..." : "Search..."}
      value={queryText !== undefined ? queryText : ""}
      onChange={(e) => onTextChange(e.target.value ? e.target.value : "")}
    />
  );
};

export default SearchInputText;

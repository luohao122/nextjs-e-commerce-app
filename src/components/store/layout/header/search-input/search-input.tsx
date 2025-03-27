import { Search } from "lucide-react";

export default function SearchInput() {
  return (
    <div className="relative lg:w-full flex-1">
      <form className="h-10 rounded-3xl bg-white relative border-none flex">
        <input
          placeholder="Search..."
          type="text"
          className="bg-white text-black flex-1 border-none pl-2.5 m-2.5 outline-none"
        />
        <button
          type="submit"
          className="border-[1px] rounded-[20px] w-[56px] h-8 mt-1 mr-1 mb-0 ml-0 bg-gradient-to-r from-slate-500 to-slate-600 grid place-items-center cursor-pointer"
        >
          <Search />
        </button>
      </form>
    </div>
  );
}

import { Link } from "@/i18n/routing";
import { MdKeyboardArrowLeft } from "react-icons/md";

const HomeBtn = ({ colors }) => {
  return (
    <Link
      href="/"
      className={`absolute left-6 top-6 bg-zinc-300 text-4xl p-1 text-white rounded-full hover:bg-tg-orange transition-all ${colors}`}
    >
      <MdKeyboardArrowLeft />
    </Link>
  );
};

export default HomeBtn;

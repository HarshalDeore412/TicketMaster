import ADA from "../Assets/Logo/ADA.png";
import {
  TiSocialFacebookCircular,
  TiSocialLinkedin,
  TiSocialInstagram,
} from "react-icons/ti";
import { CiMail } from "react-icons/ci";
import { IoCallSharp } from "react-icons/io5";

function Footer() {
  return (
    <div className="">
  <footer className=" text-center pb-4 w-[80%] mx-auto border-t-2 border-red-500 text-gray-950 dark:bg-white-600">
    <div className="container pt-4">
      <div className="mb-4 flex justify-center space-x-4">
        <a
          className="text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 transition duration-300"
          href="https://www.facebook.com"
        >
          <TiSocialFacebookCircular size={24} />
        </a>
        <a
          className="text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 transition duration-300"
          href="https://www.linkedin.com/company/adatechsolutions"
        >
          <TiSocialLinkedin size={24} />
        </a>
        <a
          className="text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 transition duration-300"
          href="https://www.instagram.com"
        >
          <TiSocialInstagram size={24} />
        </a>
        <a
          className="text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 transition duration-300"
          href="mailto:info@eoutsource.cx"
        >
          <CiMail size={24} />
        </a>
        <a
          className="text-neutral-800 dark:text-neutral-200 hover:text-indigo-500 transition duration-300"
          href="tel:+919595-339999"
        >
          <IoCallSharp size={24} />
        </a>
      </div>
    </div>
    {/* <!--Copyright section--> */}
    <div className="bg-white-300 text-center text-white  dark:text-white py-2">
      <span> 2023 Copyright </span>
      <a
        className="text-white dark:text-white hover:text-white-500 transition duration-300"
        href=""
      >
        ADA Tech Solution Pvt Ltd
      </a>
    </div>
    <p className="text-white text-sm flex justify-center items-center pb-4">
      made with ❤ by Harshal Deore
    </p>
  </footer>
</div>
  );
}

export default Footer;



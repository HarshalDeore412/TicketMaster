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
      <footer className="bg-white-200 text-center pb-4 w-[80%] mx-auto border-t-4 border-indigo-500  text-gray-950 dark:bg-white-600">
        <div className="container pt-4">
          <div className="mb-4 flex justify-center">
            <a className="mr-9 text-neutral-800 dark:text-neutral-200">
              <TiSocialFacebookCircular />
            </a>

            <a
              className="mr-9 text-neutral-800 dark:text-neutral-200"
              href="https://www.linkedin.com/company/adatechsolutions"
            >
              <TiSocialLinkedin />
            </a>

            <a className="mr-9 text-neutral-800 dark:text-neutral-200">
              <TiSocialInstagram />
            </a>

            <a
              href="mailto:info@eoutsource.cx"
              className="mr-9 text-neutral-800 dark:text-neutral-200"
            >
              <CiMail />
            </a>
            <a
              href="tel:+919595-339999"
              className="mr-9 text-neutral-800 dark:text-neutral-200"
            >
              <IoCallSharp />
            </a>
          </div>
        </div>

        {/* <!--Copyright section--> */}
        <div className="bg-white-300 text-center text-gray-950 dark:bg-white-950 dark:text-gray-950">
          <span>© 2023 Copyright  </span>
          <a className="text-neutral-800 dark:text-neutral-400" href="">
            ADA Tech Solution Pvt Ltd
          </a>
        </div>
        <p className=" flex justify-center items-center  ">
          {`made with ❤ by - Harshal Deore`}
        </p>
      </footer>
    </div>
  );
}

export default Footer;

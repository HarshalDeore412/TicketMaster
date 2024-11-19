import ADA from "../Assets/Logo/ADA.png";
import {
  TiSocialFacebookCircular,
  TiSocialLinkedin,
  TiSocialInstagram,
} from "react-icons/ti";

function Footer() {
  return (
    <div className="">
      <footer className="bg-white-200 text-center w-[80%] mx-auto border-t-4 border-indigo-500  text-gray-950 dark:bg-white-600">
        <div className="container pt-9">
          <div className="mb-9 flex justify-center">
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
            <a className="mr-9 text-neutral-800 dark:text-neutral-200"></a>
            <a className="mr-9 text-neutral-800 dark:text-neutral-200"></a>
            <a className="text-neutral-800 dark:text-neutral-200"></a>
          </div>
        </div>

        {/* <!--Copyright section--> */}
        <div className="bg-white-300  p-4 text-center text-gray-950 dark:bg-white-950 dark:text-gray-950">
          © 2023 Copyright <a className="text-neutral-800 dark:text-neutral-400" href=""> ADA Tech Solution Pvt Ltd  </a>
        </div>
        <p className=" flex justify-center items-center  ">
          {`made with ❤ by - Harshal Deore`}
        </p>
      </footer>
    </div>
  );
}

export default Footer;

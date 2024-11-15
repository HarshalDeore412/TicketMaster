function Button({ text, onClick }) {
    return (
      <button
        type="submit"
        onClick={onClick}
        className="flex justify-center gap-2 items-center mx-auto shadow-xl
                  bg-gray-50 backdrop-blur-md font-semibold isolation-auto border-gray-50 
                  hover:text-gray-50 hover:bg-emerald-500 transition duration-300 
                  ease-in-out rounded-full py-2 px-4 
                  sm:w-full md:w-[30%] lg:w-[20%] xl:w-[15%] 2xl:w-[10%]"
      >
        {text}
      </button>
    );
  }
  
  export default Button;
  
import React, { useState } from 'react';
import processes from "../Assets/JSON/process.json"
import toast from 'react-hot-toast';
import Header from './Header';
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import BASE_URL from '../Assets/JSON/Base_Url.json'



function Signup() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [empID, setEmpID] = useState('');
    const [process, setProcess] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [otp, setOtp] = useState(null)
    const [loading, setLoading] = useState(false);


    console.log("BASE_URL:", BASE_URL);
    

    const [isOTPAvailable, setIsOTPAvailable] = useState(false)
    const [passVisible, setPassVisible] = useState(false)
    const navigate = useNavigate();
    
    function isValidGmail(email) {
        const gmailRegex = /^([a-zA-Z0-9._%+-]+)@(gmail|googlemail)\.com$/;
        return gmailRegex.test(email);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
          const response = await fetch(`${BASE_URL.BASE_URL}user/create-user`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firstName,
              lastName,
              email,
              empID,
              process,
              password,
              otp,
            }),
          });
      
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message);
          }
      
          const data = await response.json();
      
          if (!data.success) {
            throw new Error(data.message);
          }
      
          console.log(data);
          alert('Signup successful!');
          navigate('/login');
        } catch (error) {
          if (error instanceof TypeError) {
            setError('Network error. Please try again.');
          } else if (error.message === 'Failed to fetch') {
            setError('Server error. Please try again later.');
          } else if (error.response) {
            setError(error.response.data.message);
          } else if (error.message === 'JSON Hydraulic') {
            setError('Invalid response from server.');
          } else {
            setError(error.message);
          }
        }
      };
      

    function Toggle() {
        if(passVisible){
            setPassVisible(false)
        }else{
            setPassVisible(true)
        }
    };

    const SendOTP = async (e) => {
        if (isValidGmail(email)) {
            setLoading(true);
            try {
                const response = await fetch(`${BASE_URL.BASE_URL}user/send-otp`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });
    
                const data = await response.json();
                console.log("response", response);
                console.log("response.data", data);
    
                if (data.success) {
                    toast.success(data.message);
                    setIsOTPAvailable(true);
                } else {
                    toast.error(data.message);
                }
            } catch (e) {
                console.log("ERROR: ", e);
                toast.error(e.message);
            } finally {
                setLoading(false);
            }
        } else {
            toast.error('Please enter a valid email address');
        }
    };
    
    return (

            <div className='mx-auto h-full ' >
                <div>
                    <div>
                        <Header />
                    </div>
                    <div className='flex justify-center py-20 ' >
{
    loading ? (
        <Loader />
    ) : (  <div className=" w-[60%] mx-auto border px-4 md:p-2 lg:px-4 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl w-[20%] mx-auto  font-bold mb-4">Signup Form</h2>
        {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-4 rounded-lg">
                {error}
            </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className='flex justify-between	' >
                <label className="block text-sm font-medium mb-2" htmlFor="firstName">
                    First Name:
                </label>
                <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className='flex justify-between	' >
                <label className="block text-sm font-medium mb-2" htmlFor="lastName">
                    Last Name:
                </label>
                <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className='flex justify-between	' >
                <label className="block text-sm font-medium mb-2" htmlFor="email">
                    Email:
                </label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className='flex justify-between	' >

                <label className="block text-sm font-medium mb-2" htmlFor="process">
                    Process name
                </label>
                <select
                    id="process"
                    value={process}
                    onChange={(e) => setProcess(e.target.value)}
                    required
                    className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select Process name</option>
                    {processes.map((process) => (
                        <option key={process.id} value={process.name}>
                            {process.name}
                        </option>
                    ))}
                </select>

            </div>
            <div className='flex justify-between	' >
                <label className="block text-sm font-medium mb-2" htmlFor="process">
                    Employee ID:
                </label>
                <input
                    type="text"
                    id="empID"
                    value={empID}
                    onChange={(e) => setEmpID(e.target.value)}
                    required
                    className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className='flex justify-between	' >
                <label className="block text-sm font-medium mb-2" htmlFor="password">
                    Password:
                </label>
                <div className='flex w-[80%] '  >


                    <input
                        type={ passVisible ? "text" : "password"  }
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-[90%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <span className='w-[10%] text-2xl  px-8 py-2' >
                        {

                            passVisible ? (<FaEyeSlash onClick={Toggle}  />
                            ) : (<FaEye onClick={Toggle} />)

                        }
                    </span>

                </div>
            </div>

            {
                isOTPAvailable ? (<div className='flex justify-between	' >
                    <label className="block text-sm font-medium mb-2" htmlFor="otp">
                        OTP
                    </label>
                    
                        <input
                            minlength="off"
                            maxlength="off"
                            autocomplete="off"
                            autocorrect="off"
                            autocapitalize="off"
                            spellcheck="false"

                            type="text"
                            id="otp"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                        />


                

                </div>) : ("")
            }



            {
                isOTPAvailable ? (<button
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 flex  w-[15%] mx-auto text-white font-bold py-2 px-8 rounded-lg"
                >
                    Signup
                </button>) : (<div
                    onClick={SendOTP}
                    className="flex w-[20%] justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
                >
                    Send OTP
                    <svg
                        class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
                        viewBox="0 0 16 19"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
                            class="fill-gray-800 group-hover:fill-gray-800"
                        ></path>
                    </svg>
                </div>
                )
            }

        </form>
    </div>)
}
                    </div>
                </div>
            </div>

    );
}

export default Signup;

















// import React, { useState } from 'react';
// import processes from "../Assets/JSON/process.json";
// import toast from 'react-hot-toast';
// import Header from './Header';
// import { FaEyeSlash, FaEye } from "react-icons/fa";
// import { useNavigate } from 'react-router-dom';

// function Signup() {
//     const [firstName, setFirstName] = useState('');
//     const [lastName, setLastName] = useState('');
//     const [email, setEmail] = useState('');
//     const [empID, setEmpID] = useState('');
//     const [process, setProcess] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState(null);
//     const [otp, setOtp] = useState(null);
//     const BASE_URL = process.env.REACT_APP_BASE_URL;
//     const [isOTPAvailable, setIsOTPAvailable] = useState(false);
//     const [passVisible, setPassVisible] = useState(false);
//     const navigate = useNavigate();

//     function isValidGmail(email) {
//         const gmailRegex = /^([a-zA-Z0-9._%+-]+)@(gmail|googlemail)\.com$/;
//         return gmailRegex.test(email);
//     }

//     const handleSubmit = async (e) => {
        
//         e.preventDefault();

//         console.log(BASE_URL)


//         try {
//             const response = await fetch(`${BASE_URL}user/create-user`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     firstName,
//                     lastName,
//                     email,
//                     empID,
//                     process,
//                     password,
//                     otp,
//                 }),
//             });

//             if (!response.ok) {
//                 const errorData = await response.json();
//                 throw new Error(errorData.message);
//             }

//             const data = await response.json();

//             if (!data.success) {
//                 throw new Error(data.message);
//             }

//             console.log(data);
//             alert('Signup successful!');
//             navigate('/login');
//         } catch (error) {
//             if (error instanceof TypeError) {
//                 setError('Network error. Please try again.');
//             } else if (error.message === 'Failed to fetch') {
//                 setError('Server error. Please try again later.');
//             } else if (error.response) {
//                 setError(error.response.data.message);
//             } else if (error.message === 'JSON Hydraulic') {
//                 setError('Invalid response from server.');
//             } else {
//                 setError(error.message);
//             }
//         }
//     };

//     function Toggle() {
//         setPassVisible(!passVisible);
//     }

//     const SendOTP = async (e) => {
//         if (isValidGmail(email)) {
//             try {
//                 const response = await fetch(`${BASE_URL}user/send-otp`, {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({ email }),
//                 });

//                 const data = await response.json();
//                 console.log("response", response);
//                 console.log("response.data", data);

//                 if (data.success === true) {
//                     toast.success(data.message);
//                     setIsOTPAvailable(true);
//                 } else if (data.success === false) {
//                     toast.error(data.message);
//                 }
//             } catch (e) {
//                 console.log("ERROR : ", e);
//                 toast(e.message);
//             }
//         } else {
//             toast.error('please enter valid email address');
//         }
//     };

//     return (

//         <div className='mx-auto h-screen ' >
//             <div>
//                 <div>
//                     <Header />
//                 </div>
//                 <div className='flex justify-center py-20 ' >
//                 <div className=" w-[60%] mx-auto border px-4 md:p-2 lg:px-4 bg-white rounded-lg shadow-md">
//                     <h2 className="text-2xl w-[20%] mx-auto  font-bold mb-4">Signup Form</h2>
//                     {error && (
//                         <div className="bg-red-100 border border-red-400 text-red-700 p-4 mb-4 rounded-lg">
//                             {error}
//                         </div>
//                     )}
//                     <form onSubmit={handleSubmit} className="space-y-6">
//                         <div className='flex justify-between	' >
//                             <label className="block text-sm font-medium mb-2" htmlFor="firstName">
//                                 First Name:
//                             </label>
//                             <input
//                                 type="text"
//                                 id="firstName"
//                                 value={firstName}
//                                 onChange={(e) => setFirstName(e.target.value)}
//                                 required
//                                 className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className='flex justify-between	' >
//                             <label className="block text-sm font-medium mb-2" htmlFor="lastName">
//                                 Last Name:
//                             </label>
//                             <input
//                                 type="text"
//                                 id="lastName"
//                                 value={lastName}
//                                 onChange={(e) => setLastName(e.target.value)}
//                                 required
//                                 className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className='flex justify-between	' >
//                             <label className="block text-sm font-medium mb-2" htmlFor="email">
//                                 Email:
//                             </label>
//                             <input
//                                 type="email"
//                                 id="email"
//                                 value={email}
//                                 onChange={(e) => setEmail(e.target.value)}
//                                 required
//                                 className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className='flex justify-between	' >

//                             <label className="block text-sm font-medium mb-2" htmlFor="process">
//                                 Process name
//                             </label>
//                             <select
//                                 id="process"
//                                 value={process}
//                                 onChange={(e) => setProcess(e.target.value)}
//                                 required
//                                 className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                             >
//                                 <option value="">Select Process name</option>
//                                 {processes.map((process) => (
//                                     <option key={process.id} value={process.name}>
//                                         {process.name}
//                                     </option>
//                                 ))}
//                             </select>

//                         </div>
//                         <div className='flex justify-between	' >
//                             <label className="block text-sm font-medium mb-2" htmlFor="process">
//                                 Employee ID:
//                             </label>
//                             <input
//                                 type="text"
//                                 id="empID"
//                                 value={empID}
//                                 onChange={(e) => setEmpID(e.target.value)}
//                                 required
//                                 className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                         </div>
//                         <div className='flex justify-between	' >
//                             <label className="block text-sm font-medium mb-2" htmlFor="password">
//                                 Password:
//                             </label>
//                             <div className='flex w-[80%] '  >


//                                 <input
//                                     type={ passVisible ? "text" : "password"  }
//                                     id="password"
//                                     value={password}
//                                     onChange={(e) => setPassword(e.target.value)}
//                                     required
//                                     className="block w-[90%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                                 />
//                                 <span className='w-[10%] text-2xl  px-8 py-2' >
//                                     {

//                                         passVisible ? (<FaEyeSlash onClick={Toggle}  />
//                                         ) : (<FaEye onClick={Toggle} />)

//                                     }
//                                 </span>

//                             </div>
//                         </div>

//                         {
//                             isOTPAvailable ? (<div className='flex justify-between	' >
//                                 <label className="block text-sm font-medium mb-2" htmlFor="otp">
//                                     OTP
//                                 </label>
                                
//                                     <input
//                                         minlength="off"
//                                         maxlength="off"
//                                         autocomplete="off"
//                                         autocorrect="off"
//                                         autocapitalize="off"
//                                         spellcheck="false"

//                                         type="text"
//                                         id="otp"
//                                         value={otp}
//                                         onChange={(e) => setOtp(e.target.value)}
//                                         required
//                                         className="block w-[80%] p-2 pl-10 text-sm text-gray-700 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
//                                     />


                            

//                             </div>) : ("")
//                         }



//                         {
//                             isOTPAvailable ? (<button
//                                 type="submit"
//                                 className="bg-blue-500 hover:bg-blue-700 flex  w-[15%] mx-auto text-white font-bold py-2 px-8 rounded-lg"
//                             >
//                                 Signup
//                             </button>) : (<div
//                                 onClick={SendOTP}
//                                 className="flex w-[20%] justify-center gap-2 items-center mx-auto shadow-xl text-lg bg-gray-50 backdrop-blur-md lg:font-semibold isolation-auto border-gray-50 before:absolute before:w-full before:transition-all before:duration-700 before:hover:w-full before:-left-full before:hover:left-0 before:rounded-full before:bg-emerald-500 hover:text-gray-50 before:-z-10 before:aspect-square before:hover:scale-150 before:hover:duration-700 relative z-10 px-4 py-2 overflow-hidden border-2 rounded-full group"
//                             >
//                                 Send OTP
//                                 <svg
//                                     class="w-8 h-8 justify-end group-hover:rotate-90 group-hover:bg-gray-50 text-gray-50 ease-linear duration-300 rounded-full border border-gray-700 group-hover:border-none p-2 rotate-45"
//                                     viewBox="0 0 16 19"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
//                                         class="fill-gray-800 group-hover:fill-gray-800"
//                                     ></path>
//                                 </svg>
//                             </div>
//                             )
//                         }

//                     </form>
//                 </div>
//                 </div>
//             </div>
//         </div>

// );
// }

// export default Signup;





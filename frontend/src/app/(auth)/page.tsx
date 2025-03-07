/* eslint-disable @next/next/no-img-element */
"use client"
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

interface IProps {
  email: string;
  password: string;
}

export default function Home() {
  const router = useRouter();
  const MySwal = withReactContent(Swal);
  const { login } = useAuthStore();
  
  const [input, setInput] = useState<IProps>({
      email: "",
      password: ""
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInput({
        ...input,
        [name]: value,
    });
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await axios.post("/baseapi/login", {
      email: input.email,
      password: input.password,
      remember: e.currentTarget.remember.checked,
    })
    .then((res) => {
      MySwal.fire({
        icon: "success",
        title: "Thành công",
        text: res.data.message,
        confirmButtonText: 'Vào Dashboard',
      }).then((result) => {
        if (result.isConfirmed) {
          login(res.data.token, res.data.user);
          router.push("/dashboard");
        }
      });
    }).catch((err) => {
      if(err.response.status === 401){
        MySwal.fire({
          icon: "error",
          title: "Lỗi đăng nhập",
          text: err.response.data.message || "Thông tin đăng nhập không chính xác",
        });
      }else{
        const errs = err.response.data.errors;
        for (const key in errs) {
            const element = errs[key];
            MySwal.fire({
                icon: "error",
                title: "Lỗi",
                text: element[0],
            });
        }
      }
    });
  }
  return (
    <section className="bg-white">
      <div className="flex flex-col lg:flex-row justify-between min-h-screen">
        <div className="lg:w-1/2 px-5 xl:pl-12 pt-10">
          <header>
          </header>
          <div className="max-w-[450px] m-auto pt-24 pb-16">
            <header className="text-center mb-8">
              <h2 className="text-bgray-900 text-4xl font-semibold font-poppins mb-2">
                Đăng nhập.
              </h2>
              <p className="font-urbanis text-base font-medium text-bgray-600 dark:text-bgray-50">
                Quản lý tài chính thông minh
              </p>
            </header>
            <div className="flex flex-col md:flex-row gap-4">
              <a href="#" className="inline-flex justify-center items-center gap-x-2 border border-bgray-300 rounded-lg px-6 py-4 text-base text-bgray-900 font-medium">
                <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.8758 11.2137C20.8758 10.4224 20.8103 9.84485 20.6685 9.24597H11.4473V12.8179H16.8599C16.7508 13.7055 16.1615 15.0424 14.852 15.9406L14.8336 16.0602L17.7492 18.2737L17.9512 18.2935C19.8063 16.6144 20.8758 14.144 20.8758 11.2137Z" fill="#4285F4"></path>
                  <path d="M11.4467 20.625C14.0984 20.625 16.3245 19.7694 17.9506 18.2936L14.8514 15.9408C14.022 16.5076 12.9089 16.9033 11.4467 16.9033C8.84946 16.9033 6.64512 15.2243 5.85933 12.9036L5.74415 12.9131L2.7125 15.2125L2.67285 15.3205C4.28791 18.4647 7.60536 20.625 11.4467 20.625Z" fill="#34A853"></path>
                  <path d="M5.86006 12.9036C5.65272 12.3047 5.53273 11.663 5.53273 11C5.53273 10.3369 5.65272 9.69524 5.84915 9.09636L5.84366 8.96881L2.774 6.63257L2.67357 6.67938C2.00792 7.98412 1.62598 9.44929 1.62598 11C1.62598 12.5507 2.00792 14.0158 2.67357 15.3205L5.86006 12.9036Z" fill="#FBBC05"></path>
                  <path d="M11.4467 5.09664C13.2909 5.09664 14.5349 5.87733 15.2443 6.52974L18.0161 3.8775C16.3138 2.32681 14.0985 1.375 11.4467 1.375C7.60539 1.375 4.28792 3.53526 2.67285 6.6794L5.84844 9.09638C6.64514 6.77569 8.84949 5.09664 11.4467 5.09664Z" fill="#EB4335"></path>
                </svg>
                <span> Sign In with Google </span> </a>
              <a href="#" className="inline-flex justify-center items-center gap-x-2 border border-bgray-300 rounded-lg px-6 py-4 text-base text-bgray-900 font-medium">
                <svg className="fill-bgray-900" width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M19.8744 7.50391C19.7653 7.56519 17.1672 8.85841 17.1672 11.7258C17.2897 14.9959 20.4459 16.1427 20.5 16.1427C20.4459 16.2039 20.0235 17.7049 18.7724 19.2783C17.7795 20.6336 16.6775 22 15.004 22C13.4121 22 12.8407 21.0967 11.004 21.0967C9.03147 21.0967 8.47335 22 6.96314 22C5.28967 22 4.10599 20.5603 3.05896 19.2178C1.69871 17.4606 0.54254 14.703 0.501723 12.0553C0.474217 10.6522 0.774128 9.27304 1.53544 8.10158C2.60998 6.46614 4.52835 5.35595 6.6233 5.31935C8.22845 5.2708 9.65703 6.30777 10.6366 6.30777C11.5754 6.30777 13.3305 5.31935 15.3163 5.31935C16.1735 5.32014 18.4592 5.55173 19.8744 7.50391ZM10.5009 5.03921C10.2151 3.75792 11.004 2.47663 11.7387 1.65931C12.6774 0.670887 14.1601 0 15.4388 0C15.5204 1.28129 15.0031 2.53791 14.0785 3.45312C13.2489 4.44154 11.8203 5.18565 10.5009 5.03921Z"></path>
                </svg>
                <span> Sign In with Apple </span>
              </a>
            </div>
            <div className="relative mt-6 mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-darkblack-400"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white dark:bg-darkblack-500 px-2 text-base text-bgray-600">Hoặc tiếp tục với</span>
              </div>
            </div>
            <form onSubmit={onSubmit}>
              <div className="mb-4">
                <input type="text" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Email" name="email" value={input.email} onChange={handleChange} />
              </div>
              <div className="mb-6 relative">
                <input type="password" className="text-bgray-800 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:outline-none focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base" placeholder="Mật khẩu" name="password" value={input.password} onChange={handleChange} />
                <button type="button" className="absolute top-4 right-4 bottom-4">
                  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 1L20 19" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M9.58445 8.58704C9.20917 8.96205 8.99823 9.47079 8.99805 10.0013C8.99786 10.5319 9.20844 11.0408 9.58345 11.416C9.95847 11.7913 10.4672 12.0023 10.9977 12.0024C11.5283 12.0026 12.0372 11.7921 12.4125 11.417" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                    <path d="M8.363 3.36506C9.22042 3.11978 10.1082 2.9969 11 3.00006C15 3.00006 18.333 5.33306 21 10.0001C20.222 11.3611 19.388 12.5241 18.497 13.4881M16.357 15.3491C14.726 16.4491 12.942 17.0001 11 17.0001C7 17.0001 3.667 14.6671 1 10.0001C2.369 7.60506 3.913 5.82506 5.632 4.65906" stroke="#718096" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </button>
              </div>
              <div className="flex justify-between mb-7">
                <div className="flex items-center space-x-3">
                  <input type="checkbox" className="w-5 h-5 focus:ring-transparent rounded-full border border-bgray-300 focus:accent-success-300 text-success-300" name="remember" id="remember" />
                  <label htmlFor="remember" className="text-bgray-900 text-base font-semibold">Ghi nhớ</label>
                </div>
                <div>
                  <a href="#" data-target="#multi-step-modal" className="modal-open text-success-300 font-semibold text-base underline">Quên mật khẩu?</a>
                </div>
              </div>
              <button type="submit" className="py-3.5 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-lg w-full">
                Đăng Nhập
              </button>
            </form>
            <p className="text-center text-bgray-900 dark:text-bgray-50 text-base font-medium pt-7">
              Bạn chưa có tài khoản? <Link href="/dang-ky" className="font-semibold underline">Đăng Ký</Link>
            </p>
            <p className="text-bgray-600 text-center text-sm mt-6">
              @ 2024 63HTTT2. All Right Reserved.
            </p>
          </div>
        </div>
        <div className="lg:w-1/2 lg:block hidden bg-[#F6FAFF] dark:bg-darkblack-600 p-20 relative">
          <ul>
            <li className="absolute top-10 left-8">
              <img src="/assets/images/square.svg" alt="" />
            </li>
            <li className="absolute right-12 top-14">
              <img src="/assets/images/vline.svg" alt="" />
            </li>
            <li className="absolute bottom-7 left-8">
              <img src="/assets/images/dotted.svg" alt="" />
            </li>
          </ul>
          <div className="">
            <img src="/assets/images/signin.svg" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}

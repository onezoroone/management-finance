"use client"
import { Account } from "@/props/Transaction";
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Wallet() {
    const {token} = useAuthStore();
    const [data, setData] = useState<Account[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [input, setInput] = useState("");
    const MySwal = withReactContent(Swal);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        // Kiểm tra xem đăng nhập hay chưa
        if(token){
            const fetchData = async () => {
                // Lấy danh sách ví
                await axios.get("/baseapi/account", {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }).then(res => {
                    // Nếu api trả về status 200 thì lưu danh sách ví
                    setData(res.data.accounts);
                }).catch(() => {
                    setData([]);
                });

                setIsLoading(false);
            }
            fetchData();
        }
    }, [token, refresh])

    if(isLoading) {
        // Nếu đang loading thì hiển thị loading
        return <div>Loading...</div>;
    }

    const handleAddWallet = async () => {
        // Kiểm tra xem API Key Access có được nhập hay không
        if(input == ""){
            MySwal.fire({
                title: "Vui lòng nhập API Key Access",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        // Hiển thị thông báo đang thêm ví
        MySwal.fire({
            title: "Đang thêm ví...",
            icon: "info",
            confirmButtonText: "OK"
        });
        
        // Gửi API Key Access để thêm ví
        await axios.post("/baseapi/account", {
            api_key_access: input
        }, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(() => {
            // Nếu api trả về status 200 thì hiển thị thông báo thành công
            MySwal.fire({
                title: "Thêm ví thành công",
                icon: "success",
                confirmButtonText: "OK"
            });
            setIsOpenModal(false);
            setRefresh(!refresh);
        }).catch(() => {
            // Nếu api trả về status khác 200 thì hiển thị thông báo thất bại
            MySwal.fire({
                title: "Thêm ví thất bại",
                icon: "error",
                confirmButtonText: "OK"
            });
        });
    };

    const handleOpenModal = () => {
        setIsOpenModal(!isOpenModal);
    };

    return (  
        <div className="2xl:flex 2xl:space-x-[48px]">
            <div className="2xl:w-[424px]">
                <div className="w-full relative rounded-lg bg-white dark:bg-darkblack-600 border border-bgray-300 px-[42px] py-5 mb-6">
                  <div className="my-wallet w-full mb-8">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-bold text-bgray-900">
                        Ví Của Tôi
                      </h3>
                      <div className="payment-select relative mb-3">
                        <button type="button">
                          <svg width="18" height="4" viewBox="0 0 18 4" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 2C8 2.55228 8.44772 3 9 3C9.55228 3 10 2.55228 10 2C10 1.44772 9.55228 1 9 1C8.44772 1 8 1.44772 8 2Z" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M1 2C1 2.55228 1.44772 3 2 3C2.55228 3 3 2.55228 3 2C3 1.44772 2.55228 1 2 1C1.44772 1 1 1.44772 1 2Z" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                            <path d="M15 2C15 2.55228 15.4477 3 16 3C16.5523 3 17 2.55228 17 2C17 1.44772 16.5523 1 16 1C15.4477 1 15 1.44772 15 2Z" stroke="#CBD5E0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <div className="card-slider relative md:w-[340px] w-[280px] slick-initialized slick-slider slick-dotted">
                        <div className="slick-list draggable">
                            <div className="slick-track" style={{opacity: 1}}>
                                <div className="w-full slick-slide" style={{width: '340px'}}>
                                    <Image src="/assets/images/card.jpg" alt="card" width={340} height={180} />
                                </div>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full">
                    <button onClick={handleOpenModal} className="bg-success-300 modal-open hover:bg-success-400 transition-all text-white py-4 w-full font-bold rounded-lg mt-7">
                      Thêm ví
                    </button>
                  </div>
                </div>
            </div>
            <div className="2xl:flex-1">
                <div className="w-full py-[20px] px-[24px] rounded-lg bg-white">
                    <div className="flex flex-col space-y-5">
                        <div className="table-content w-full overflow-x-auto">
                            <table className="w-full">
                                <tbody>
                                    <tr className="border-b border-bgray-300">
                                        <td className="py-5 px-6 xl:px-0">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">
                                                    Tên
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">
                                                    Loại ví
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <div className="w-full flex space-x-2.5 items-center">
                                                <span className="text-base font-medium text-bgray-600">
                                                    Số dư
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    {data.map((item) => (
                                    <tr className="border-b border-bgray-300 dark:border-darkblack-400" key={item.id}>
                                        <td className="py-5 px-6 xl:px-0">
                                            <p className="font-medium text-base text-bgray-900">{item.name}</p>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <p className="font-medium text-base text-bgray-900">{item.type == 'e-wallet' ? 'Ví điện tử' : 'Ngân hàng'}</p>
                                        </td>
                                        <td className="py-5 px-6 xl:px-0">
                                            <p className="font-medium text-base text-bgray-900">{item.balance}</p>
                                        </td>
                                    </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {isOpenModal && <div className="modal fixed inset-0 z-50 overflow-y-auto flex items-center justify-center">
                    <div className="modal-overlay absolute inset-0 bg-gray-500 opacity-75"></div>
                    <div className="modal-content flex justify-center w-full px-4 items-center mx-auto">
                        <div className="step-content step-1">
                            <div className="max-w-[550px] rounded-lg bg-white p-8 pb-10 transition-all relative">
                                <button onClick={handleOpenModal} className="flex justify-center items-center absolute top-6 right-6">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M16.9492 7.05029L7.04972 16.9498" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                        <path d="M7.0498 7.05029L16.9493 16.9498" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                    </svg>
                                </button>
                                <header className="py-6 text-center px-8">
                                    <h3 className="text-2xl font-bold text-bgray-900 mb-3">Thêm ví mới</h3>
                                    <p className="text-sm font-medium text-bgray-600">
                                        Vui lòng điền đầy đủ thông tin ví mới, nếu sử dụng SePay hãy vào trang Sepay để tạo tài khoản và lấy Key API Access
                                    </p>
                                </header>
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-base font-bold text-bgray-900">Loại ví</h4>
                                </div>
                                <div className="flex flex-col md:flex-row justify-between gap-5 md:gap-x-8">
                                    <div className="w-full md:w-1/2 space-y-3">
                                        <div className="flex items-center py-3 px-4 rounded-lg border border-success-300 dark:border-darkblack-400">
                                            <div className="flex flex-1 space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-bgray-100 flex items-center justify-center">
                                                    <Image src="/assets/images/sepay.png" alt="" width={24} height={8} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-bgray-900 text-sm">Sepay</h4>
                                                    <span className="text-xs text-bgray-600 dark:text-bgray-50">Ví trung gian</span>
                                                </div>
                                            </div>
                                            <div>
                                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="8" cy="8" r="8" fill="#22C55E"></circle>
                                                    <path d="M5.27734 8.00011L7.22179 9.94455L11.1107 6.05566" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <div className="flex items-center py-3 px-4 cursor-pointer rounded-lg border">
                                            <div className="flex flex-1 space-x-3">
                                                <div className="w-12 h-12 rounded-full bg-bgray-100 flex items-center justify-center">
                                                    <Image src="/assets/images/vis-xs.svg" alt="" width={24} height={8} />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-bgray-900 text-sm">Visa</h4>
                                                    <span className="text-xs text-bgray-600">Ví quốc tế</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <div className="w-full rounded-lg border border-bgray-200 dark:border-darkblack-400 focus-within:border-success-300 p-4 h-[98px] flex flex-col justify-between">
                                            <p className="text-xs text-bgray-600 font-medium">Nhập API Key Access</p>
                                            <div className="w-full h-[35px] flex justify-between items-center">
                                                <label className="w-full">
                                                    <input value={input} onChange={(e) => setInput(e.target.value)} type="text" className="focus:outline-none dark:bg-darkblack-600 w-full p-0 focus:ring-0 border-none text-2xl font-bold text-bgray-900" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={handleAddWallet} className="bg-success-300 hover:bg-success-400 text-white font-semibold text-base py-4 flex justify-center items-center rounded-lg w-full mt-7">
                                    Thêm
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </div>
    );
}

export default Wallet;
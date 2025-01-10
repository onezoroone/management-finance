"use client"
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import { CircleCheck, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function Telegram() {
    const [currentStep, setCurrentStep] = useState(1);
    const [chatId, setChatId] = useState("");
    const Myswal = withReactContent(Swal);
    const [success, setSuccess] = useState(false);
    const {token, user, setGroup} = useAuthStore();

    useEffect(() => {
        if(user.group_id) {
            setCurrentStep(0);
        }
    }, [user.group_id]);

    const handleConnect = async () => {
        if(chatId.length == 0) {
            Myswal.fire({
                title: "Lỗi",
                text: "Vui lòng nhập ID nhóm Telegram",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }

        // Hiện modal loading
        Myswal.fire({
            title: "Đang kết nối...",
            text: "Vui lòng đợi trong giây lát...",
            icon: "info",
            allowEscapeKey: false,
            allowOutsideClick: false,
            showConfirmButton: false,
        });

        // Gửi request thử kết nối
        await axios.post(`/baseapi/telegram/connect`, {
            chat_id: chatId.startsWith("-") ? chatId : "-" + chatId
        }).then(res => {
            Myswal.fire({
                title: "Thông báo",
                text: res.data.message,
                icon: "success",
                confirmButtonText: "OK"
            });
            setSuccess(true);
        }).catch(() => {
            Myswal.fire({
                title: "Lỗi",
                text: "Kết nối thất bại! Có thể bạn chưa thêm bot vào nhóm hoặc id nhóm không đúng.",
                icon: "error",
                confirmButtonText: "OK"
            });
            setSuccess(false);
        });
    }

    const handleAdd = async () => {
        if(!success) {
            Myswal.fire({
                title: "Lỗi",
                text: "Vui lòng thử kết nối trước khi thêm",
                icon: "error",
                confirmButtonText: "OK"
            });
            return;
        }
        await axios.post(`/baseapi/telegram/add`, {
            chat_id: chatId.startsWith("-") ? chatId : "-" + chatId
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(res => {
            Myswal.fire({
                title: "Thông báo",
                text: res.data.message,
                icon: "success",
                confirmButtonText: "OK"
            });
            setGroup(chatId);
            setChatId('');
        });
    }
    return (  
        <>
        {currentStep == 0 && <div className="md:w-[720px] w-full bg-white h-fit max-w-full mx-auto rounded-[10px]">
            <div className="w-full p-4 flex items-center gap-2 bg-[#d2ebf5] rounded-[10px] text-[#212529]">
                <Info />
                <span>Chia sẻ biến động số dư đến nhóm chat telegram</span>
            </div>
            <div className="overflow-hidden relative my-4">
                <div className="flex px-4 flex-wrap">
                    <div className="w-[70px] h-[70px] bg-[#e0f2fe] text-[#0369a1] rounded-full mx-auto flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="px-4 py-4">
                <div className="mb-4 flex flex-col">
                    <h1 className="text-[18px] font-bold text-[#495057]">
                        Bạn đã thêm nhóm Telegram thành công
                    </h1>
                    <p className="text-[14px] text-[#495057]">
                        Nhóm Telegram đã được thêm vào hệ thống. Bạn có thể chọn cập nhật nhóm mới hoặc chia sẻ biến động số dư đến nhóm Telegram.
                    </p>
                </div>
                <div className="flex justify-center">
                    <button onClick={() => setCurrentStep(2)} className="py-2 px-4 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-[20px]">
                        Cập nhật nhóm mới !
                    </button>
                </div>
            </div>
        </div>}
        {currentStep == 1 && <div className="md:w-[720px] w-full bg-white h-fit max-w-full mx-auto rounded-[10px]">
            <div className="w-full p-4 flex items-center gap-2 bg-[#d2ebf5] rounded-[10px] text-[#212529]">
                <Info />
                <span>Chia sẻ biến động số dư đến nhóm chat telegram</span>
            </div>
            <div className="overflow-hidden relative my-4">
                <div className="flex px-4 flex-wrap">
                    <div className="w-[70px] h-[70px] bg-[#e0f2fe] text-[#0369a1] rounded-full mx-auto flex items-center justify-center shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                        </svg>
                    </div>
                </div>
            </div>
            <div className="px-4 py-4">
                <div className="mb-4 flex flex-col">
                    <ul>
                        <li className="flex items-center flex-wrap">
                            <CircleCheck className="text-white fill-success" />
                            <span>Hệ thống sẽ tự động gửi giao dịch đến nhóm chat telegram dựa trên tài khoản bạn đã kết nối</span>
                        </li>
                        <li className="flex items-center flex-wrap">
                            <CircleCheck className="text-white fill-success" />
                            <span>Tích hợp chatbot vào nhóm chat telegram</span>
                        </li>
                        <li className="flex items-center flex-wrap">
                            <CircleCheck className="text-white fill-success" />
                            <span>Khi thông báo giao dịch kèm lời khuyên tài chính từ AI</span>
                        </li>
                    </ul>
                </div>
                <div className="flex justify-center">
                    <button onClick={() => setCurrentStep(2)} className="py-2 px-4 flex items-center justify-center text-white font-bold bg-success-300 hover:bg-success-400 transition-all rounded-[20px]">
                        Tích hợp ngay !
                    </button>
                </div>
            </div>
        </div>}
        {currentStep == 2 && <div className="max-w-[1300px] w-full h-fit mx-auto rounded-[10px]">
            <div className="flex flex-col px-4 flex-wrap bg-transparent">
                <div className="w-[70px] h-[70px] bg-[#e0f2fe] text-[#0369a1] rounded-full mx-auto flex items-center justify-center shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                    </svg>
                </div>
                <h3 className="font-bold text-[18px] text-center text-[#495057] mt-4">Chia sẻ biến động số dư đến nhóm Telegram.</h3>
            </div>
            <div className="w-full mt-4 text-[#495057]">
                <div className="bg-white">
                    <div className="grid grid-cols-12">
                        <div className="col-span-12 md:col-span-6 border border-[#dee6ed] p-6">
                            <h4 className="mb-2 font-semibold text-[16px]">Hướng dẫn lấy ID nhóm Telegram</h4>
                            <div className="flex gap-y-3 flex-col">
                                <div className="flex items-center">
                                    <div className="w-[100px] flex-none aspect-[1] m-auto mr-4">
                                        <Image src="/assets/images/telegram-add-bot-1.png" className="object-cover w-full h-full rounded-full p-1 border border-[#dee6ed]" alt="step1" width={100} height={100} />
                                    </div>
                                    <div className="w-full">
                                        <p className="mb-0 font-bold text-[15px]">BƯỚC 1</p>
                                        <p className="mb-0">Chọn mục <b>Info</b> của nhóm Telegram cần báo số dư</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[100px] flex-none aspect-[1] m-auto mr-4">
                                        <Image src="/assets/images/telegram-add-bot-2.png" className="object-cover w-full h-full rounded-full p-1 border border-[#dee6ed]" alt="step1" width={100} height={100} />
                                    </div>
                                    <div className="w-full">
                                        <p className="mb-0 font-bold text-[15px]">BƯỚC 2</p>
                                        <p className="mb-0">Nhấp vào nút <b>Add</b> để thêm thành viên vào nhóm</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[100px] flex-none aspect-[1] m-auto mr-4">
                                        <Image src="/assets/images/telegram-add-bot-3.png" className="object-cover w-full h-full rounded-full p-1 border border-[#dee6ed]" alt="step1" width={100} height={100} />
                                    </div>
                                    <div className="w-full">
                                        <p className="mb-0 font-bold text-[15px]">BƯỚC 3</p>
                                        <p className="mb-0">Nhập từ khóa <b>N2C2_bot</b> , sau đó chọn thêm</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <div className="w-[100px] flex-none aspect-[1] m-auto mr-4">
                                        <Image src="/assets/images/telegram-add-bot-4.png" className="object-cover w-full h-full rounded-full p-1 border border-[#dee6ed]" alt="step1" width={100} height={100} />
                                    </div>
                                    <div className="w-full">
                                        <p className="mb-0 font-bold text-[15px]">BƯỚC 4</p>
                                        <p className="mb-0">63HTTT2 Bot sẽ gửi thông báo kèm ID nhóm Telegram. Vui lòng sao chép ID và điền vào <b>ID nhóm Telegram</b>.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-6 border border-[#dee6ed] p-6">
                            <h4 className="mb-2 font-semibold text-[16px]">Thiết lập nhóm Telegram</h4>
                            <div className="flex flex-col gap-y-3">
                                <label htmlFor="chat_id" className="font-bold mb-0">ID nhóm Telegram <span className="text-red-600">*</span></label>
                                <small className="mb-1">Sau khi đã nhận tin nhắn kèm ID nhóm Telegram từ SePay Bot, bạn hãy dán vào trường bên dưới và thử kết nối.</small>
                                <small className="mb-2 text-blue-500">Lưu ý: thử kết nối thành công mới có thể chuyển qua bước tiếp theo</small>
                                <div className="flex items-stretch flex-wrap relative w-full">
                                    <input id="chat_id" type="text" className="relative w-[1%] flex-auto text-[#495057] px-3 py-1 border border-[#ced4da] focus:outline-none" placeholder="-##########" value={chatId} onChange={(e) => setChatId(e.target.value)} />
                                    <button onClick={handleConnect} className="flex items-center gap-1 bg-success text-white transition-all hover:opacity-80 px-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-telegram" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.287 5.906q-1.168.486-4.666 2.01-.567.225-.595.442c-.03.243.275.339.69.47l.175.055c.408.133.958.288 1.243.294q.39.01.868-.32 3.269-2.206 3.374-2.23c.05-.012.12-.026.166.016s.042.12.037.141c-.03.129-1.227 1.241-1.846 1.817-.193.18-.33.307-.358.336a8 8 0 0 1-.188.186c-.38.366-.664.64.015 1.088.327.216.589.393.85.571.284.194.568.387.936.629q.14.092.27.187c.331.236.63.448.997.414.214-.02.435-.22.547-.82.265-1.417.786-4.486.906-5.751a1.4 1.4 0 0 0-.013-.315.34.34 0 0 0-.114-.217.53.53 0 0 0-.31-.093c-.3.005-.763.166-2.984 1.09"/>
                                        </svg>
                                        <span>Thử kết nối</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-4 flex justify-end border border-[#dee6ed]" onClick={handleAdd}>
                        <button className="bg-success text-white px-4 py-2 rounded-[20px] hover:opacity-80 transition-all">
                            Thêm
                        </button>
                    </div>
                </div>
            </div>
        </div>}
        </>
    );
}

export default Telegram;
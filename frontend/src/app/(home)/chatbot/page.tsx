/* eslint-disable react-hooks/exhaustive-deps */
"use client"
import useAuthStore from "@/stores/auth-store";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

interface Message {
    role: string;
    content: string;
    time: string;
}

function ChatBotPage() {
    const {token} = useAuthStore();
    const [currentChat, setCurrentChat] = useState(0);
    const [messages, setMessages] = useState<Message[]>([]);
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(true);

    const handleSaveMessage = (messages: Message[]) => {
        const model = currentChat == 0 ? 'groq' : 'chatgpt';
        sessionStorage.setItem(model, JSON.stringify(messages));
    }

    useEffect(() => {
        const model = currentChat == 0 ? 'groq' : 'chatgpt';
        const storedMessages = sessionStorage.getItem(model);
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
            setIsTyping(false);
        }else{
            if(token){
                const fetchMessages = async () => {
                    await axios.post('/baseapi/chatbot/messages',{
                        model: currentChat ==  0 ? 'groq' : 'chatgpt'
                    },{
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    .then((res) => {
                        setMessages([res.data]);
                        handleSaveMessage([res.data]);
                        setIsTyping(false);
                    });
                }
                fetchMessages();
            }
        }
    }, [currentChat, token]);

    const handleChat = (chat: number) => {
        setCurrentChat(chat);
    }

    const handleSendMessage = async () => {
        if(isTyping) return;
        if (!message.trim()) return;
        const model = currentChat == 0 ? 'groq' : 'chatgpt';
        const newMessage: Message = {
            role: 'user',
            content: message,
            time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        };
        let newMessages = [...messages, newMessage];
        setMessages(newMessages);
        setMessage('');
        setIsTyping(true);
        
        await axios.post('/baseapi/chatbot/messages',{
            model: model,
            prompt: message
        },{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            newMessages = [...newMessages, res.data];
            setMessages(newMessages);
            setIsTyping(false);
        });

        handleSaveMessage(newMessages);
    }

    return (  
        <section className="lg:grid grid-cols-12 relative">
            <aside className="h-full 2xl:col-span-3 xl:col-span-4 lg:col-span-5 bg-white border border-bgray-200 pr-7 pl-12 pt-6 pb-10 hidden lg:block">
                <header>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-3xl font-semibold text-bgray-900">
                      Tin nhắn (2)
                    </h3>
                    <button>
                      <svg className="stroke-darkblack-400" width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22 12.7508V18.7411C22 20.9466 20.2091 22.7346 18 22.7346H6C3.79086 22.7346 2 20.9466 2 18.7411V6.76059C2 4.55504 3.79086 2.76709 6 2.76709H12M15.6864 4.78655C15.6864 4.78655 15.6864 6.21452 17.1167 7.64249C18.547 9.07046 19.9773 9.07046 19.9773 9.07046M9.15467 16.7339L12.1583 16.3055C12.5916 16.2437 12.9931 16.0433 13.3025 15.7343L21.4076 7.64249C22.1975 6.85384 22.1975 5.57519 21.4076 4.78655L19.9773 3.35857C19.1873 2.56993 17.9066 2.56993 17.1167 3.35857L9.01164 11.4504C8.70217 11.7594 8.50142 12.1602 8.43952 12.5928L8.01044 15.5915C7.91508 16.2579 8.4872 16.8291 9.15467 16.7339Z" strokeWidth="1.5" strokeLinecap="round"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-4 top-3"><svg className="fill-bgray-900 dark:fill-bgray-50" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.75 11.5C2.75 16.3325 6.66751 20.25 11.5 20.25C16.3325 20.25 20.25 16.3325 20.25 11.5C20.25 6.66751 16.3325 2.75 11.5 2.75C6.66751 2.75 2.75 6.66751 2.75 11.5ZM11.5 21.75C5.83908 21.75 1.25 17.1609 1.25 11.5C1.25 5.83908 5.83908 1.25 11.5 1.25C17.1609 1.25 21.75 5.83908 21.75 11.5C21.75 14.0605 20.8111 16.4017 19.2589 18.1982L22.5303 21.4697C22.8232 21.7626 22.8232 22.2374 22.5303 22.5303C22.2374 22.8232 21.7626 22.8232 21.4697 22.5303L18.1982 19.2589C16.4017 20.8111 14.0605 21.75 11.5 21.75Z"></path>
                      </svg>
                    </span>
                    <input type="text" className=" w-full bg-bgray-100 border-0 focus:border focus:border-success-300 focus:ring-0 rounded-lg py-3.5 pl-12" placeholder="Tìm tin nhắn" />
                  </div>
                </header>
                <div className="pt-6">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-x-2.5">
                                <svg className="fill-darkblack-400 dark:fill-bgray-50" width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.7682 2.90596C8.94657 2.08568 7.54172 2.66664 7.54172 3.8267C7.54172 4.17204 7.40431 4.50324 7.15972 4.74744L6.07925 5.82615C5.83466 6.07034 5.50292 6.20753 5.15701 6.20753C3.99506 6.20753 3.41315 7.61009 4.23477 8.43038L5.81896 10.012L2.14059 13.6844C1.95314 13.8715 1.95314 14.175 2.14059 14.3621C2.32804 14.5492 2.63196 14.5492 2.81941 14.3621L6.49779 10.6897L8.08195 12.2713C8.90358 13.0916 10.3084 12.5106 10.3084 11.3506C10.3084 11.0052 10.4458 10.674 10.6904 10.4298L11.7709 9.35112C12.0155 9.10692 12.3472 8.96974 12.6931 8.96974C13.8551 8.96974 14.437 7.56717 13.6154 6.74688L9.7682 2.90596Z"></path>
                                </svg>
                                <span className="text-base text-bgray-700 font-medium">Tin nhắn đã lưu (2)</span>
                            </div>
                            <div>
                                <button>
                                <svg className="stroke-darkblack-400" width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.99984 12.1761C9.07936 12.1761 8.33317 11.4311 8.33317 10.5121C8.33317 9.59312 9.07936 8.84814 9.99984 8.84814C10.9203 8.84814 11.6665 9.59312 11.6665 10.5121C11.6665 11.4311 10.9203 12.1761 9.99984 12.1761Z" strokeWidth="1.5"></path>
                                    <path d="M16.6665 12.1761C15.746 12.1761 14.9998 11.4311 14.9998 10.5121C14.9998 9.59312 15.746 8.84814 16.6665 8.84814C17.587 8.84814 18.3332 9.59312 18.3332 10.5121C18.3332 11.4311 17.587 12.1761 16.6665 12.1761Z" strokeWidth="1.5"></path>
                                    <path d="M3.33317 12.1761C2.4127 12.1761 1.6665 11.4311 1.6665 10.5121C1.6665 9.59312 2.4127 8.84814 3.33317 8.84814C4.25365 8.84814 4.99984 9.59312 4.99984 10.5121C4.99984 11.4311 4.25365 12.1761 3.33317 12.1761Z" strokeWidth="1.5"></path>
                                </svg>
                                </button>
                            </div>
                        </div>
                        <ul className="pt-2 divide-y divide-bgray-300">
                            <li className="p-3.5 flex justify-between hover:bg-bgray-100 hover:rounded-lg transition-all cursor-pointer" onClick={() => handleChat(0)}>
                                <div className="flex space-x-3 grow">
                                    <div className="w-14 h-14 relative">
                                        <Image src="/assets/images/groq_logo.jpg" className="rounded-full" alt="Groq" width={56} height={56} />
                                        <span className="bg-success-300 border-2 border-white block w-[14px] h-[14px] rounded-full absolute bottom-1 right-0"></span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-bgray-900">Groq</h4>
                                        <span className="text-sm font-medium text-bgray-600 dark:text-bgray-50">Tin nhắn mới</span>
                                    </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                    <span className="text-lg font-semibold text-bgray-700 dark:text-bgray-50">
                                        {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.6665 6.49599L7.22208 10.9332C6.60843 11.5459 6.60843 12.5392 7.22208 13.1518C7.83573 13.7645 8.83065 13.7645 9.4443 13.1518L13.8887 8.7146C15.116 7.48929 15.116 5.50268 13.8887 4.27738C12.6614 3.05207 10.6716 3.05207 9.4443 4.27738L4.99985 8.7146C3.1589 10.5526 3.1589 13.5325 4.99985 15.3704C6.8408 17.2084 9.82557 17.2084 11.6665 15.3704L16.111 10.9332" stroke="#2A313C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </span>
                                </div>
                            </li>
                            <li className="p-3.5 flex justify-between hover:bg-bgray-100 hover:rounded-lg transition-all cursor-pointer" onClick={() => handleChat(1)}>
                                <div className="flex space-x-3 grow">
                                    <div className="w-14 h-14 relative">
                                        <Image src="/assets/images/chatgpt.png" className="rounded-full" alt="CHATGPT" width={56} height={56} />
                                        <span className="bg-red-600 border-2 border-white block w-[14px] h-[14px] rounded-full absolute bottom-1 right-0"></span>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-bgray-900">ChatGPT</h4>
                                        <span className="text-sm font-medium text-bgray-600 dark:text-bgray-50">Đang bảo trì</span>
                                    </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                    <span className="text-lg font-semibold text-bgray-700 dark:text-bgray-50">
                                        Bảo trì
                                    </span>
                                    <span><svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11.6665 6.49599L7.22208 10.9332C6.60843 11.5459 6.60843 12.5392 7.22208 13.1518C7.83573 13.7645 8.83065 13.7645 9.4443 13.1518L13.8887 8.7146C15.116 7.48929 15.116 5.50268 13.8887 4.27738C12.6614 3.05207 10.6716 3.05207 9.4443 4.27738L4.99985 8.7146C3.1589 10.5526 3.1589 13.5325 4.99985 15.3704C6.8408 17.2084 9.82557 17.2084 11.6665 15.3704L16.111 10.9332" stroke="#2A313C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
            <div className="w-full bg-white p-2 overflow-x-scroll flex lg:hidden">
                <div className="flex space-x-5">
                    <div className="w-14 h-14 relative" onClick={() => handleChat(0)}>
                        <Image src="/assets/images/groq_logo.jpg" className="rounded-full" alt="User" width={56} height={56} />
                        <span className="bg-success-300 dark:border-bgray-900 border-2 border-white block w-[14px] h-[14px] rounded-full absolute bottom-1 right-0"></span>
                    </div>
                    <div className="w-14 h-14 relative" onClick={() => handleChat(1)}>
                        <Image src="/assets/images/chatgpt.png" className="rounded-full" alt="User" width={56} height={56} />
                        <span className="bg-red-600 dark:border-bgray-900 border-2 border-white block w-[14px] h-[14px] rounded-full absolute bottom-1 right-0"></span>
                    </div>
                </div>
            </div>
            <div className="2xl:col-span-9 xl:col-span-8 lg:col-span-7 col-span-12 relative">
                <header className="bg-white p-5 lg:pr-24 flex justify-between items-center border-t border-bgray-300">
                  <div className="flex space-x-3">
                    <div className="relative">
                      <Image src={`/assets/images/${currentChat === 0 ? 'groq_logo.jpg' : 'chatgpt.png'}`} className="w-12 h-12 rounded-full" alt="User" width={48} height={48} />
                      <span className={`${currentChat === 0 ? 'bg-success-300' : 'bg-red-600'} border-2 border-white block w-[14px] h-[14px] rounded-full absolute bottom-1 right-0`}></span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-bgray-900">
                        {currentChat === 0 ? 'Groq' : 'ChatGPT'}
                      </h4>
                      <span className="text-sm text-bgray-600">{currentChat === 0 ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                  <button type="button" className="w-12 h-12 rounded-full grid place-items-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M12 20C12.5523 20 13 19.5523 13 19C13 18.4477 12.5523 18 12 18C11.4477 18 11 18.4477 11 19C11 19.5523 11.4477 20 12 20Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                      <path d="M12 6C12.5523 6 13 5.55228 13 5C13 4.44772 12.5523 4 12 4C11.4477 4 11 4.44772 11 5C11 5.55228 11.4477 6 12 6Z" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                    </svg>
                  </button>
                </header>
                <div className="lg:pt-20 lg:px-11 p-5 mb-5 lg:mb-0 space-y-10 overflow-y-scroll h-[550px]">
                    {messages.map((message, index) => (
                        message.role === 'user' ? (
                            <div className="flex justify-end items-end space-x-3" key={index}>
                                <div>
                                    <span className="text-xs text-bgray-500 font-medium">{message.time}</span>
                                </div>
                                <div className="flex space-x-3">
                                    <div className="p-3 bg-success-300 rounded-r-lg rounded-b-lg text-white text-sm font-medium">
                                        {message.content}
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Image src={`/assets/images/profile-52x52.png`} className="w-10 h-10 rounded-full" alt="" width={36} height={36} />
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-start items-end space-x-3" key={index}>
                                <div className="flex space-x-3">
                                    <div className="flex-shrink-0">
                                        <Image src={`/assets/images/${currentChat === 0 ? 'groq_logo.jpg' : 'chatgpt.png'}`} className="w-10 h-10 rounded-full" alt="" width={36} height={36} />
                                    </div>
                                    <div className="p-3 bg-bgray-200 rounded-r-lg rounded-b-lg text-bgray-900 text-sm font-medium">
                                        {message.content}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-bgray-500 font-medium">{message.time}</span>
                                </div>
                            </div>
                        )
                    ))}
                    {isTyping && (
                        <div className="flex justify-start items-end space-x-3">
                            <div className="flex space-x-3 max-w-full">
                                <div className="flex-shrink-0">
                                    <Image src={`/assets/images/${currentChat === 0 ? 'groq_logo.jpg' : 'chatgpt.png'}`} className="w-10 h-10 rounded-full" alt="" width={36} height={36} />
                                </div>
                                <div className="p-3 bg-bgray-200 rounded-r-lg rounded-b-lg text-bgray-900 text-sm font-medium flex items-center">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <span className="text-xs text-bgray-500 font-medium">
                                    {new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="lg:px-11 px-5 lg:mb-0 mb-5 w-full">
                    <div className="custom-quill-2">
                        <textarea className="w-full h-20 bg-white rounded-lg p-3 focus:outline-none focus:ring-0 focus:border-success-300 border border-bgray-300 text-sm text-bgray-900 placeholder:text-bgray-500 resize-none " placeholder="Nhập tin nhắn" value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                    </div>
                    <div className="flex justify-end mt-4">
                      <button className="bg-success-400 rounded-lg flex items-center justify-center px-4 py-2.5 font-semibold text-sm gap-1.5 text-white" onClick={handleSendMessage}>
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M15.0586 7.09154L7.92522 3.52487C3.13355 1.12487 1.16689 3.09153 3.56689 7.8832L4.29189 9.3332C4.50022 9.7582 4.50022 10.2499 4.29189 10.6749L3.56689 12.1165C1.16689 16.9082 3.12522 18.8749 7.92522 16.4749L15.0586 12.9082C18.2586 11.3082 18.2586 8.69153 15.0586 7.09154ZM12.3669 10.6249H7.86689C7.52522 10.6249 7.24189 10.3415 7.24189 9.99987C7.24189 9.6582 7.52522 9.37487 7.86689 9.37487H12.3669C12.7086 9.37487 12.9919 9.6582 12.9919 9.99987C12.9919 10.3415 12.7086 10.6249 12.3669 10.6249Z" fill="white"></path>
                        </svg>
                        <span>Gửi</span>
                      </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ChatBotPage;
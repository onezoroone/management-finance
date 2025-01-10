interface DropDownProps {
    title: string;
    placeholder: string;
    type?: string;
    isActive: boolean;
    onToggle: () => void;
    options?: Option[];
    selectedItems: number[];
    setSelectedItems: (items: number[]) => void;
}
interface Option {
    id: number;
    name: string;
}

function DropDown({ title, placeholder, type, isActive, onToggle, options, selectedItems, setSelectedItems }: DropDownProps) {
    const handleChange = (id: number) => {
        setSelectedItems([id]);
        onToggle();
    }

    const selectedLabels = selectedItems
        .map((id) => options?.find((option) => option.id === id)?.name)
        .filter(Boolean);

    const selectedText = selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder;
    return (  
        <div className="w-full">
            <p className="text-base text-bgray-900 leading-[24px] font-bold mb-2">
                {title}
            </p>
            <div className="w-full h-[56px] relative">
                <button onClick={onToggle} type="button" className="w-full h-full rounded-lg bg-bgray-100 px-4 flex justify-between items-center relative dark:bg-darkblack-500">
                    {type != 'date' ? <span className="text-base text-bgray-500">{selectedText}</span> : <input type="date" className="w-full h-full rounded-lg bg-bgray-100 px-4 flex justify-between items-center relative" />}
                    <span>
                        {type == 'date' ? <svg className="stroke-bgray-500" width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M18.6758 5.8186H6.67578C5.57121 5.8186 4.67578 6.71403 4.67578 7.8186V19.8186C4.67578 20.9232 5.57121 21.8186 6.67578 21.8186H18.6758C19.7804 21.8186 20.6758 20.9232 20.6758 19.8186V7.8186C20.6758 6.71403 19.7804 5.8186 18.6758 5.8186Z" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M16.6758 3.8186V7.8186" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M8.67578 3.8186V7.8186" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M4.67578 11.8186H20.6758" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M11.6758 15.8186H12.6758" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                                  <path d="M12.6758 15.8186V18.8186" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>: <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.58203 8.3186L10.582 13.3186L15.582 8.3186" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>}
                    </span>
                </button>
                {isActive && <div className="rounded-lg w-full shadow-lg bg-white absolute right-0 z-10 top-14 overflow-hidden">
                    {type != 'date' && <ul>
                        {options && options.map((option) => (
                        <li key={option.id} className="text-sm cursor-pointer px-5 py-2 hover:bg-bgray-100 font-semibold" onClick={() => handleChange(option.id)}>
                            {option.name}
                        </li>
                        ))}
                    </ul>}
                </div>}
            </div>
        </div>
    );
}

export default DropDown;
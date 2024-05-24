import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RiArrowUpSLine } from "react-icons/ri";
// Structure of Iprops
interface IProps {
    title: string;
    open: boolean;
    children: any;
    onClick: () => Promise<void>;
}

const Collapsible: React.FC<IProps> = ({ title, children, open, onClick }) => {
    
    //State if element is open or close
    const [isOpen, setIsOpen] = useState(open);

    const handleOpening = () => {
        setIsOpen(prev => !prev);
        handleClick();
    }
        const handleClick: () => Promise<void> = async () => {
            await onClick();

    };

    return (
        <div className="align-items-center coll-div" onClick={handleOpening}>
            <div className="d-flex bglight justify-content-between border border-dark">
                <h3 className=" h3details p-2">{title}</h3>
                <button className="btn btn-outline-dark border-0"> {isOpen ?
                    //Icons
                    <IoIosArrowDown className="m-2" />
                    :
                    <RiArrowUpSLine size={16} className="m-2" />
                }
                </button>
            </div>
            <div>
                <div>{!isOpen && <div className="p-2 collapsibleDiv border border-dark">{children}</div>}</div>
            </div>
        </div>
    );
};
export default Collapsible;

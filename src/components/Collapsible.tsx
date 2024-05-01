import React, { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { RiArrowUpSLine } from "react-icons/ri";

interface IProps {
    title: string;
    open: boolean;
    children: any;
}

const Collapsible: React.FC<IProps> = ({title, children, open}) => {
    const [isOpen, setIsOpen] = useState(open);

 const handleOpening = () => {
    setIsOpen(prev => !prev);

 };

 return(
    
    <div className="align-items-center" onClick={handleOpening}
    >
      <div className="d-flex bglight justify-content-between border border-dark"><p className=" p-2">{title}</p>
       <p> { !isOpen ? 
    <IoIosArrowDown   className="m-2"/>
        :
            <RiArrowUpSLine size={20} className= "m-2"/>
        }
        </p>
    </div>
    <div className="border-bottom">
    <div>{isOpen && <div className="p-3">{children}</div>}</div>
  </div>
    </div>
 );
};
export default Collapsible;

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
    
    <div className="container justify-content-between" onClick={handleOpening}
    ><p>{title}
        { !isOpen ? 
     <RiArrowUpSLine/>
        :
           <IoIosArrowDown/>
        }
        </p>
    
    <div className="border-bottom">
    <div>{isOpen && <div className="p-3">{children}</div>}</div>
  </div>
    </div>
 );
};
export default Collapsible;

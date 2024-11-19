import "../styles/sidebar.css";
import { FaCog, FaUser, FaSignOutAlt, } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp, IoRestaurant } from "react-icons/io5";
import { IoIosHelpCircle, IoMdInformationCircle } from "react-icons/io";
import { MdDashboard } from "react-icons/md";
import { Link } from 'react-router-dom';


const Icon = ({ icon }: { icon: JSX.Element }) => (
  <li>
    <Link to="/"><p>{icon}</p></Link>
  </li>
);

function SideBar() {
  return (
    <header>
      <div className="top-menu">
        <div className="side-icon"><Link to="/"><MdDashboard title="Order" /></Link></div>
        <div className="side-icon"><Link to="/chat"><IoChatbubbleEllipsesSharp title="Chat with sales rep"/></Link></div>
        <div className="side-icon"><Link to="/comingsoon"><IoRestaurant title="Book a seat"/></Link></div>
        <div className="side-icon"><Link to="/help"><IoIosHelpCircle title="FAQs"/></Link></div>
        <div className="side-icon"><Link to="/about"><IoMdInformationCircle title="About"/></Link></div>
        <div className="side-icon"><Link to="/profile"><FaUser title="Your Profile"/></Link></div>
        <div className="side-icon"><Link to="/settings"><FaCog title="Settings"/></Link></div>
      </div>

      <div className="bottom-menu">
        <Link to="/"><FaSignOutAlt title="Logout"/></Link>
      </div>

    </header>
  );
}

export default SideBar;

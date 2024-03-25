import React, { useEffect, useState } from 'react'
import { Link, matchPath } from 'react-router-dom'
import logo from "../../assets/Logo/Logo-Full-Light.png"
import {NavbarLinks} from "../../data/navbar-links"
import { useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaCartShopping } from "react-icons/fa6";
import ProfileDropdown from "../core/Auth/ProfileDropdown"
import { apiConnector } from '../../services/apiConnector'
import { categories } from '../../services/apis'
import { IoIosArrowDown } from "react-icons/io";

function Navbar() {

    const {token} = useSelector((state) => state.auth)
    const {user} = useSelector((state) => state.profile)
    const {totalItems} = useSelector((state) => state.cart) 

    const location = useLocation(); 

    const [sublinks, setSublinks] = useState([]);

    const fetchSublinks  = async() => {
        try {
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("printing sublinks:", result);
            setSublinks(result.data.allCategory);
        } 
        catch (error) {
            console.log("Cannot fetch the catagory list");
            console.log(error);
        }
    }


    useEffect(() => {
        fetchSublinks();
    }, [])

    const matchRoute = (route) => {
        return matchPath({path:route}, location.pathname);
    }

    function makeSlug(str) {
        return str
            .toLowerCase()
            .replace(' ', '-')
    }

  return (
    <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
        <div className='flex w-11/12 max-w-maxContent items-center justify-between'>

            {/* logo  */}
            <Link to={"/"}>
                <img src={logo} alt='' width={160} height={42} loading='lazy' />
            </Link>

            {/* Navlinks  */}
            <nav>
                <ul className='flex gap-x-6 text-richblack-25'>
                    {
                        NavbarLinks.map((link, index) => {
                            return (
                                <li key={index}>
                                    {
                                        link.title === "Catalog" 
                                        ? (
                                            <div className='flex items-center gap-2 cursor-pointer group relative'>   
                                                <p>{link.title}</p>
                                                <IoIosArrowDown />

                                                <div className='invisible absolute left-[50%] 
                                                translate-x-[-50%]
                                                translate-y-[20%]
                                                top-[50%] flex flex-col rounded-md bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-200 group-hover:visible
                                                group-hover:opacity-100
                                                lg:w-[300px] z-50
                                                '>
                                                    {/* triangular shape  */}
                                                    <div className='absolute left-[50%] -top-2 h-6 w-6 rotate-45 rounded bg-richblack-5'></div>
                                                    
                                                    {
                                                        sublinks.length ? (
                                                            sublinks.map((sublink, index) => (

                                                                <Link to={`/catalog/${makeSlug(sublink.name)}`}
                                                                key={index}
                                                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                >
                                                                    {sublink.name}
                                                                </Link>
                                                            ))
                                                        ) : (<div></div>)
                                                    }
                                                </div>
                                            </div>
                                        ) 
                                        : (
                                            <Link to={link?.path}>
                                                <p className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"}`}>
                                                    {link.title}
                                                </p>
                                            </Link>
                                        )
                                    }
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>

            {/* Login / Signup / Dashboard  */}
            <div className='flex gap-x-4 items-center'>
                
                {/* cart icon  */}
                {
                    user && user?.accountType !== "Instructor" && (
                        <Link to={"/dashboard/cart"} className='relative'>
                            <FaCartShopping />
                            {
                                totalItems > 0 && (
                                    <span>
                                        {totalItems}
                                    </span>
                                )
                            }   
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to={"/login"}>
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-5 rounded-md'>
                                Login
                            </button>
                        </Link>
                    )
                }
                {
                    token === null && (
                        <Link to={"/signup"}>
                            <button className='border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-5 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )
                }
                {
                    token !== null && 
                    <ProfileDropdown />
                }

            </div>

        </div>
    </div>
  )
}

export default Navbar
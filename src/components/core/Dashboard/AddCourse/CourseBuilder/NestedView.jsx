import React, {  useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RxDropdownMenu } from "react-icons/rx";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailsAPI';
import { setCourse } from '../../../../../store/slices/courseSlice';
import { BiSolidDownArrow } from "react-icons/bi";
import ConfirmationModal from '../../../../common/ConfirmationModal';
import {HiOutlinePlusCircle} from "react-icons/hi"
import SubsectionModal from './SubsectionModal';

const NestedView = ({handleChangeEditSectionName}) => {

  const {course} = useSelector((state) => state.course)
  const [confirmationModal, setConfirmationModal] = useState(null);
  const dispatch = useDispatch();
  const {token} = useSelector((state) => state.auth)

  //States to keep track of mode of Modal [add, view, edit]
  const [addSubsection, setAddSubsection] = useState(null);
  const [viewSubsection, setViewSubsection] = useState(null);
  const [editSubsection, setEditSubsection] = useState(null);


  const handleDeleteSection = async(sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
    }, token);

    if(result) {
      dispatch(setCourse(result));
    }

    setConfirmationModal(null);
  }

  const handleDeleteSubsection = async (subsectionId, sectionId) => {
      const result = await deleteSubSection({subsectionId, sectionId}, token)

      if(result) {
        //update the structure of course
        const updatedCourseContent = course.courseContent.map((section) => 
          section._id === sectionId ? result : section
        )

        const updatedCourse = {...course, courseContent: updatedCourseContent};
        dispatch(setCourse(updatedCourse))
      }

      setConfirmationModal(null)
  }

  return (
    <>
      <div className="rounded-lg bg-richblack-700 p-6 px-8">
        {
          course?.courseContent.map((section) => (
            <details key={section._id} open>
              <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
                <div className="flex items-center gap-x-3">
                  <RxDropdownMenu className="text-2xl text-richblack-50" />
                  <p className="font-semibold text-richblack-50" >
                    {section.sectionName}
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <button
                  onClick={() => handleChangeEditSectionName(section._id, section.sectionName)}
                  >
                    <MdModeEditOutline className="text-xl text-richblack-300" />
                  </button>

                  <button
                  onClick={() => {
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleteSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }}
                  >
                    <RiDeleteBin5Line className="text-xl text-richblack-300" />
                  </button>

                  <span className="font-medium text-richblack-300" >|</span>

                  <BiSolidDownArrow className={`text-sm text-richblack-300`} />
                </div>
              </summary>
              
              {/* DropDown content  */}
              <div className="px-6 pb-4">
                {
                  section.subsection.map((data) => (
                    <div
                    key={data._id}
                    onClick={() => setViewSubsection(data)}
                    className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                    >
                      <div className="flex items-center gap-x-3 py-2 ">
                        <RxDropdownMenu className="text-2xl text-richblack-50" />
                        <p className="font-semibold text-richblack-50">
                          {data.title}
                        </p>
                      </div>

                      <div 
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-x-3">
                        {/* edit button  */}
                        <button
                          onClick={() => setEditSubsection({...data, sectionId: section._id})}
                        >
                          <MdModeEditOutline className="text-xl text-richblack-300" />
                        </button>

                        {/* delete button  */}
                        <button
                          onClick={() => setConfirmationModal({
                            text1: "Delete this Subsection?",
                            text2: "This lecture will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () => handleDeleteSubsection(data._id, section._id),
                            btn2Handler: () => setConfirmationModal(null),
                          })}
                        >
                            <RiDeleteBin5Line className="text-xl text-richblack-300" />
                        </button>
                      </div>
                    </div>
                  ))
                }

                {/* Add New Lecture Button  */}
                <button 
                  onClick={() => setAddSubsection(section._id)}
                  className="mt-3 flex items-center gap-x-1 text-yellow-50"
                >
                  <HiOutlinePlusCircle className="text-lg" />
                  <p>Add Lecture</p>
                </button>

              </div>
            </details>
          ))      
        }
      </div>

      {/* Modal Display  */}
      {
        addSubsection &&
        <SubsectionModal
          modalData={addSubsection}
          setModalData={setAddSubsection}
          add={true}
        />
      }
      {
        viewSubsection &&
        <SubsectionModal
          modalData={viewSubsection}
          setModalData={setViewSubsection}
          view={true}
        />
      }
      {
        editSubsection &&
        <SubsectionModal
          modalData={editSubsection}
          setModalData={setEditSubsection}
          edit={true}
        />
      }

      {
        confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
        ) : (<></>)
      }
    </>
  )
}

export default NestedView

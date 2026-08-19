import  { useState, useRef, useEffect, } from 'react';
import JoditEditorRaw from "jodit-react";
const JoditEditor = JoditEditorRaw?.default || JoditEditorRaw;
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { message, Spin } from 'antd';
import PageHeading from '../../shared/PageHeading';
import { useAddNewsletterMutation } from '../redux/api/metaDataApi';




const PrivacyPolicy = () => {
const [updateTerms] = useAddNewsletterMutation()

  const editor = useRef(null);
  const [content, setContent] = useState('');
   const [isLoading, setLoading] = useState(false)
  const navigate = useNavigate(); 
const handleTerms = async () => {
  const data = { content };

  try {
    setLoading(true);

    const res = await updateTerms(data).unwrap();

    message.success(res?.message || "Newsletter update successfull");
  } catch (error) {
    console.error("Error updating terms:", error);
    message.error(error?.data?.message || "Failed to update terms. Please try again.");
  } finally {
    setLoading(false);
  }
};

  const config = {
      readonly: false,
      placeholder: 'Start typings...',
      style: {
          height: 600,
      },
      buttons: [
          'image', 'fontsize', 'bold', 'italic', 'underline', '|',
          'font', 'brush',
          'align'
      ]
  }


  return (
    <div className=" mx-auto ">
      <PageHeading title="Newsletter" />
      <JoditEditor
        ref={editor}
        value={content}
        config={config}
        tabIndex={1}
        onBlur={newContent => setContent(newContent)}
        onChange={newContent => { }}
      />
      

     <div className="mt-5 flex justify-center">
        <button
       onClick={handleTerms}
       disabled={isLoading}
          className="bg-[#4444ff] py-2 px-4 rounded text-white"
        >
            {isLoading ? (
                <Spin size="small" /> 
              ) : (
                "Update"
              )}
        </button>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
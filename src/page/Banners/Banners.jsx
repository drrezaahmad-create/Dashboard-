import { Input, Modal, Popconfirm, message } from "antd";
import PageHeading from "../../shared/PageHeading";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import { IoSearch } from "react-icons/io5";
import { useState, useRef } from "react";
import { SearchInput } from "../../components/search/SearchInput";
import AddBanner from "./AddBanner";
import {
  useDeleteBannerMutation,
  useGetBannerQuery,
} from "../redux/api/productManageApi";
import { imageUrl } from "../redux/api/baseApi";
import EditBanner from "./EditBanner";

const Banners = () => {
  const [openAddModal, setOpenAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const { data: bannerData } = useGetBannerQuery();
  console.log(bannerData);
  const [deleteData] = useDeleteBannerMutation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProcedure, setSelectedProcedure] = useState(null);

  const handleEdit = (record) => {
    setSelectedProcedure(record);
    setEditModal(true);
  };

  const handleDeleteClick = async (id) => {
    try {
      const res = await deleteData(id).unwrap();
      message.success(res?.message);
    } catch (err) {
      message.error(err?.data?.message);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <main className="pb-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-5 gap-5">
        <PageHeading title="Banners" />
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 w-full md:w-auto">
          <button
            onClick={() => setOpenAddModal(true)}
            className="w-full md:w-auto px-6 py-3 bg-[#136BFB] rounded-lg text-white flex items-center justify-center gap-2 hover:bg-blue-600 transition-colors whitespace-nowrap"
          >
            <FiPlus className="w-5 h-5" />
            Add New Blog
          </button>
        </div>
      </header>

      {/* === Banner Grid === */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bannerData?.data?.length > 0 ? (
          bannerData?.data.map((banner) => (
            <div
              key={banner.id}
              className="rounded-lg shadow-sm overflow-hidden border border-gray-200 p-3"
            >
              <img
                src={`${imageUrl}${banner.imageUrl}`}
                alt={"asdf"}
                className="w-full h-[160px] object-cover rounded-md"
              />

              <div className="flex items-center justify-between mt-5">
                <Popconfirm
                  title="Are you sure to delete this Banner?"
                  okText="Yes"
                  cancelText="No"
                  onConfirm={() => handleDeleteClick(banner?._id)}
                >
                  <button className="px-5 py-2 text-[#FF3B30] font-semibold border border-[#FF3B30] rounded-lg hover:bg-[#FF3B30] hover:text-white transition">
                    Delete
                  </button>
                </Popconfirm>
                <button
                  onClick={() => handleEdit(banner)}
                  className="px-5 py-2 bg-[#017FF4] text-white font-semibold border border-[#017FF4] rounded-lg hover:bg-[#0167D3] transition"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-400">
              No banners found matching your search.
            </p>
          </div>
        )}
      </section>

      <AddBanner
        openAddModal={openAddModal}
        setOpenAddModal={setOpenAddModal}
      ></AddBanner>
      <EditBanner
        editModal={editModal}
        setEditModal={setEditModal}
        selectedProcedure={selectedProcedure}
      ></EditBanner>
    </main>
  );
};

export default Banners;
